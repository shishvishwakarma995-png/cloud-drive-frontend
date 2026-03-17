'use client';
import { useState } from 'react';
import { X, Link2, Copy, Check, Lock, Clock, Trash2 } from 'lucide-react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/api';
import { useTheme } from '@/context/ThemeContext';

interface Props {
  item: { id: string; name: string };
  type: 'file' | 'folder';
  onClose: () => void;
}

export default function LinkModal({ item, type, onClose }: Props) {
  const { t } = useTheme();
  const queryClient = useQueryClient();
  const [password, setPassword] = useState('');
  const [expiresIn, setExpiresIn] = useState('7');
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState('');

  const { data: linksData } = useQuery({
    queryKey: ['my-links'],
    queryFn: async () => {
      const res = await api.get('/api/files/my-links');
      return res.data;
    },
  });

  // Find existing link for this item
  const existingLink = linksData?.links?.find(
    (l: any) => l.resource_id === item.id && l.resource_type === type
  );

  const createLink = useMutation({
    mutationFn: async () => {
      const res = await api.post(`/api/files/link/${type}/${item.id}`, {
        expiresIn: expiresIn === 'never' ? null : expiresIn,
        password: password || null,
      });
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['my-links'] });
      setError('');
    },
    onError: (err: any) => {
      setError(err.response?.data?.error?.message || 'Failed to create link');
    },
  });

  const deleteLink = useMutation({
    mutationFn: async (id: string) => {
      await api.delete(`/api/files/link/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['my-links'] });
    },
  });

  const getShareUrl = (token: string) => {
    return `${window.location.origin}/share/${token}`;
  };

  const handleCopy = (token: string) => {
    navigator.clipboard.writeText(getShareUrl(token));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className={`w-full max-w-md rounded-3xl shadow-2xl border ${t.border} ${t.sidebar.split(' ')[0]} p-6`}>

        {/* Header */}
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-3">
            <div className={`w-9 h-9 rounded-xl ${t.accentBg} flex items-center justify-center`}>
              <Link2 size={18} className={t.accentText} />
            </div>
            <div>
              <h2 className={`font-bold text-base ${t.text}`}>Public Link</h2>
              <p className={`text-xs ${t.textSub} truncate max-w-48`}>{item.name}</p>
            </div>
          </div>
          <button onClick={onClose} className={`p-2 rounded-xl ${t.hover} ${t.textSub}`}>
            <X size={18} />
          </button>
        </div>

        {/* Existing link */}
        {existingLink ? (
          <div className={`rounded-2xl border ${t.border} p-4 mb-4 ${t.accentBg}`}>
            <p className={`text-xs font-semibold uppercase tracking-widest mb-2 ${t.textSub}`}>Active Link</p>

            {/* Link URL */}
            <div className={`flex items-center gap-2 p-2.5 rounded-xl border ${t.border} mb-3 ${t.bg}`}>
              <p className={`text-xs truncate flex-1 ${t.textMuted}`}>
                {getShareUrl(existingLink.token)}
              </p>
              <button
                onClick={() => handleCopy(existingLink.token)}
                className={`shrink-0 p-1.5 rounded-lg ${t.hover} transition`}>
                {copied
                  ? <Check size={14} className="text-green-400" />
                  : <Copy size={14} className={t.accentText} />}
              </button>
            </div>

            {/* Expiry info */}
            <div className="flex items-center justify-between">
              <div className={`flex items-center gap-1.5 text-xs ${t.textSub}`}>
                <Clock size={12} />
                {existingLink.expires_at
                  ? `Expires ${new Date(existingLink.expires_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}`
                  : 'Never expires'}
              </div>
              <button
                onClick={() => deleteLink.mutate(existingLink.id)}
                className="flex items-center gap-1.5 text-xs text-red-500 hover:text-red-400 transition">
                <Trash2 size={12} /> Remove
              </button>
            </div>
          </div>
        ) : (
          <div className={`rounded-2xl border ${t.border} p-4 mb-4 ${t.accentBg}`}>
            <p className={`text-xs ${t.textSub} text-center`}>No public link yet — create one below!</p>
          </div>
        )}

        {/* Create / Update link */}
        <div className="space-y-3 mb-4">
          {/* Expiry */}
          <div>
            <label className={`block text-xs font-semibold uppercase tracking-widest mb-1.5 ${t.textSub}`}>
              Link Expiry
            </label>
            <select
              value={expiresIn}
              onChange={e => setExpiresIn(e.target.value)}
              className={`w-full px-3 py-2.5 rounded-xl border text-sm outline-none ${t.input} ${t.text}`}>
              <option value="1">1 day</option>
              <option value="7">7 days</option>
              <option value="30">30 days</option>
              <option value="never">Never</option>
            </select>
          </div>

          {/* Password */}
          <div>
            <label className={`block text-xs font-semibold uppercase tracking-widest mb-1.5 ${t.textSub}`}>
              Password (optional)
            </label>
            <div className="relative">
              <Lock size={14} className={`absolute left-3.5 top-1/2 -translate-y-1/2 ${t.textSub}`} />
              <input
                type="text"
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="Leave empty for no password"
                className={`w-full pl-9 pr-4 py-2.5 rounded-xl border text-sm outline-none ${t.input} ${t.text}`}
              />
            </div>
          </div>
        </div>

        {error && <p className="text-red-500 text-xs mb-3">{error}</p>}

        {/* Buttons */}
        <div className="flex gap-2">
          <button onClick={onClose}
            className={`flex-1 py-2.5 rounded-xl border text-sm font-semibold transition ${t.border} ${t.textMuted} ${t.hover}`}>
            Cancel
          </button>
          <button
            onClick={() => createLink.mutate()}
            disabled={createLink.isPending}
            className={`flex-1 py-2.5 rounded-xl text-sm font-semibold transition text-white ${t.accent} disabled:opacity-60`}>
            {createLink.isPending ? 'Creating...' : existingLink ? 'Update Link' : 'Create Link'}
          </button>
        </div>

      </div>
    </div>
  );
}
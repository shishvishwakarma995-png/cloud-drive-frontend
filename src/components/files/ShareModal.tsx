'use client';
import { useState } from 'react';
import { X, Share2, Mail, Check, Loader2, AlertCircle, Trash2, UserCheck } from 'lucide-react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/api';
import { useTheme } from '@/context/ThemeContext';

interface Props {
  item: { id: string; name: string };
  type: 'file' | 'folder';
  onClose: () => void;
}

export default function ShareModal({ item, type, onClose }: Props) {
  const { t } = useTheme();
  const queryClient = useQueryClient();
  const [email, setEmail] = useState('');
  const [permission, setPermission] = useState<'view' | 'edit'>('view');
  const [done, setDone] = useState(false);
  const [error, setError] = useState('');

  // Get existing shares
  const { data: sharesData, refetch } = useQuery({
    queryKey: ['shares', item.id],
    queryFn: async () => {
      const res = await api.get(`/api/files/shares/${type}/${item.id}`);
      return res.data;
    },
  });

  const shares = sharesData?.shares || [];

  const share = useMutation({
    mutationFn: async () => {
      await api.post(`/api/files/share/${type}/${item.id}`, { email, permission });
    },
    onSuccess: () => {
      setDone(true);
      setError('');
      refetch();
      setTimeout(() => {
        setDone(false);
        setEmail('');
      }, 2000);
    },
    onError: (err: any) => {
      setError(err.response?.data?.error?.message || 'Failed to share');
    },
  });

  const removeShare = useMutation({
    mutationFn: async (shareId: string) => {
      await api.delete(`/api/files/share/${shareId}`);
    },
    onSuccess: () => {
      refetch();
      queryClient.invalidateQueries({ queryKey: ['shared-with-me'] });
    },
  });

  const handleShare = () => {
    if (!email.trim()) return setError('Email required');
    if (!email.includes('@')) return setError('Invalid email');
    setError('');
    share.mutate();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className={`w-full max-w-md rounded-3xl shadow-2xl border ${t.border} ${t.sidebar.split(' ')[0]} p-6`}>

        {/* Header */}
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-3">
            <div className={`w-9 h-9 rounded-xl ${t.accentBg} flex items-center justify-center`}>
              <Share2 size={18} className={t.accentText} />
            </div>
            <div>
              <h2 className={`font-bold text-base ${t.text}`}>Share</h2>
              <p className={`text-xs ${t.textSub} truncate max-w-48`}>{item.name}</p>
            </div>
          </div>
          <button onClick={onClose} className={`p-2 rounded-xl ${t.hover} ${t.textSub} transition`}>
            <X size={18} />
          </button>
        </div>

        {/* Existing shares list */}
        {shares.length > 0 && (
          <div className={`rounded-2xl border ${t.border} mb-4 overflow-hidden`}>
            <p className={`px-3 py-2 text-xs font-semibold uppercase tracking-wider ${t.textSub} ${t.accentBg} border-b ${t.border}`}>
              Shared with ({shares.length})
            </p>
            {shares.map((s: any) => (
              <div key={s.id} className={`flex items-center gap-3 px-3 py-2.5 ${t.hover} border-b ${t.border} last:border-0`}>
                <div className={`w-7 h-7 rounded-full ${t.accent} flex items-center justify-center text-white text-xs font-bold shrink-0`}>
                  {s.shared_with_email?.charAt(0).toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                  <p className={`text-xs font-medium truncate ${t.text}`}>{s.shared_with_email}</p>
                  <p className={`text-xs ${s.permission === 'edit' ? 'text-green-500' : t.textSub}`}>
                    {s.permission === 'edit' ? '✏️ Can edit' : '👁️ View only'}
                  </p>
                </div>
                <button
                  onClick={() => removeShare.mutate(s.id)}
                  disabled={removeShare.isPending}
                  className="p-1.5 rounded-lg hover:bg-red-50 text-red-400 hover:text-red-500 transition shrink-0"
                  title="Remove access">
                  <Trash2 size={13} />
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Success State */}
        {done && (
          <div className={`flex items-center gap-3 p-3 rounded-xl mb-4 bg-green-50 border border-green-200`}>
            <div className="w-7 h-7 bg-green-500 rounded-full flex items-center justify-center shrink-0">
              <Check size={14} className="text-white" />
            </div>
            <div>
              <p className="text-sm font-semibold text-green-700">Shared successfully!</p>
              <p className="text-xs text-green-600">{email} can now {permission === 'view' ? 'view' : 'edit'} this {type}</p>
            </div>
          </div>
        )}

        {/* Permission Toggle */}
        <div className={`flex gap-2 mb-4 p-1 rounded-xl border ${t.border} ${t.accentBg}`}>
          <button
            onClick={() => setPermission('view')}
            className={`flex-1 py-1.5 rounded-lg text-xs font-semibold transition ${
              permission === 'view' ? `${t.accent} text-white shadow-sm` : t.textMuted
            }`}>
            👁️ View only
          </button>
          <button
            onClick={() => setPermission('edit')}
            className={`flex-1 py-1.5 rounded-lg text-xs font-semibold transition ${
              permission === 'edit' ? `${t.accent} text-white shadow-sm` : t.textMuted
            }`}>
            ✏️ Can edit
          </button>
        </div>

        {/* Info box */}
        <div className={`flex items-start gap-2 p-3 rounded-xl mb-4 ${t.accentBg} border ${t.border}`}>
          <AlertCircle size={14} className={`${t.accentText} shrink-0 mt-0.5`} />
          <p className={`text-xs ${t.textSub}`}>
            The person must have a Cloud Drive account.
            They can find it in <span className={t.accentText}>"Shared with Me"</span> section.
          </p>
        </div>

        {/* Email Input */}
        <div className="mb-4">
          <label className={`block text-xs font-semibold mb-1.5 ${t.textSub}`}>
            Add people
          </label>
          <div className="relative">
            <Mail size={15} className={`absolute left-3.5 top-1/2 -translate-y-1/2 ${t.textSub}`} />
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleShare()}
              placeholder="friend@example.com"
              className={`w-full pl-10 pr-4 py-2.5 rounded-xl border text-sm outline-none ${t.input} ${t.text} ${
                error ? 'border-red-400' : t.border
              }`}
            />
          </div>
          {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
        </div>

        {/* Buttons */}
        <div className="flex gap-2">
          <button onClick={onClose}
            className={`flex-1 py-2.5 rounded-xl border text-sm font-semibold transition ${t.border} ${t.textMuted} ${t.hover}`}>
            Close
          </button>
          <button
            onClick={handleShare}
            disabled={share.isPending || !email}
            className={`flex-1 py-2.5 rounded-xl text-sm font-semibold transition text-white ${t.accent} hover:opacity-90 disabled:opacity-60`}>
            {share.isPending ? (
              <span className="flex items-center justify-center gap-2">
                <Loader2 size={14} className="animate-spin" /> Sharing...
              </span>
            ) : (
              <span className="flex items-center justify-center gap-2">
                <UserCheck size={14} /> Share
              </span>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
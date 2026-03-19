'use client';
import { useTheme } from '@/context/ThemeContext';
import { useQuery } from '@tanstack/react-query';
import api from '@/lib/api';
import { Upload, Trash2, Star, Share2, Pencil, FolderOpen, Download, RotateCcw } from 'lucide-react';
import Sidebar from '@/components/layout/Sidebar';
import Toolbar from '@/components/layout/Toolbar';
import { useState } from 'react';

const actionConfig: Record<string, { icon: any; color: string; label: string }> = {
  upload: { icon: Upload, color: 'text-green-500', label: 'Uploaded' },
  delete: { icon: Trash2, color: 'text-red-500', label: 'Deleted' },
  restore: { icon: RotateCcw, color: 'text-blue-500', label: 'Restored' },
  rename: { icon: Pencil, color: 'text-yellow-500', label: 'Renamed' },
  move: { icon: FolderOpen, color: 'text-purple-500', label: 'Moved' },
  share: { icon: Share2, color: 'text-pink-500', label: 'Shared' },
  star: { icon: Star, color: 'text-yellow-400', label: 'Starred' },
  download: { icon: Download, color: 'text-blue-400', label: 'Downloaded' },
};

export default function ActivityPage() {
  const { t } = useTheme();
  const [view, setView] = useState<'grid' | 'list'>('grid');

  const { data, isLoading } = useQuery({
    queryKey: ['activity'],
    queryFn: async () => {
      const [filesRes, trashRes] = await Promise.all([
        api.get('/api/files/recent'),
        api.get('/api/files/trash'),
      ]);

      const recentFiles = (filesRes.data?.files || []).map((f: any) => ({
        id: f.id,
        action: 'upload',
        name: f.name,
        type: 'file',
        time: f.created_at,
      }));

      const trashedFiles = (trashRes.data?.files || []).map((f: any) => ({
        id: f.id + '-trash',
        action: 'delete',
        name: f.name,
        type: 'file',
        time: f.updated_at,
      }));

      return [...recentFiles, ...trashedFiles]
        .sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime())
        .slice(0, 30);
    },
  });

  const formatTime = (dateStr: string) => {
    const date = new Date(dateStr);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const mins = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);
    if (mins < 1) return 'Just now';
    if (mins < 60) return `${mins}m ago`;
    if (hours < 24) return `${hours}h ago`;
    if (days < 7) return `${days}d ago`;
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  return (
    <div className={`flex min-h-screen ${t.bg}`}>
      <Sidebar />
      <div className="ml-64 flex-1 flex flex-col">
        <Toolbar
          currentFolderId={null}
          view={view}
          onViewChange={setView}
          onFolderNavigate={() => {}}
        />
        <div className="flex-1 p-6 max-w-3xl">
          <div className="mb-6">
            <h1 className={`text-2xl font-bold ${t.text}`}>Activity</h1>
            <p className={`text-sm mt-1 ${t.textSub}`}>Recent actions on your files</p>
          </div>

          {isLoading && (
            <div className="space-y-3">
              {[1, 2, 3, 4, 5].map(i => (
                <div key={i} className={`h-16 rounded-2xl animate-pulse ${t.accentBg}`} />
              ))}
            </div>
          )}

          {!isLoading && (!data || data.length === 0) && (
            <div className={`text-center py-16 ${t.textSub}`}>
              <Upload size={40} className="mx-auto mb-3 opacity-30" />
              <p>No activity yet</p>
            </div>
          )}

          {!isLoading && data && data.length > 0 && (
            <div className={`rounded-2xl border ${t.border}`} style={{ overflow: 'visible' }}>
              {data.map((item: any, i: number) => {
                const config = actionConfig[item.action] || actionConfig.upload;
                const Icon = config.icon;
                return (
                  <div key={item.id}
                    className={`flex items-center gap-4 px-5 py-4 ${t.hover} transition ${
                      i !== data.length - 1 ? `border-b ${t.border}` : ''
                    } ${i === 0 ? 'rounded-t-2xl' : ''} ${i === data.length - 1 ? 'rounded-b-2xl' : ''}`}>
                    <div className={`w-9 h-9 rounded-xl ${t.accentBg} flex items-center justify-center shrink-0`}>
                      <Icon size={16} className={config.color} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className={`text-sm font-medium ${t.text}`}>
                        <span className={config.color}>{config.label}</span>
                        {' '}
                        <span className="truncate">{item.name}</span>
                      </p>
                      <p className={`text-xs ${t.textSub}`}>{item.type}</p>
                    </div>
                    <span className={`text-xs shrink-0 ${t.textSub}`}>{formatTime(item.time)}</span>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
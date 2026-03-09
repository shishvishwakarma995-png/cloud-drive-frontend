'use client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import Sidebar from '@/components/layout/Sidebar';
import FileGrid from '@/components/files/FileGrid';
import { useTheme } from '@/context/ThemeContext';
import { Star, Folder } from 'lucide-react';
import api from '@/lib/api';

export default function StarredPage() {
  const { t } = useTheme();
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ['starred'],
    queryFn: async () => {
      const res = await api.get('/api/files/starred');
      return res.data;
    },
  });

  const toggleStar = useMutation({
    mutationFn: async ({ type, id }: { type: string; id: string }) => {
      await api.patch(`/api/files/star/${type}/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['starred'] });
      queryClient.invalidateQueries({ queryKey: ['files'] });
      queryClient.invalidateQueries({ queryKey: ['folders'] });
    },
  });

  const files = data?.files || [];
  const folders = data?.folders || [];
  const isEmpty = files.length === 0 && folders.length === 0;

  return (
    <div className={`flex min-h-screen ${t.bg}`}>
      <Sidebar />
      <div className="ml-64 flex-1 flex flex-col">

        {/* Header */}
        <div className={`flex items-center gap-3 px-6 py-4 border-b ${t.border} ${t.sidebar.split(' ')[0]}`}>
          <div className={`w-9 h-9 rounded-xl ${t.accentBg} flex items-center justify-center`}>
            <Star size={18} className={t.accentText} />
          </div>
          <div>
            <h1 className={`font-bold text-lg ${t.text}`}>Starred</h1>
            <p className={`text-xs ${t.textSub}`}>{files.length + folders.length} items</p>
          </div>
        </div>

        <div className="flex-1 p-6">
          {isLoading && (
            <div className="grid grid-cols-6 gap-3">
              {[...Array(12)].map((_, i) => (
                <div key={i} className={`border ${t.border} rounded-2xl p-4 animate-pulse h-24 ${t.accentBg}`} />
              ))}
            </div>
          )}

          {!isLoading && isEmpty && (
            <div className="flex flex-col items-center justify-center h-72 text-center">
              <div className={`w-20 h-20 rounded-2xl ${t.accentBg} flex items-center justify-center mb-4`}>
                <Star size={36} className={t.accentText} />
              </div>
              <p className={`font-semibold text-lg ${t.text}`}>No starred items</p>
              <p className={`text-sm mt-1 ${t.textMuted}`}>Star files and folders to find them quickly</p>
            </div>
          )}

          {/* Starred Folders */}
          {!isLoading && folders.length > 0 && (
            <div className="mb-6">
              <h3 className={`text-xs font-bold uppercase tracking-widest mb-3 ${t.textSub}`}>
                Folders — {folders.length}
              </h3>
              <div className={`rounded-2xl border ${t.border} overflow-hidden`}>
                {folders.map((folder: any, i: number) => (
                  <div key={folder.id}
                    className={`flex items-center gap-3 px-4 py-3 ${t.hover} transition ${i !== folders.length - 1 ? `border-b ${t.border}` : ''}`}>
                    <div className={`w-8 h-8 rounded-lg ${t.accentBg} flex items-center justify-center`}>
                      <Folder size={16} className={t.accentText} />
                    </div>
                    <span className={`flex-1 text-sm font-medium ${t.text}`}>{folder.name}</span>
                    <button
                      onClick={() => toggleStar.mutate({ type: 'folder', id: folder.id })}
                      className="p-1.5 rounded-lg hover:bg-yellow-50 transition"
                      title="Unstar">
                      <Star size={15} className="text-yellow-400 fill-yellow-400" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Starred Files */}
          {!isLoading && files.length > 0 && (
            <div>
              <h3 className={`text-xs font-bold uppercase tracking-widest mb-3 ${t.textSub}`}>
                Files — {files.length}
              </h3>
              <FileGrid files={files} view="grid" />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
'use client';
import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import Sidebar from '@/components/layout/Sidebar';
import { useTheme } from '@/context/ThemeContext';
import { Trash2, RotateCcw, X, Folder, File, Image, Film, FileText } from 'lucide-react';
import api from '@/lib/api';

const getFileIcon = (mimeType: string) => {
  if (mimeType?.startsWith('image/')) return { icon: Image, color: 'text-pink-500', bg: 'bg-pink-50' };
  if (mimeType?.startsWith('video/')) return { icon: Film, color: 'text-purple-500', bg: 'bg-purple-50' };
  if (mimeType?.includes('pdf') || mimeType?.includes('text')) return { icon: FileText, color: 'text-red-500', bg: 'bg-red-50' };
  return { icon: File, color: 'text-slate-500', bg: 'bg-slate-100' };
};

export default function TrashPage() {
  const { t } = useTheme();
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ['trash'],
    queryFn: async () => {
      const res = await api.get('/api/files/trash');
      return res.data;
    },
  });

  const restore = useMutation({
    mutationFn: async ({ type, id }: { type: string; id: string }) => {
      await api.patch(`/api/files/restore/${type}/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['trash'] });
      queryClient.invalidateQueries({ queryKey: ['files'] });
      queryClient.invalidateQueries({ queryKey: ['folders'] });
    },
  });

  const permanentDelete = useMutation({
    mutationFn: async ({ type, id }: { type: string; id: string }) => {
      await api.delete(`/api/files/permanent/${type}/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['trash'] });
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
        <div className={`flex items-center justify-between px-6 py-4 border-b ${t.border} ${t.sidebar.split(' ')[0]}`}>
          <div className="flex items-center gap-3">
            <div className={`w-9 h-9 rounded-xl ${t.accentBg} flex items-center justify-center`}>
              <Trash2 size={18} className={t.accentText} />
            </div>
            <div>
              <h1 className={`font-bold text-lg ${t.text}`}>Trash</h1>
              <p className={`text-xs ${t.textSub}`}>{files.length + folders.length} items</p>
            </div>
          </div>
          {!isEmpty && (
            <button
              onClick={() => { if (confirm('Permanently delete all items?')) { files.forEach((f: any) => permanentDelete.mutate({ type: 'file', id: f.id })); folders.forEach((f: any) => permanentDelete.mutate({ type: 'folder', id: f.id })); } }}
              className="text-sm text-red-500 hover:text-red-600 font-medium px-4 py-2 rounded-xl hover:bg-red-50 transition">
              Empty Trash
            </button>
          )}
        </div>

        <div className="flex-1 p-6">
          {isLoading && (
            <div className="grid grid-cols-4 gap-3">
              {[...Array(8)].map((_, i) => (
                <div key={i} className={`border ${t.border} rounded-2xl p-4 animate-pulse h-20 ${t.accentBg}`} />
              ))}
            </div>
          )}

          {!isLoading && isEmpty && (
            <div className="flex flex-col items-center justify-center h-72 text-center">
              <div className={`w-20 h-20 rounded-2xl ${t.accentBg} flex items-center justify-center mb-4`}>
                <Trash2 size={36} className={t.accentText} />
              </div>
              <p className={`font-semibold text-lg ${t.text}`}>Trash is empty</p>
              <p className={`text-sm mt-1 ${t.textMuted}`}>Deleted files will appear here</p>
            </div>
          )}

          {/* Folders */}
          {!isLoading && folders.length > 0 && (
            <div className="mb-6">
              <h3 className={`text-xs font-bold uppercase tracking-widest mb-3 ${t.textSub}`}>Folders — {folders.length}</h3>
              <div className={`rounded-2xl border ${t.border} overflow-hidden`}>
                {folders.map((folder: any, i: number) => (
                  <div key={folder.id}
                    className={`flex items-center gap-3 px-4 py-3 ${t.hover} transition ${i !== folders.length - 1 ? `border-b ${t.border}` : ''}`}>
                    <div className={`w-8 h-8 rounded-lg ${t.accentBg} flex items-center justify-center`}>
                      <Folder size={16} className={t.accentText} />
                    </div>
                    <span className={`flex-1 text-sm font-medium ${t.text}`}>{folder.name}</span>
                    <span className={`text-xs ${t.textSub} mr-4`}>
                      {new Date(folder.updated_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                    </span>
                    <button onClick={() => restore.mutate({ type: 'folder', id: folder.id })}
                      className={`p-1.5 rounded-lg ${t.hover} ${t.accentText} transition`} title="Restore">
                      <RotateCcw size={15} />
                    </button>
                    <button onClick={() => { if (confirm('Permanently delete?')) permanentDelete.mutate({ type: 'folder', id: folder.id }); }}
                      className="p-1.5 rounded-lg hover:bg-red-50 text-red-500 transition" title="Delete forever">
                      <X size={15} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Files */}
          {!isLoading && files.length > 0 && (
            <div>
              <h3 className={`text-xs font-bold uppercase tracking-widest mb-3 ${t.textSub}`}>Files — {files.length}</h3>
              <div className={`rounded-2xl border ${t.border} overflow-hidden`}>
                {files.map((file: any, i: number) => {
                  const { icon: Icon, color, bg } = getFileIcon(file.mime_type);
                  return (
                    <div key={file.id}
                      className={`flex items-center gap-3 px-4 py-3 ${t.hover} transition ${i !== files.length - 1 ? `border-b ${t.border}` : ''}`}>
                      <div className={`w-8 h-8 rounded-lg ${bg} flex items-center justify-center`}>
                        <Icon size={16} className={color} />
                      </div>
                      <span className={`flex-1 text-sm font-medium ${t.text}`}>{file.name}</span>
                      <span className={`text-xs ${t.textSub} mr-4`}>
                        {new Date(file.updated_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                      </span>
                      <button onClick={() => restore.mutate({ type: 'file', id: file.id })}
                        className={`p-1.5 rounded-lg ${t.hover} ${t.accentText} transition`} title="Restore">
                        <RotateCcw size={15} />
                      </button>
                      <button onClick={() => { if (confirm('Permanently delete?')) permanentDelete.mutate({ type: 'file', id: file.id }); }}
                        className="p-1.5 rounded-lg hover:bg-red-50 text-red-500 transition" title="Delete forever">
                        <X size={15} />
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
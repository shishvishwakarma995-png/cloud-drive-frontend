'use client';
import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import Sidebar from '@/components/layout/Sidebar';
import { useTheme } from '@/context/ThemeContext';
import { Users, Folder, Download, Pencil, Trash2, MoreVertical, File, Image, Film, FileText, Archive, Music, Check, X } from 'lucide-react';
import api from '@/lib/api';
import FilePreviewModal from '@/components/files/FilePreviewModal';

const getFileIcon = (mimeType: string) => {
  if (!mimeType) return { icon: File, color: 'text-slate-500', bg: 'bg-slate-100' };
  if (mimeType.startsWith('image/')) return { icon: Image, color: 'text-pink-500', bg: 'bg-pink-50' };
  if (mimeType.startsWith('video/')) return { icon: Film, color: 'text-purple-500', bg: 'bg-purple-50' };
  if (mimeType.startsWith('audio/')) return { icon: Music, color: 'text-blue-500', bg: 'bg-blue-50' };
  if (mimeType.includes('pdf') || mimeType.includes('document') || mimeType.includes('text')) return { icon: FileText, color: 'text-red-500', bg: 'bg-red-50' };
  if (mimeType.includes('zip') || mimeType.includes('rar')) return { icon: Archive, color: 'text-yellow-500', bg: 'bg-yellow-50' };
  return { icon: File, color: 'text-slate-500', bg: 'bg-slate-100' };
};

const formatSize = (bytes: number) => {
  if (!bytes) return '—';
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
};

const handleDownload = async (url: string, name: string) => {
  try {
    const res = await fetch(url);
    const blob = await res.blob();
    const blobUrl = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = blobUrl;
    a.download = name;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(blobUrl);
  } catch {
    window.open(url, '_blank');
  }
};

export default function SharedPage() {
  const { t } = useTheme();
  const queryClient = useQueryClient();
  const [menuOpen, setMenuOpen] = useState<string | null>(null);
  const [previewFile, setPreviewFile] = useState<any | null>(null);
  const [renaming, setRenaming] = useState<string | null>(null);
  const [newName, setNewName] = useState('');

  const { data, isLoading } = useQuery({
    queryKey: ['shared-with-me'],
    queryFn: async () => {
      const res = await api.get('/api/files/shared-with-me');
      return res.data;
    },
  });

  const renameFile = useMutation({
    mutationFn: async ({ id, name }: { id: string; name: string }) => {
      await api.patch(`/api/files/${id}/rename`, { name });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['shared-with-me'] });
      setRenaming(null);
      setNewName('');
    },
  });

  const deleteFile = useMutation({
    mutationFn: async (id: string) => {
      await api.delete(`/api/files/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['shared-with-me'] });
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
            <Users size={18} className={t.accentText} />
          </div>
          <div>
            <h1 className={`font-bold text-lg ${t.text}`}>Shared with Me</h1>
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
                <Users size={36} className={t.accentText} />
              </div>
              <p className={`font-semibold text-lg ${t.text}`}>No shared files yet</p>
              <p className={`text-sm mt-1 ${t.textMuted}`}>Files shared with you will appear here</p>
            </div>
          )}

          {/* Shared Folders */}
          {!isLoading && folders.length > 0 && (
            <div className="mb-6">
              <h3 className={`text-xs font-bold uppercase tracking-widest mb-3 ${t.textSub}`}>
                Folders — {folders.length}
              </h3>
              <div className={`rounded-2xl border ${t.border}`} style={{ overflow: 'visible' }}>
                {folders.map((folder: any, i: number) => (
                  <div key={folder.id}
                    className={`flex items-center gap-3 px-4 py-3 ${t.hover} transition ${i !== folders.length - 1 ? `border-b ${t.border}` : ''}`}>
                    <div className={`w-8 h-8 rounded-lg ${t.accentBg} flex items-center justify-center`}>
                      <Folder size={16} className={t.accentText} />
                    </div>
                    <span className={`flex-1 text-sm font-medium ${t.text}`}>{folder.name}</span>
                    <span className={`text-xs px-2 py-0.5 rounded-full ${
                      folder.permission === 'edit'
                        ? 'bg-green-100 text-green-600'
                        : `${t.accentBg} ${t.accentText}`
                    } font-medium`}>
                      {folder.permission === 'edit' ? '✏️ Can edit' : '👁️ View only'}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Shared Files */}
          {!isLoading && files.length > 0 && (
            <div>
              <h3 className={`text-xs font-bold uppercase tracking-widest mb-3 ${t.textSub}`}>
                Files — {files.length}
              </h3>
              <div className={`rounded-2xl border ${t.border}`} style={{ overflow: 'visible' }}>
                {/* Header row */}
                <div className={`grid grid-cols-12 px-4 py-2.5 border-b ${t.border} text-xs font-semibold uppercase tracking-wider ${t.textSub} ${t.accentBg} rounded-t-2xl`}>
                  <span className="col-span-5">Name</span>
                  <span className="col-span-2">Size</span>
                  <span className="col-span-2">Permission</span>
                  <span className="col-span-2">Shared</span>
                  <span className="col-span-1"></span>
                </div>

                {files.map((file: any, i: number) => {
                  const { icon: Icon, color, bg } = getFileIcon(file.mime_type);
                  const canEdit = file.permission === 'edit';

                  return (
                    <div key={file.id}
                      onDoubleClick={() => setPreviewFile(file)}
                      className={`grid grid-cols-12 items-center px-4 py-3 transition group cursor-pointer ${t.hover} ${i !== files.length - 1 ? `border-b ${t.border}` : ''}`}>

                      {/* Name */}
                      <div className="col-span-5 flex items-center gap-3">
                        <div className={`w-8 h-8 rounded-lg ${bg} flex items-center justify-center shrink-0`}>
                          <Icon size={16} className={color} />
                        </div>
                        {renaming === file.id ? (
                          <div className="flex items-center gap-2">
                            <input
                              autoFocus
                              value={newName}
                              onChange={e => setNewName(e.target.value)}
                              onKeyDown={e => {
                                if (e.key === 'Enter') renameFile.mutate({ id: file.id, name: newName });
                                if (e.key === 'Escape') { setRenaming(null); setNewName(''); }
                              }}
                              onClick={e => e.stopPropagation()}
                              className={`text-sm px-2 py-0.5 rounded-lg border outline-none ${t.input} ${t.text} w-32`}
                            />
                            <button onClick={() => renameFile.mutate({ id: file.id, name: newName })}
                              className="p-1 rounded-lg bg-green-500 text-white">
                              <Check size={12} />
                            </button>
                            <button onClick={() => { setRenaming(null); setNewName(''); }}
                              className={`p-1 rounded-lg ${t.hover}`}>
                              <X size={12} className={t.textSub} />
                            </button>
                          </div>
                        ) : (
                          <span className={`text-sm font-medium truncate ${t.text}`}>{file.name}</span>
                        )}
                      </div>

                      {/* Size */}
                      <span className={`col-span-2 text-sm ${t.textSub}`}>
                        {formatSize(file.size_bytes)}
                      </span>

                      {/* Permission badge */}
                      <div className="col-span-2">
                        <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                          canEdit
                            ? 'bg-green-100 text-green-600'
                            : `${t.accentBg} ${t.accentText}`
                        }`}>
                          {canEdit ? '✏️ Can edit' : '👁️ View only'}
                        </span>
                      </div>

                      {/* Date */}
                      <span className={`col-span-2 text-sm ${t.textSub}`}>
                        {new Date(file.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                      </span>

                      {/* Actions */}
                      <div className="col-span-1 flex justify-end relative">
                        <button
                          onClick={(e) => { e.stopPropagation(); setMenuOpen(menuOpen === file.id ? null : file.id); }}
                          className={`p-1.5 rounded-lg ${t.hover} ${t.textSub} opacity-0 group-hover:opacity-100 transition`}>
                          <MoreVertical size={15} />
                        </button>

                        {menuOpen === file.id && (
                          <div className={`absolute right-0 bottom-8 border ${t.border} rounded-xl shadow-xl z-[100] w-44 py-1 ${t.sidebar.split(' ')[0]}`}>

                            {/* Preview */}
                            <button
                              onClick={() => { setPreviewFile(file); setMenuOpen(null); }}
                              className={`flex items-center gap-2 w-full px-3 py-2 text-sm ${t.textMuted} ${t.hover}`}>
                              <Image size={14} /> Preview
                            </button>

                            {/* Download - always visible */}
                            <button
                              onClick={() => { handleDownload(file.url, file.name); setMenuOpen(null); }}
                              className={`flex items-center gap-2 w-full px-3 py-2 text-sm ${t.textMuted} ${t.hover}`}>
                              <Download size={14} /> Download
                            </button>

                            {/* Edit options — only if permission is edit */}
                            {canEdit && (
                              <>
                                <div className={`border-t ${t.border} my-1`} />
                                <p className={`px-3 py-1 text-xs font-semibold uppercase ${t.textSub} opacity-60`}>
                                  Edit Access
                                </p>
                                <button
                                  onClick={() => {
                                    setRenaming(file.id);
                                    setNewName(file.name);
                                    setMenuOpen(null);
                                  }}
                                  className={`flex items-center gap-2 w-full px-3 py-2 text-sm ${t.textMuted} ${t.hover}`}>
                                  <Pencil size={14} /> Rename
                                </button>
                                <button
                                  onClick={() => {
                                    if (confirm('Delete this shared file?')) {
                                      deleteFile.mutate(file.id);
                                    }
                                    setMenuOpen(null);
                                  }}
                                  className="flex items-center gap-2 w-full px-3 py-2 text-sm text-red-500 hover:bg-red-50">
                                  <Trash2 size={14} /> Delete
                                </button>
                              </>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>

      {previewFile && (
        <FilePreviewModal file={previewFile} onClose={() => setPreviewFile(null)} />
      )}
    </div>
  );
}
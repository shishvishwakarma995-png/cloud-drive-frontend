'use client';
import { useState } from 'react';
import { File, Image, Film, Music, FileText, Archive, MoreVertical, Trash2, Download, Star, Share2, Pencil, Link2 } from 'lucide-react';
import { useDeleteFile, useRenameFile } from '@/hooks/useFiles';
import { useTheme } from '@/context/ThemeContext';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/api';
import ShareModal from './ShareModal';
import LinkModal from './LinkModal';
import FilePreviewModal from './FilePreviewModal';

interface FileItem {
  id: string;
  name: string;
  mime_type: string;
  size: number;
  size_bytes: number;
  url: string;
  created_at: string;
  is_starred: boolean;
}

interface Props {
  files: FileItem[];
  view: 'grid' | 'list';
  onDragStart?: (e: React.DragEvent, id: string, type: 'file' | 'folder') => void;
}

const getFileIcon = (mimeType: string) => {
  if (mimeType.startsWith('image/')) return { icon: Image, color: 'text-pink-500', bg: 'bg-pink-50' };
  if (mimeType.startsWith('video/')) return { icon: Film, color: 'text-purple-500', bg: 'bg-purple-50' };
  if (mimeType.startsWith('audio/')) return { icon: Music, color: 'text-blue-500', bg: 'bg-blue-50' };
  if (mimeType.includes('pdf') || mimeType.includes('document') || mimeType.includes('text')) return { icon: FileText, color: 'text-red-500', bg: 'bg-red-50' };
  if (mimeType.includes('zip') || mimeType.includes('rar')) return { icon: Archive, color: 'text-yellow-500', bg: 'bg-yellow-50' };
  return { icon: File, color: 'text-slate-500', bg: 'bg-slate-100' };
};

const formatSize = (bytes: number) => {
  if (!bytes || isNaN(bytes)) return '—';
  if (bytes < 1024) return `${bytes} B`;
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
  } catch (err) {
    window.open(url, '_blank');
  }
};

export default function FileGrid({ files, view, onDragStart }: Props) {
  const [menuOpen, setMenuOpen] = useState<string | null>(null);
  const [shareItem, setShareItem] = useState<{ id: string; name: string } | null>(null);
  const [linkItem, setLinkItem] = useState<{ id: string; name: string } | null>(null);
  const [previewFile, setPreviewFile] = useState<FileItem | null>(null);
  const [renaming, setRenaming] = useState<string | null>(null);
  const [newName, setNewName] = useState('');
  const deleteFile = useDeleteFile();
  const renameFile = useRenameFile();
  const { t } = useTheme();
  const queryClient = useQueryClient();

  const toggleStar = useMutation({
    mutationFn: async (id: string) => {
      await api.patch(`/api/files/star/file/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['files'] });
      queryClient.invalidateQueries({ queryKey: ['starred'] });
      queryClient.invalidateQueries({ queryKey: ['recent'] });
    },
  });

  const handleDelete = async (id: string) => {
    if (confirm('Delete this file permanently?')) {
      await deleteFile.mutateAsync(id);
    }
    setMenuOpen(null);
  };

  const handleRename = async (id: string) => {
    if (!newName.trim()) return;
    await renameFile.mutateAsync({ id, name: newName.trim() });
    setRenaming(null);
    setNewName('');
  };

  const startRename = (file: FileItem) => {
    setRenaming(file.id);
    setNewName(file.name);
    setMenuOpen(null);
  };

  if (files.length === 0) return null;

  if (view === 'list') {
    return (
      <>
        <div className={`rounded-2xl border ${t.border}`} style={{ overflow: 'visible' }}>
          <div className={`grid grid-cols-12 px-4 py-2.5 border-b ${t.border} text-xs font-semibold uppercase tracking-wider ${t.textSub} ${t.accentBg} rounded-t-2xl`}>
            <span className="col-span-5">Name</span>
            <span className="col-span-3">Size</span>
            <span className="col-span-3">Created</span>
            <span className="col-span-1"></span>
          </div>
          {files.map((file, i) => {
            const { icon: Icon, color, bg } = getFileIcon(file.mime_type);
            return (
              <div key={file.id}
                draggable
                onDragStart={(e) => onDragStart?.(e, file.id, 'file')}
                onDoubleClick={() => setPreviewFile(file)}
                className={`grid grid-cols-12 items-center px-4 py-3 transition group cursor-pointer ${t.hover} ${i !== files.length - 1 ? `border-b ${t.border}` : ''}`}>
                <div className="col-span-5 flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-lg ${bg} flex items-center justify-center shrink-0`}>
                    <Icon size={16} className={color} />
                  </div>
                  {renaming === file.id ? (
                    <input autoFocus value={newName}
                      onChange={e => setNewName(e.target.value)}
                      onBlur={() => handleRename(file.id)}
                      onKeyDown={e => { if (e.key === 'Enter') handleRename(file.id); if (e.key === 'Escape') { setRenaming(null); setNewName(''); } }}
                      onClick={e => e.stopPropagation()}
                      className={`text-sm px-2 py-0.5 rounded-lg border outline-none ${t.input} ${t.text} w-40`} />
                  ) : (
                    <>
                      <span className={`text-sm font-medium truncate ${t.text}`}>{file.name}</span>
                      {file.is_starred && <Star size={12} className="text-yellow-400 fill-yellow-400 shrink-0" />}
                    </>
                  )}
                </div>
                <span className={`col-span-3 text-sm ${t.textSub}`}>{formatSize(file.size_bytes || file.size)}</span>
                <span className={`col-span-3 text-sm ${t.textSub}`}>
                  {new Date(file.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                </span>
                <div className="col-span-1 flex justify-end relative">
                  <button onClick={(e) => { e.stopPropagation(); setMenuOpen(menuOpen === file.id ? null : file.id); }}
                    className={`p-1.5 rounded-lg ${t.hover} ${t.textSub} opacity-0 group-hover:opacity-100 transition`}>
                    <MoreVertical size={15} />
                  </button>
                  {menuOpen === file.id && (
                    <div className={`absolute right-0 ${i < Math.ceil(files.length / 2) ? 'top-8' : 'bottom-8'} border ${t.border} rounded-xl shadow-xl z-[100] w-40 py-1 ${t.sidebar.split(' ')[0]}`}>
                      <button onClick={() => { setShareItem({ id: file.id, name: file.name }); setMenuOpen(null); }}
                        className={`flex items-center gap-2 w-full px-3 py-2 text-sm ${t.textMuted} ${t.hover}`}>
                        <Share2 size={14} /> Share
                      </button>
                      <button onClick={() => { setLinkItem({ id: file.id, name: file.name }); setMenuOpen(null); }}
                        className={`flex items-center gap-2 w-full px-3 py-2 text-sm ${t.textMuted} ${t.hover}`}>
                        <Link2 size={14} /> Get Link
                      </button>
                      <button onClick={() => startRename(file)}
                        className={`flex items-center gap-2 w-full px-3 py-2 text-sm ${t.textMuted} ${t.hover}`}>
                        <Pencil size={14} /> Rename
                      </button>
                      <button onClick={() => { toggleStar.mutate(file.id); setMenuOpen(null); }}
                        className={`flex items-center gap-2 w-full px-3 py-2 text-sm ${t.textMuted} ${t.hover}`}>
                        <Star size={14} className={file.is_starred ? 'text-yellow-400 fill-yellow-400' : ''} />
                        {file.is_starred ? 'Unstar' : 'Star'}
                      </button>
                      <button onClick={() => { handleDownload(file.url, file.name); setMenuOpen(null); }}
                        className={`flex items-center gap-2 w-full px-3 py-2 text-sm ${t.textMuted} ${t.hover}`}>
                        <Download size={14} /> Download
                      </button>
                      <button onClick={() => handleDelete(file.id)}
                        className="flex items-center gap-2 w-full px-3 py-2 text-sm text-red-500 hover:bg-red-50">
                        <Trash2 size={14} /> Delete
                      </button>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
        {shareItem && <ShareModal item={shareItem} type="file" onClose={() => setShareItem(null)} />}
        {linkItem && <LinkModal item={linkItem} type="file" onClose={() => setLinkItem(null)} />}
        {previewFile && <FilePreviewModal file={previewFile} onClose={() => setPreviewFile(null)} />}
      </>
    );
  }

  return (
    <>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
        {files.map((file, i) => {
          const { icon: Icon, color, bg } = getFileIcon(file.mime_type);
          return (
            <div key={file.id}
              draggable
              onDragStart={(e) => onDragStart?.(e, file.id, 'file')}
              onDoubleClick={() => setPreviewFile(file)}
              className={`group relative border rounded-2xl p-4 cursor-pointer transition ${t.card}`}
              style={{ overflow: 'visible' }}>

              {file.is_starred && (
                <div className="absolute top-2.5 left-2.5">
                  <Star size={13} className="text-yellow-400 fill-yellow-400" />
                </div>
              )}

              {file.mime_type.startsWith('image/') ? (
                <div className="w-full h-20 rounded-xl overflow-hidden mb-3 bg-slate-100">
                  <img src={file.url} alt={file.name} className="w-full h-full object-cover"
                    onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }} />
                </div>
              ) : (
                <div className={`w-11 h-11 rounded-xl ${bg} flex items-center justify-center mb-3`}>
                  <Icon size={22} className={color} />
                </div>
              )}

              {renaming === file.id ? (
                <input autoFocus value={newName}
                  onChange={e => setNewName(e.target.value)}
                  onBlur={() => handleRename(file.id)}
                  onKeyDown={e => { if (e.key === 'Enter') handleRename(file.id); if (e.key === 'Escape') { setRenaming(null); setNewName(''); } }}
                  onClick={e => e.stopPropagation()}
                  className={`w-full text-xs border rounded-lg px-1 py-0.5 outline-none ${t.input} ${t.text}`} />
              ) : (
                <p className={`text-sm font-semibold truncate ${t.text}`}>{file.name}</p>
              )}
              <p className={`text-xs mt-0.5 ${t.textSub}`}>{formatSize(file.size_bytes || file.size)}</p>

              <div className="absolute top-2.5 right-2.5 opacity-0 group-hover:opacity-100 transition">
                <button onClick={(e) => { e.stopPropagation(); setMenuOpen(menuOpen === file.id ? null : file.id); }}
                  className={`p-1 rounded-lg ${t.hover} ${t.textSub}`}>
                  <MoreVertical size={14} />
                </button>
                {menuOpen === file.id && (
                  <div className={`absolute right-0 top-7 border ${t.border} rounded-xl shadow-xl z-[100] w-40 py-1 ${t.sidebar.split(' ')[0]}`}>
                    <button onClick={() => { setShareItem({ id: file.id, name: file.name }); setMenuOpen(null); }}
                      className={`flex items-center gap-2 w-full px-3 py-2 text-sm ${t.textMuted} ${t.hover}`}>
                      <Share2 size={14} /> Share
                    </button>
                    <button onClick={() => { setLinkItem({ id: file.id, name: file.name }); setMenuOpen(null); }}
                      className={`flex items-center gap-2 w-full px-3 py-2 text-sm ${t.textMuted} ${t.hover}`}>
                      <Link2 size={14} /> Get Link
                    </button>
                    <button onClick={() => startRename(file)}
                      className={`flex items-center gap-2 w-full px-3 py-2 text-sm ${t.textMuted} ${t.hover}`}>
                      <Pencil size={14} /> Rename
                    </button>
                    <button onClick={() => { toggleStar.mutate(file.id); setMenuOpen(null); }}
                      className={`flex items-center gap-2 w-full px-3 py-2 text-sm ${t.textMuted} ${t.hover}`}>
                      <Star size={14} className={file.is_starred ? 'text-yellow-400 fill-yellow-400' : ''} />
                      {file.is_starred ? 'Unstar' : 'Star'}
                    </button>
                    <button onClick={() => { handleDownload(file.url, file.name); setMenuOpen(null); }}
                      className={`flex items-center gap-2 w-full px-3 py-2 text-sm ${t.textMuted} ${t.hover}`}>
                      <Download size={14} /> Download
                    </button>
                    <button onClick={() => handleDelete(file.id)}
                      className="flex items-center gap-2 w-full px-3 py-2 text-sm text-red-500 hover:bg-red-50">
                      <Trash2 size={14} /> Delete
                    </button>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
      {shareItem && <ShareModal item={shareItem} type="file" onClose={() => setShareItem(null)} />}
      {linkItem && <LinkModal item={linkItem} type="file" onClose={() => setLinkItem(null)} />}
      {previewFile && <FilePreviewModal file={previewFile} onClose={() => setPreviewFile(null)} />}
    </>
  );
}
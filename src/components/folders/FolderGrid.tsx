'use client';
import { useState } from 'react';
import { Folder, MoreVertical, Pencil, Trash2, Star, Share2, Link2 } from 'lucide-react';
import { useDeleteFolder, useUpdateFolder } from '@/hooks/useFolders';
import { useTheme } from '@/context/ThemeContext';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/api';
import ShareModal from '@/components/files/ShareModal';
import LinkModal from '@/components/files/LinkModal';

interface FolderItem {
  id: string;
  name: string;
  created_at: string;
  is_starred: boolean;
}

interface Props {
  folders: FolderItem[];
  view: 'grid' | 'list';
  onFolderClick: (id: string) => void;
  onDragStart?: (e: React.DragEvent, id: string, type: 'file' | 'folder') => void;
  onDragOver?: (e: React.DragEvent, folderId: string) => void;
  onDragLeave?: () => void;
  onDrop?: (e: React.DragEvent, folderId: string) => void;
  dragOverFolder?: string | null;
}

export default function FolderGrid({ folders, view, onFolderClick, onDragStart, onDragOver, onDragLeave, onDrop, dragOverFolder }: Props) {
  const [menuOpen, setMenuOpen] = useState<string | null>(null);
  const [renaming, setRenaming] = useState<string | null>(null);
  const [newName, setNewName] = useState('');
  const [shareItem, setShareItem] = useState<{ id: string; name: string } | null>(null);
  const [linkItem, setLinkItem] = useState<{ id: string; name: string } | null>(null);
  const deleteFolder = useDeleteFolder();
  const updateFolder = useUpdateFolder();
  const { t } = useTheme();
  const queryClient = useQueryClient();

  const toggleStar = useMutation({
    mutationFn: async (id: string) => {
      await api.patch(`/api/files/star/folder/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['folders'] });
      queryClient.invalidateQueries({ queryKey: ['starred'] });
    },
  });

  const handleRename = async (id: string) => {
    if (!newName.trim()) return;
    await updateFolder.mutateAsync({ id, name: newName.trim() });
    setRenaming(null); setNewName('');
  };

  const handleDelete = async (id: string) => {
    if (confirm('Move to trash?')) await deleteFolder.mutateAsync(id);
    setMenuOpen(null);
  };

  if (folders.length === 0) return null;

  if (view === 'list') {
    return (
      <>
        <div className={`rounded-2xl border ${t.border} overflow-hidden`}>
          <div className={`grid grid-cols-12 px-4 py-2.5 border-b ${t.border} text-xs font-semibold uppercase tracking-wider ${t.textSub} ${t.accentBg}`}>
            <span className="col-span-6">Name</span>
            <span className="col-span-4">Created</span>
            <span className="col-span-2"></span>
          </div>
          {folders.map((folder, i) => (
            <div key={folder.id}
              draggable
              onDragStart={(e) => onDragStart?.(e, folder.id, 'folder')}
              onDragOver={(e) => onDragOver?.(e, folder.id)}
              onDragLeave={onDragLeave}
              onDrop={(e) => onDrop?.(e, folder.id)}
              className={`grid grid-cols-12 items-center px-4 py-3 cursor-pointer transition group ${t.hover} ${i !== folders.length - 1 ? `border-b ${t.border}` : ''} ${dragOverFolder === folder.id ? `ring-2 ${t.accentBorder} bg-opacity-50` : ''}`}
              onDoubleClick={() => onFolderClick(folder.id)}>
              <div className="col-span-6 flex items-center gap-3">
                <div className={`w-8 h-8 rounded-lg ${t.accentBg} flex items-center justify-center`}>
                  <Folder size={16} className={t.accentText} />
                </div>
                {renaming === folder.id ? (
                  <input autoFocus value={newName} onChange={e => setNewName(e.target.value)}
                    onBlur={() => handleRename(folder.id)}
                    onKeyDown={e => e.key === 'Enter' && handleRename(folder.id)}
                    className={`text-sm px-2 py-0.5 rounded-lg border outline-none ${t.input} ${t.text}`} />
                ) : (
                  <span className={`text-sm font-medium ${t.text}`}>{folder.name}</span>
                )}
              </div>
              <span className={`col-span-4 text-sm ${t.textSub}`}>
                {new Date(folder.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
              </span>
              <div className="col-span-2 flex justify-end relative">
                <button onClick={() => setMenuOpen(menuOpen === folder.id ? null : folder.id)}
                  className={`p-1.5 rounded-lg ${t.hover} ${t.textSub} opacity-0 group-hover:opacity-100 transition`}>
                  <MoreVertical size={15} />
                </button>
                {menuOpen === folder.id && (
                  <div className={`absolute right-0 ${i < Math.ceil(folders.length / 2) ? 'top-8' : 'bottom-8'} border ${t.border} rounded-xl shadow-xl z-50 w-40 py-1 ${t.sidebar.split(' ')[0]}`}>
                    <button onClick={() => { setShareItem({ id: folder.id, name: folder.name }); setMenuOpen(null); }}
                      className={`flex items-center gap-2 w-full px-3 py-2 text-sm ${t.textMuted} ${t.hover}`}>
                      <Share2 size={14} /> Share
                    </button>
                    <button onClick={() => { setLinkItem({ id: folder.id, name: folder.name }); setMenuOpen(null); }}
                      className={`flex items-center gap-2 w-full px-3 py-2 text-sm ${t.textMuted} ${t.hover}`}>
                      <Link2 size={14} /> Get Link
                    </button>
                    <button onClick={() => { toggleStar.mutate(folder.id); setMenuOpen(null); }}
                      className={`flex items-center gap-2 w-full px-3 py-2 text-sm ${t.textMuted} ${t.hover}`}>
                      <Star size={14} className={folder.is_starred ? 'text-yellow-400 fill-yellow-400' : ''} />
                      {folder.is_starred ? 'Unstar' : 'Star'}
                    </button>
                    <button onClick={() => { setRenaming(folder.id); setNewName(folder.name); setMenuOpen(null); }}
                      className={`flex items-center gap-2 w-full px-3 py-2 text-sm ${t.textMuted} ${t.hover}`}>
                      <Pencil size={14} /> Rename
                    </button>
                    <button onClick={() => handleDelete(folder.id)}
                      className="flex items-center gap-2 w-full px-3 py-2 text-sm text-red-500 hover:bg-red-50">
                      <Trash2 size={14} /> Delete
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
        {shareItem && <ShareModal item={shareItem} type="folder" onClose={() => setShareItem(null)} />}
        {linkItem && <LinkModal item={linkItem} type="folder" onClose={() => setLinkItem(null)} />}
      </>
    );
  }

  return (
    <>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
        {folders.map((folder, i) => (
          <div key={folder.id}
            draggable
            onDragStart={(e) => onDragStart?.(e, folder.id, 'folder')}
            onDragOver={(e) => onDragOver?.(e, folder.id)}
            onDragLeave={onDragLeave}
            onDrop={(e) => onDrop?.(e, folder.id)}
            className={`group relative border rounded-2xl p-4 cursor-pointer transition ${t.card} ${dragOverFolder === folder.id ? `ring-2 ${t.accentBorder}` : ''}`}
            onDoubleClick={() => onFolderClick(folder.id)}>

            {folder.is_starred && (
              <div className="absolute top-2.5 left-2.5">
                <Star size={13} className="text-yellow-400 fill-yellow-400" />
              </div>
            )}

            <div className={`w-11 h-11 rounded-xl ${t.accentBg} flex items-center justify-center mb-3`}>
              <Folder size={22} className={t.accentText} />
            </div>

            {renaming === folder.id ? (
              <input autoFocus value={newName} onChange={e => setNewName(e.target.value)}
                onBlur={() => handleRename(folder.id)}
                onKeyDown={e => e.key === 'Enter' && handleRename(folder.id)}
                className={`w-full text-xs border rounded-lg px-1 py-0.5 outline-none ${t.input} ${t.text}`} />
            ) : (
              <p className={`text-sm font-semibold truncate ${t.text}`}>{folder.name}</p>
            )}
            <p className={`text-xs mt-0.5 ${t.textSub}`}>
              {new Date(folder.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
            </p>

            <div className="absolute top-2.5 right-2.5 opacity-0 group-hover:opacity-100 transition">
              <button onClick={(e) => { e.stopPropagation(); setMenuOpen(menuOpen === folder.id ? null : folder.id); }}
                className={`p-1 rounded-lg ${t.hover} ${t.textSub}`}>
                <MoreVertical size={14} />
              </button>
              {menuOpen === folder.id && (
                <div className={`absolute right-0 top-7 border ${t.border} rounded-xl shadow-xl z-[100] w-40 py-1 ${t.sidebar.split(' ')[0]}`}>
                  <button onClick={() => { setShareItem({ id: folder.id, name: folder.name }); setMenuOpen(null); }}
                    className={`flex items-center gap-2 w-full px-3 py-2 text-sm ${t.textMuted} ${t.hover}`}>
                    <Share2 size={14} /> Share
                  </button>
                  <button onClick={() => { setLinkItem({ id: folder.id, name: folder.name }); setMenuOpen(null); }}
                    className={`flex items-center gap-2 w-full px-3 py-2 text-sm ${t.textMuted} ${t.hover}`}>
                    <Link2 size={14} /> Get Link
                  </button>
                  <button onClick={() => { toggleStar.mutate(folder.id); setMenuOpen(null); }}
                    className={`flex items-center gap-2 w-full px-3 py-2 text-sm ${t.textMuted} ${t.hover}`}>
                    <Star size={14} className={folder.is_starred ? 'text-yellow-400 fill-yellow-400' : ''} />
                    {folder.is_starred ? 'Unstar' : 'Star'}
                  </button>
                  <button onClick={() => { setRenaming(folder.id); setNewName(folder.name); setMenuOpen(null); }}
                    className={`flex items-center gap-2 w-full px-3 py-2 text-sm ${t.textMuted} ${t.hover}`}>
                    <Pencil size={14} /> Rename
                  </button>
                  <button onClick={() => handleDelete(folder.id)}
                    className="flex items-center gap-2 w-full px-3 py-2 text-sm text-red-500 hover:bg-red-50">
                    <Trash2 size={14} /> Delete
                  </button>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
      {shareItem && <ShareModal item={shareItem} type="folder" onClose={() => setShareItem(null)} />}
      {linkItem && <LinkModal item={linkItem} type="folder" onClose={() => setLinkItem(null)} />}
    </>
  );
}
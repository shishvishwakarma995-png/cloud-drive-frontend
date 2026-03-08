'use client';
import { useState } from 'react';
import { X, FolderPlus } from 'lucide-react';
import { useCreateFolder } from '@/hooks/useFolders';

interface Props {
  currentFolderId?: string | null;
  onClose: () => void;
}

export default function NewFolderModal({ currentFolderId, onClose }: Props) {
  const [name, setName] = useState('');
  const createFolder = useCreateFolder();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    try {
      await createFolder.mutateAsync({ name: name.trim(), parentId: currentFolderId || null });
      onClose();
    } catch (err: any) {
      alert(err.response?.data?.error?.message || 'Failed to create folder');
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-900/30 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl shadow-xl p-6 w-full max-w-sm border border-slate-200">
        <div className="flex items-center gap-3 mb-5">
          <div className="w-10 h-10 rounded-xl bg-sky-50 flex items-center justify-center">
            <FolderPlus size={20} className="text-sky-500" />
          </div>
          <div>
            <h2 className="text-slate-800 font-semibold">New Folder</h2>
            <p className="text-slate-400 text-xs">Enter a name for your folder</p>
          </div>
          <button onClick={onClose} className="ml-auto text-slate-300 hover:text-slate-500 transition">
            <X size={20} />
          </button>
        </div>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            value={name}
            onChange={e => setName(e.target.value)}
            placeholder="Folder name"
            autoFocus
            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-slate-800 text-sm focus:outline-none focus:border-sky-400 focus:ring-2 focus:ring-sky-100 mb-4"
          />
          <div className="flex gap-2 justify-end">
            <button type="button" onClick={onClose}
              className="px-4 py-2 text-sm text-slate-500 hover:text-slate-700 rounded-xl hover:bg-slate-100 transition">
              Cancel
            </button>
            <button type="submit"
              disabled={!name.trim() || createFolder.isPending}
              className="px-4 py-2 text-sm bg-sky-500 hover:bg-sky-400 disabled:opacity-50 text-white rounded-xl transition font-medium shadow-sm">
              {createFolder.isPending ? 'Creating...' : 'Create Folder'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
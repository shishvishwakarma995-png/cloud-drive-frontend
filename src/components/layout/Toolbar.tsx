'use client';
import { useState } from 'react';
import { Plus, Upload, Grid, List } from 'lucide-react';
import NewFolderModal from '../folders/NewFolderModal';
import UploadModal from '../files/UploadModal';
import SearchBar from '../search/SearchBar';
import { useTheme } from '@/context/ThemeContext';

interface ToolbarProps {
  currentFolderId?: string | null;
  view: 'grid' | 'list';
  onViewChange: (view: 'grid' | 'list') => void;
  onFolderNavigate: (id: string) => void;
}

export default function Toolbar({ currentFolderId, view, onViewChange, onFolderNavigate }: ToolbarProps) {
  const [showNewFolder, setShowNewFolder] = useState(false);
  const [showUpload, setShowUpload] = useState(false);
  const { t } = useTheme();

  return (
    <>
      <div className={`flex items-center justify-between px-6 py-3 border-b ${t.border} ${t.sidebar.split(' ')[0]}`}>
        <SearchBar onFolderClick={onFolderNavigate} />
        <div className="flex items-center gap-2">
          <button onClick={() => setShowNewFolder(true)}
            className={`flex items-center gap-2 ${t.accent} ${t.accentHover} text-white text-sm font-medium px-4 py-2 rounded-xl shadow-sm transition`}>
            <Plus size={15} />
            New Folder
          </button>
          <button onClick={() => setShowUpload(true)}
            className={`flex items-center gap-2 border ${t.border} ${t.textMuted} text-sm font-medium px-4 py-2 rounded-xl transition ${t.hover}`}>
            <Upload size={15} className={t.accentText} />
            Upload
          </button>
          <div className={`flex items-center gap-1 border ${t.border} rounded-xl p-1`}>
            <button onClick={() => onViewChange('grid')}
              className={`p-1.5 rounded-lg transition ${view === 'grid' ? `${t.accentBg} ${t.accentText}` : `${t.textSub} ${t.hover}`}`}>
              <Grid size={15} />
            </button>
            <button onClick={() => onViewChange('list')}
              className={`p-1.5 rounded-lg transition ${view === 'list' ? `${t.accentBg} ${t.accentText}` : `${t.textSub} ${t.hover}`}`}>
              <List size={15} />
            </button>
          </div>
        </div>
      </div>

      {showNewFolder && <NewFolderModal currentFolderId={currentFolderId} onClose={() => setShowNewFolder(false)} />}
      {showUpload && <UploadModal currentFolderId={currentFolderId} onClose={() => setShowUpload(false)} />}
    </>
  );
}
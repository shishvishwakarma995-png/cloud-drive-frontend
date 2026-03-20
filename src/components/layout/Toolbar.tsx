'use client';
import { useState } from 'react';
import { Plus, Upload, Grid, List, ArrowUpDown, ChevronDown } from 'lucide-react';
import NewFolderModal from '../folders/NewFolderModal';
import UploadModal from '../files/UploadModal';
import SearchBar from '../search/SearchBar';
import { useTheme } from '@/context/ThemeContext';

interface ToolbarProps {
  currentFolderId?: string | null;
  view: 'grid' | 'list';
  onViewChange: (view: 'grid' | 'list') => void;
  onFolderNavigate: (id: string) => void;
  onSortChange?: (sort: string) => void;
  currentSort?: string;
}

export default function Toolbar({ currentFolderId, view, onViewChange, onFolderNavigate, onSortChange, currentSort = 'date' }: ToolbarProps) {
  const [showNewFolder, setShowNewFolder] = useState(false);
  const [showUpload, setShowUpload] = useState(false);
  const [showSort, setShowSort] = useState(false);
  const { t } = useTheme();

  const sortOptions = [
    { value: 'date', label: 'Date modified' },
    { value: 'name', label: 'Name' },
    { value: 'size', label: 'Size' },
    { value: 'type', label: 'Type' },
  ];

  const currentSortLabel = sortOptions.find(s => s.value === currentSort)?.label || 'Date modified';

  return (
    <>
      <div className={`flex items-center justify-between px-4 py-3 border-b ${t.border} ${t.sidebar.split(' ')[0]}`}>
        
        {/* Search */}
        <SearchBar onFolderClick={onFolderNavigate} />

        {/* Actions */}
        <div className="flex items-center gap-2">

          {/* Sort dropdown */}
          <div className="relative">
            <button
              onClick={() => setShowSort(!showSort)}
              className={`hidden sm:flex items-center gap-1.5 border ${t.border} ${t.textMuted} text-sm font-medium px-3 py-2 rounded-xl transition ${t.hover}`}>
              <ArrowUpDown size={14} className={t.accentText} />
              <span className="hidden md:block">{currentSortLabel}</span>
              <ChevronDown size={13} className={t.textSub} />
            </button>

            {showSort && (
              <div className={`absolute right-0 top-11 border ${t.border} rounded-xl shadow-xl z-[100] w-44 py-1 ${t.sidebar.split(' ')[0]}`}>
                <p className={`px-3 py-1.5 text-xs font-semibold uppercase tracking-wider ${t.textSub} opacity-60`}>
                  Sort by
                </p>
                {sortOptions.map(option => (
                  <button
                    key={option.value}
                    onClick={() => {
                      onSortChange?.(option.value);
                      setShowSort(false);
                    }}
                    className={`flex items-center justify-between w-full px-3 py-2 text-sm transition ${t.hover} ${
                      currentSort === option.value ? t.accentText : t.textMuted
                    }`}>
                    {option.label}
                    {currentSort === option.value && (
                      <span className={`w-1.5 h-1.5 rounded-full ${t.accent}`} style={{ background: 'currentColor' }} />
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* New Folder */}
          <button
            onClick={() => setShowNewFolder(true)}
            className={`flex items-center gap-2 ${t.accent} text-white text-sm font-medium px-3 py-2 rounded-xl shadow-sm transition`}>
            <Plus size={15} />
            <span className="hidden sm:block">New Folder</span>
          </button>

          {/* Upload */}
          <button
            onClick={() => setShowUpload(true)}
            className={`flex items-center gap-2 border ${t.border} ${t.textMuted} text-sm font-medium px-3 py-2 rounded-xl transition ${t.hover}`}>
            <Upload size={15} className={t.accentText} />
            <span className="hidden sm:block">Upload</span>
          </button>

          {/* Grid/List toggle */}
          <div className={`flex items-center gap-1 border ${t.border} rounded-xl p-1`}>
            <button
              onClick={() => onViewChange('grid')}
              className={`p-1.5 rounded-lg transition ${view === 'grid' ? `${t.accentBg} ${t.accentText}` : `${t.textSub} ${t.hover}`}`}>
              <Grid size={15} />
            </button>
            <button
              onClick={() => onViewChange('list')}
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
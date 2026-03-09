'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { useFolderContents } from '@/hooks/useFolders';
import { useFiles } from '@/hooks/useFiles';
import { useTheme } from '@/context/ThemeContext';
import Sidebar from '@/components/layout/Sidebar';
import Toolbar from '@/components/layout/Toolbar';
import FolderGrid from '@/components/folders/FolderGrid';
import FileGrid from '@/components/files/FileGrid';
import { ChevronRight, Home, FolderOpen } from 'lucide-react';

export default function DashboardPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const { t } = useTheme();
  const [currentFolderId, setCurrentFolderId] = useState<string | null>(null);
  const [view, setView] = useState<'grid' | 'list'>('grid');

  const { data: folderData, isLoading: foldersLoading } = useFolderContents(currentFolderId);
  const { data: fileData, isLoading: filesLoading } = useFiles(currentFolderId);

  // Ye useEffect render ke baad chalega — safe tarika hai redirect karne ka
  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading]);

  if (loading) return (
    <div className={`min-h-screen ${t.bg} flex items-center justify-center`}>
      <div className={`w-10 h-10 rounded-xl ${t.accent} animate-pulse`} />
    </div>
  );

  if (!user) return null;

  const folders = folderData?.children?.folders || [];
  const files = fileData?.files || [];
  const breadcrumb = folderData?.breadcrumb || [];
  const isLoading = foldersLoading || filesLoading;

  return (
    <div className={`flex min-h-screen ${t.bg}`}>
      <Sidebar />
      <div className="ml-64 flex-1 flex flex-col">
        <Toolbar
          currentFolderId={currentFolderId}
          view={view}
          onViewChange={setView}
          onFolderNavigate={setCurrentFolderId}
        />
        <div className="flex-1 p-6">

          {/* Breadcrumb */}
          <div className="flex items-center gap-1 mb-6">
            <button onClick={() => setCurrentFolderId(null)}
              className={`flex items-center gap-1.5 text-sm font-medium ${t.accentText} transition`}>
              <Home size={14} />
              My Drive
            </button>
            {breadcrumb.map((item: any) => (
              <div key={item.id} className="flex items-center gap-1">
                <ChevronRight size={14} className={t.textSub} />
                <button onClick={() => setCurrentFolderId(item.id)}
                  className={`text-sm font-medium ${t.textMuted} hover:${t.accentText} transition`}>
                  {item.name}
                </button>
              </div>
            ))}
          </div>

          {/* Loading */}
          {isLoading && (
            <div className="grid grid-cols-6 gap-3">
              {[...Array(12)].map((_, i) => (
                <div key={i} className={`border ${t.border} rounded-2xl p-4 animate-pulse h-24 ${t.accentBg}`} />
              ))}
            </div>
          )}

          {/* Empty state */}
          {!isLoading && folders.length === 0 && files.length === 0 && (
            <div className="flex flex-col items-center justify-center h-72 text-center">
              <div className={`w-20 h-20 rounded-2xl ${t.accentBg} flex items-center justify-center mb-4`}>
                <FolderOpen size={36} className={t.accentText} />
              </div>
              <p className={`font-semibold text-lg ${t.text}`}>This folder is empty</p>
              <p className={`text-sm mt-1 ${t.textMuted}`}>Create a folder or upload files to get started</p>
            </div>
          )}

          {/* Folders */}
          {!isLoading && folders.length > 0 && (
            <div className="mb-8">
              <h3 className={`text-xs font-bold uppercase tracking-widest mb-3 ${t.textSub}`}>
                Folders — {folders.length}
              </h3>
              <FolderGrid folders={folders} view={view} onFolderClick={setCurrentFolderId} />
            </div>
          )}

          {/* Files */}
          {!isLoading && files.length > 0 && (
            <div>
              <h3 className={`text-xs font-bold uppercase tracking-widest mb-3 ${t.textSub}`}>
                Files — {files.length}
              </h3>
              <FileGrid files={files} view={view} />
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
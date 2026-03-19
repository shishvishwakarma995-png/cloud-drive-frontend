'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { useFolderContents } from '@/hooks/useFolders';
import { useFiles, useMoveFile, useMoveFolder } from '@/hooks/useFiles';
import { useTheme } from '@/context/ThemeContext';
import { useQuery } from '@tanstack/react-query';
import api from '@/lib/api';
import Sidebar from '@/components/layout/Sidebar';
import Toolbar from '@/components/layout/Toolbar';
import FolderGrid from '@/components/folders/FolderGrid';
import FileGrid from '@/components/files/FileGrid';
import { ChevronRight, Home, FolderOpen, Clock } from 'lucide-react';
import Link from 'next/link';

export default function DashboardPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const { t } = useTheme();
  const [currentFolderId, setCurrentFolderId] = useState<string | null>(null);
  const [view, setView] = useState<'grid' | 'list'>('grid');
  const [dragOverFolder, setDragOverFolder] = useState<string | null>(null);

  const { data: folderData, isLoading: foldersLoading } = useFolderContents(currentFolderId);
  const { data: fileData, isLoading: filesLoading } = useFiles(currentFolderId);
  const { data: recentData } = useQuery({
    queryKey: ['recent'],
    queryFn: async () => {
      const res = await api.get('/api/files/recent');
      return res.data;
    },
    enabled: !currentFolderId,
  });

  const moveFile = useMoveFile();
  const moveFolder = useMoveFolder();

  useEffect(() => {
    if (!loading && !user) router.push('/login');
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
  const isRoot = !currentFolderId;
  const recentFiles = recentData?.files?.slice(0, 8) || [];

  const handleDragStart = (e: React.DragEvent, id: string, type: 'file' | 'folder') => {
    e.dataTransfer.setData('id', id);
    e.dataTransfer.setData('type', type);
  };

  const handleDragOver = (e: React.DragEvent, folderId: string) => {
    e.preventDefault();
    setDragOverFolder(folderId);
  };

  const handleDragLeave = () => setDragOverFolder(null);

  const handleDrop = async (e: React.DragEvent, targetFolderId: string) => {
    e.preventDefault();
    setDragOverFolder(null);
    const id = e.dataTransfer.getData('id');
    const type = e.dataTransfer.getData('type');
    if (!id || id === targetFolderId) return;
    if (type === 'file') await moveFile.mutateAsync({ id, folderId: targetFolderId });
    else await moveFolder.mutateAsync({ id, parentId: targetFolderId });
  };

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
          <div className="flex items-center gap-1 mb-5">
            <button onClick={() => setCurrentFolderId(null)}
              className={`flex items-center gap-1.5 text-sm font-medium ${t.accentText} transition hover:opacity-70`}>
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

          {/* Recent Files — only on root, only if no folders/files yet or as quick access */}
          {isRoot && !isLoading && recentFiles.length > 0 && folders.length === 0 && files.length === 0 && (
            <div className="mb-6">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <Clock size={14} className={t.textSub} />
                  <h3 className={`text-sm font-semibold ${t.textSub}`}>Recent</h3>
                </div>
                <Link href="/dashboard/recent"
                  className={`text-xs ${t.accentText} hover:opacity-70 transition`}>
                  View all
                </Link>
              </div>
              <FileGrid files={recentFiles} view="grid" />
            </div>
          )}

          {/* Recent quick access strip — when there ARE folders/files */}
          {isRoot && !isLoading && recentFiles.length > 0 && (folders.length > 0 || files.length > 0) && (
            <div className="mb-6">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <Clock size={14} className={t.textSub} />
                  <h3 className={`text-sm font-semibold ${t.textSub}`}>Recent</h3>
                </div>
                <Link href="/dashboard/recent"
                  className={`text-xs ${t.accentText} hover:opacity-70 transition`}>
                  View all
                </Link>
              </div>
              {/* Horizontal scroll strip */}
              <div className="flex gap-3 overflow-x-auto pb-1 scrollbar-hide">
                {recentFiles.slice(0, 6).map((file: any) => (
                  <div key={file.id}
                    className={`shrink-0 w-36 border rounded-xl p-3 cursor-pointer ${t.card} ${t.hover} transition`}>
                    {file.mime_type?.startsWith('image/') ? (
                      <div className="w-full h-16 rounded-lg overflow-hidden mb-2 bg-slate-100">
                        <img src={file.url} alt={file.name} className="w-full h-full object-cover" />
                      </div>
                    ) : (
                      <div className={`w-8 h-8 rounded-lg bg-red-50 flex items-center justify-center mb-2`}>
                        <span className="text-lg">📄</span>
                      </div>
                    )}
                    <p className={`text-xs font-medium truncate ${t.text}`}>{file.name}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Loading */}
          {isLoading && (
            <div className="grid grid-cols-6 gap-3">
              {[...Array(12)].map((_, i) => (
                <div key={i} className={`border ${t.border} rounded-2xl p-4 animate-pulse h-24 ${t.accentBg}`} />
              ))}
            </div>
          )}

          {/* Empty state */}
          {!isLoading && folders.length === 0 && files.length === 0 && recentFiles.length === 0 && (
            <div className="flex flex-col items-center justify-center h-72 text-center">
              <div className={`w-20 h-20 rounded-2xl ${t.accentBg} flex items-center justify-center mb-4`}>
                <FolderOpen size={36} className={t.accentText} />
              </div>
              <p className={`font-semibold text-lg ${t.text}`}>Welcome to Cloud Drive!</p>
              <p className={`text-sm mt-1 ${t.textMuted}`}>Create a folder or upload files to get started</p>
            </div>
          )}

          {/* Folders */}
          {!isLoading && folders.length > 0 && (
            <div className="mb-6">
              <h3 className={`text-xs font-semibold uppercase tracking-widest mb-3 ${t.textSub}`}>
                Folders
              </h3>
              <FolderGrid
                folders={folders}
                view={view}
                onFolderClick={setCurrentFolderId}
                onDragStart={handleDragStart}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                dragOverFolder={dragOverFolder}
              />
            </div>
          )}

          {/* Files */}
          {!isLoading && files.length > 0 && (
            <div>
              <h3 className={`text-xs font-semibold uppercase tracking-widest mb-3 ${t.textSub}`}>
                Files
              </h3>
              <FileGrid
                files={files}
                view={view}
                onDragStart={handleDragStart}
              />
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
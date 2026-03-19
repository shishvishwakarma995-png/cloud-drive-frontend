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
import { ChevronRight, Home, FolderOpen, Files, HardDrive, Star, Clock } from 'lucide-react';
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
  const { data: storageData } = useQuery({
    queryKey: ['storage'],
    queryFn: async () => {
      const res = await api.get('/api/files/storage');
      return res.data;
    },
  });
  const { data: recentData } = useQuery({
    queryKey: ['recent'],
    queryFn: async () => {
      const res = await api.get('/api/files/recent');
      return res.data;
    },
  });
  const { data: starredData } = useQuery({
    queryKey: ['starred'],
    queryFn: async () => {
      const res = await api.get('/api/files/starred');
      return res.data;
    },
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

  const formatStorage = (bytes: number) => {
    if (!bytes) return '0 KB';
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    if (bytes < 1024 * 1024 * 1024) return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
    return `${(bytes / (1024 * 1024 * 1024)).toFixed(2)} GB`;
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 17) return 'Good afternoon';
    return 'Good evening';
  };

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

          {/* Welcome + Stats — only on root */}
          {isRoot && !isLoading && (
            <>
              {/* Greeting */}
              <div className="mb-6">
                <h1 className={`text-2xl font-bold ${t.text}`}>
                  {getGreeting()}, {user?.name?.split(' ')[0]}! 👋
                </h1>
                <p className={`text-sm mt-1 ${t.textSub}`}>
                  Here's what's happening with your files
                </p>
              </div>

              {/* Stats Cards */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                {/* Total Files */}
                <div className={`rounded-2xl border ${t.border} p-4 ${t.accentBg}`}>
                  <div className={`w-9 h-9 rounded-xl ${t.accent} flex items-center justify-center mb-3`}>
                    <Files size={16} className="text-white" />
                  </div>
                  <p className={`text-2xl font-bold ${t.text}`}>
                    {(recentData?.files?.length || 0)}
                  </p>
                  <p className={`text-xs mt-0.5 ${t.textSub}`}>Total Files</p>
                </div>

                {/* Storage Used */}
                <div className={`rounded-2xl border ${t.border} p-4 ${t.accentBg}`}>
                  <div className={`w-9 h-9 rounded-xl ${t.accent} flex items-center justify-center mb-3`}>
                    <HardDrive size={16} className="text-white" />
                  </div>
                  <p className={`text-2xl font-bold ${t.text}`}>
                    {formatStorage(storageData?.used || 0)}
                  </p>
                  <p className={`text-xs mt-0.5 ${t.textSub}`}>Storage Used</p>
                </div>

                {/* Starred */}
                <div className={`rounded-2xl border ${t.border} p-4 ${t.accentBg}`}>
                  <div className={`w-9 h-9 rounded-xl ${t.accent} flex items-center justify-center mb-3`}>
                    <Star size={16} className="text-white" />
                  </div>
                  <p className={`text-2xl font-bold ${t.text}`}>
                    {(starredData?.files?.length || 0) + (starredData?.folders?.length || 0)}
                  </p>
                  <p className={`text-xs mt-0.5 ${t.textSub}`}>Starred Items</p>
                </div>

                {/* Folders */}
                <div className={`rounded-2xl border ${t.border} p-4 ${t.accentBg}`}>
                  <div className={`w-9 h-9 rounded-xl ${t.accent} flex items-center justify-center mb-3`}>
                    <FolderOpen size={16} className="text-white" />
                  </div>
                  <p className={`text-2xl font-bold ${t.text}`}>
                    {folders.length}
                  </p>
                  <p className={`text-xs mt-0.5 ${t.textSub}`}>Folders</p>
                </div>
              </div>

              {/* Recent Files Preview */}
              {recentData?.files?.length > 0 && (
                <div className="mb-8">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className={`text-xs font-bold uppercase tracking-widest ${t.textSub}`}>
                      Recent Files
                    </h3>
                    <Link href="/dashboard/recent"
                      className={`text-xs font-medium ${t.accentText} hover:opacity-70 transition`}>
                      View all →
                    </Link>
                  </div>
                  <FileGrid
                    files={recentData.files.slice(0, 6)}
                    view="grid"
                  />
                </div>
              )}
            </>
          )}

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
                  className={`text-sm font-medium ${t.textMuted} transition`}>
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
              <p className={`font-semibold text-lg ${t.text}`}>
                {isRoot ? 'Start by uploading files!' : 'This folder is empty'}
              </p>
              <p className={`text-sm mt-1 ${t.textMuted}`}>
                Create a folder or upload files to get started
              </p>
            </div>
          )}

          {/* Folders */}
          {!isLoading && folders.length > 0 && (
            <div className="mb-8">
              <h3 className={`text-xs font-bold uppercase tracking-widest mb-3 ${t.textSub}`}>
                Folders — {folders.length}
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
              <h3 className={`text-xs font-bold uppercase tracking-widest mb-3 ${t.textSub}`}>
                Files — {files.length}
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
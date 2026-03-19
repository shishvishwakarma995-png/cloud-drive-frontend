'use client';
import { useState, useRef } from 'react';
import { X, Upload, File, CheckCircle, AlertCircle } from 'lucide-react';
import { useUploadFile } from '@/hooks/useFiles';
import { useTheme } from '@/context/ThemeContext';
import { useQueryClient } from '@tanstack/react-query';

interface Props {
  currentFolderId?: string | null;
  onClose: () => void;
}

interface UploadingFile {
  id: string;
  name: string;
  size: number;
  status: 'uploading' | 'done' | 'error';
  progress: number;
}

export default function UploadModal({ currentFolderId, onClose }: Props) {
  const [dragging, setDragging] = useState(false);
  const [uploadingFiles, setUploadingFiles] = useState<UploadingFile[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const uploadFile = useUploadFile();
  const queryClient = useQueryClient();
  const { t } = useTheme();

  const formatSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  const updateFile = (id: string, updates: Partial<UploadingFile>) => {
    setUploadingFiles(prev => prev.map(f => f.id === id ? { ...f, ...updates } : f));
  };

  const handleFiles = async (files: FileList) => {
    const fileArray = Array.from(files);

    for (const file of fileArray) {
      const id = `${file.name}-${Date.now()}`;

      setUploadingFiles(prev => [...prev, {
        id,
        name: file.name,
        size: file.size,
        status: 'uploading',
        progress: 0,
      }]);

      try {
        // Base64 conversion with progress simulation
        const base64 = await new Promise<string>((resolve, reject) => {
          const reader = new FileReader();

          reader.onprogress = (e) => {
            if (e.lengthComputable) {
              const percent = Math.round((e.loaded / e.total) * 50);
              updateFile(id, { progress: percent });
            }
          };

          reader.onload = () => {
            updateFile(id, { progress: 60 });
            const result = reader.result as string;
            resolve(result.split(',')[1]);
          };
          reader.onerror = reject;
          reader.readAsDataURL(file);
        });

        updateFile(id, { progress: 75 });

        await uploadFile.mutateAsync({
          fileName: file.name,
          fileData: base64,
          mimeType: file.type || 'application/octet-stream',
          fileSize: file.size,
          folderId: currentFolderId || null,
        });

        updateFile(id, { status: 'done', progress: 100 });
        queryClient.invalidateQueries({ queryKey: ['storage'] });

      } catch (err) {
        updateFile(id, { status: 'error', progress: 0 });
      }
    }
  };

  const allDone = uploadingFiles.length > 0 &&
    uploadingFiles.every(f => f.status === 'done' || f.status === 'error');

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50">
      <div className={`rounded-2xl shadow-2xl p-6 w-full max-w-md border ${t.card} ${t.sidebar.split(' ')[0]}`}>

        {/* Header */}
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-xl ${t.accentBg} flex items-center justify-center`}>
              <Upload size={20} className={t.accentText} />
            </div>
            <div>
              <h2 className={`font-semibold ${t.text}`}>Upload Files</h2>
              <p className={`text-xs ${t.textSub}`}>Max 50MB per file</p>
            </div>
          </div>
          <button onClick={onClose} className={`${t.textSub} hover:${t.text} transition`}>
            <X size={20} />
          </button>
        </div>

        {/* Drop Zone */}
        <div
          onDragOver={e => { e.preventDefault(); setDragging(true); }}
          onDragLeave={() => setDragging(false)}
          onDrop={e => { e.preventDefault(); setDragging(false); handleFiles(e.dataTransfer.files); }}
          onClick={() => fileInputRef.current?.click()}
          className={`border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition mb-4 ${
            dragging ? `${t.accentBorder} ${t.accentBg}` : `${t.border} ${t.hover}`
          }`}>
          <input ref={fileInputRef} type="file" multiple className="hidden"
            onChange={e => e.target.files && handleFiles(e.target.files)} />
          <Upload size={32} className={`mx-auto mb-3 ${t.accentText}`} />
          <p className={`font-medium ${t.text}`}>Drop files here</p>
          <p className={`text-sm mt-1 ${t.textSub}`}>or click to browse</p>
        </div>

        {/* Uploading Files List */}
        {uploadingFiles.length > 0 && (
          <div className="space-y-3 max-h-52 overflow-y-auto">
            {uploadingFiles.map((f) => (
              <div key={f.id} className={`p-3 rounded-xl border ${t.border} ${t.accentBg}`}>
                <div className="flex items-center gap-3 mb-2">
                  <File size={16} className={t.accentText} />
                  <div className="flex-1 min-w-0">
                    <p className={`text-sm font-medium truncate ${t.text}`}>{f.name}</p>
                    <p className={`text-xs ${t.textSub}`}>{formatSize(f.size)}</p>
                  </div>
                  {f.status === 'done' && <CheckCircle size={16} className="text-green-500 shrink-0" />}
                  {f.status === 'error' && <AlertCircle size={16} className="text-red-500 shrink-0" />}
                  {f.status === 'uploading' && (
                    <span className={`text-xs font-semibold ${t.accentText} shrink-0`}>{f.progress}%</span>
                  )}
                </div>

                {/* Progress Bar */}
                <div className={`h-1.5 rounded-full overflow-hidden ${t.border} bg-white/10`}>
                  <div
                    className={`h-full rounded-full transition-all duration-300 ${
                      f.status === 'done' ? 'bg-green-500' :
                      f.status === 'error' ? 'bg-red-500' :
                      t.accent
                    }`}
                    style={{ width: `${f.progress}%` }}
                  />
                </div>

                {f.status === 'error' && (
                  <p className="text-xs text-red-500 mt-1">Upload failed. Try again.</p>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Footer */}
        {allDone && (
          <button onClick={onClose}
            className={`w-full mt-4 py-2.5 rounded-xl text-sm font-medium text-white ${t.accent} transition`}>
            Done ✓
          </button>
        )}
      </div>
    </div>
  );
}
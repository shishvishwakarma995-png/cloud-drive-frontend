'use client';
import { X, Download, ZoomIn, ZoomOut, RotateCw } from 'lucide-react';
import { useState } from 'react';
import { useTheme } from '@/context/ThemeContext';

interface Props {
  file: {
    id: string;
    name: string;
    mime_type: string;
    url: string;
    size_bytes?: number;
  };
  onClose: () => void;
}

const formatSize = (bytes?: number) => {
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

export default function FilePreviewModal({ file, onClose }: Props) {
  const { t } = useTheme();
  const [zoom, setZoom] = useState(1);
  const [rotation, setRotation] = useState(0);

  const isImage = file.mime_type.startsWith('image/');
  const isPDF = file.mime_type.includes('pdf');
  const isVideo = file.mime_type.startsWith('video/');
  const isAudio = file.mime_type.startsWith('audio/');
  const isText = file.mime_type.includes('text/plain');

  return (
    <div
      className="fixed inset-0 z-50 flex flex-col"
      style={{ background: 'rgba(0,0,0,0.92)' }}
      onClick={(e) => e.target === e.currentTarget && onClose()}>

      {/* Top bar */}
      <div className="flex items-center justify-between px-5 py-3 border-b border-white/10">
        <div className="flex items-center gap-3 min-w-0">
          <div>
            <p className="text-sm font-semibold text-white truncate max-w-xs">{file.name}</p>
            <p className="text-xs text-white/40">{formatSize(file.size_bytes)}</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Zoom controls for images */}
          {isImage && (
            <>
              <button onClick={() => setZoom(z => Math.max(0.25, z - 0.25))}
                className="p-2 rounded-lg bg-white/10 hover:bg-white/20 transition text-white">
                <ZoomOut size={16} />
              </button>
              <span className="text-xs text-white/60 min-w-10 text-center">{Math.round(zoom * 100)}%</span>
              <button onClick={() => setZoom(z => Math.min(4, z + 0.25))}
                className="p-2 rounded-lg bg-white/10 hover:bg-white/20 transition text-white">
                <ZoomIn size={16} />
              </button>
              <button onClick={() => setRotation(r => (r + 90) % 360)}
                className="p-2 rounded-lg bg-white/10 hover:bg-white/20 transition text-white">
                <RotateCw size={16} />
              </button>
              <div className="w-px h-5 bg-white/20 mx-1" />
            </>
          )}

          <button
            onClick={() => handleDownload(file.url, file.name)}
            className="flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-semibold text-white transition"
            style={{ background: 'linear-gradient(135deg, #7c3aed, #d4af37)' }}>
            <Download size={14} /> Download
          </button>

          <button onClick={onClose}
            className="p-2 rounded-lg bg-white/10 hover:bg-white/20 transition text-white ml-1">
            <X size={18} />
          </button>
        </div>
      </div>

      {/* Preview area */}
      <div className="flex-1 flex items-center justify-center overflow-auto p-4">

        {/* Image preview */}
        {isImage && (
          <div style={{ overflow: 'auto', maxWidth: '100%', maxHeight: '100%' }}>
            <img
              src={file.url}
              alt={file.name}
              style={{
                transform: `scale(${zoom}) rotate(${rotation}deg)`,
                transformOrigin: 'center',
                transition: 'transform 0.2s ease',
                maxWidth: zoom === 1 ? '90vw' : 'none',
                maxHeight: zoom === 1 ? '80vh' : 'none',
                borderRadius: '8px',
                display: 'block',
              }}
            />
          </div>
        )}

        {/* PDF preview */}
        {isPDF && (
          <div className="w-full h-full" style={{ maxWidth: '900px', height: '80vh' }}>
            <iframe
              src={`${file.url}#toolbar=1`}
              className="w-full h-full rounded-xl"
              style={{ border: 'none', background: 'white' }}
              title={file.name}
            />
          </div>
        )}

        {/* Video preview */}
        {isVideo && (
          <video
            src={file.url}
            controls
            autoPlay
            style={{ maxWidth: '90vw', maxHeight: '80vh', borderRadius: '12px' }}>
            Your browser does not support video.
          </video>
        )}

        {/* Audio preview */}
        {isAudio && (
          <div className="text-center">
            <div className="w-32 h-32 rounded-full bg-white/10 flex items-center justify-center mb-6 mx-auto">
              <span style={{ fontSize: '3rem' }}>🎵</span>
            </div>
            <p className="text-white font-semibold mb-4">{file.name}</p>
            <audio src={file.url} controls className="w-80">
              Your browser does not support audio.
            </audio>
          </div>
        )}

        {/* Text preview */}
        {isText && (
          <iframe
            src={file.url}
            className="w-full rounded-xl"
            style={{ height: '80vh', maxWidth: '900px', border: 'none', background: 'white', padding: '1rem' }}
            title={file.name}
          />
        )}

        {/* Unsupported */}
        {!isImage && !isPDF && !isVideo && !isAudio && !isText && (
          <div className="text-center">
            <div className="w-24 h-24 rounded-2xl bg-white/10 flex items-center justify-center mb-6 mx-auto">
              <span style={{ fontSize: '3rem' }}>📄</span>
            </div>
            <p className="text-white font-semibold text-lg mb-2">{file.name}</p>
            <p className="text-white/40 text-sm mb-6">Preview not available for this file type</p>
            <button
              onClick={() => handleDownload(file.url, file.name)}
              className="flex items-center gap-2 px-5 py-3 rounded-xl text-white font-semibold mx-auto transition"
              style={{ background: 'linear-gradient(135deg, #7c3aed, #d4af37)' }}>
              <Download size={18} /> Download File
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
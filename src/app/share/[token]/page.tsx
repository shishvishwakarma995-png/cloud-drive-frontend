'use client';
import { useState } from 'react';
import { useParams } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { Cloud, Download, File, Image, Film, FileText, Lock, AlertCircle } from 'lucide-react';
import Link from 'next/link';
import api from '@/lib/api';

const getFileIcon = (mimeType: string) => {
  if (mimeType?.startsWith('image/')) return { icon: Image, color: '#ec4899' };
  if (mimeType?.startsWith('video/')) return { icon: Film, color: '#8b5cf6' };
  if (mimeType?.includes('pdf') || mimeType?.includes('text')) return { icon: FileText, color: '#ef4444' };
  return { icon: File, color: '#8a8090' };
};

const formatSize = (bytes: number) => {
  if (!bytes) return '—';
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
};

export default function SharePage() {
  const { token } = useParams();
  const [password, setPassword] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const { data, isLoading, error } = useQuery({
    queryKey: ['share', token, submitted],
    queryFn: async () => {
      const res = await api.post(`/api/public/share/${token}`, { password });
      return res.data;
    },
    retry: false,
    enabled: true,
  });

  const handlePasswordSubmit = () => {
    if (!password) return;
    setSubmitted(prev => !prev);
  };

  const errorCode = (error as any)?.response?.data?.error?.code;
  const needsPassword = errorCode === 'PASSWORD_REQUIRED' || errorCode === 'WRONG_PASSWORD';
  const isExpired = errorCode === 'EXPIRED';
  const notFound = errorCode === 'NOT_FOUND';

  return (
    <div style={{
      minHeight: '100vh', background: '#0a0a0f',
      display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center',
      padding: '2rem', fontFamily: 'Georgia, serif',
    }}>

      {/* Logo */}
      <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: '10px', textDecoration: 'none', marginBottom: '2rem' }}>
        <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: 'linear-gradient(135deg, #7c3aed, #d4af37)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Cloud size={18} color="#fff" />
        </div>
        <span style={{ color: '#f0eee8', fontWeight: 'bold', fontSize: '1.1rem' }}>Cloud Drive</span>
      </Link>

      <div style={{ width: '100%', maxWidth: '480px', background: 'rgba(18,17,26,0.9)', border: '1px solid rgba(212,175,55,0.15)', borderRadius: '24px', padding: '2.5rem' }}>

        {/* Loading */}
        {isLoading && (
          <div style={{ textAlign: 'center', color: '#8a8090' }}>
            <p style={{ fontSize: '2rem', marginBottom: '1rem' }}>⏳</p>
            <p>Loading...</p>
          </div>
        )}

        {/* Password required */}
        {!isLoading && needsPassword && (
          <div style={{ textAlign: 'center' }}>
            <div style={{ width: '56px', height: '56px', borderRadius: '16px', background: 'rgba(212,175,55,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem' }}>
              <Lock size={24} color="#d4af37" />
            </div>
            <h2 style={{ color: '#f0eee8', fontWeight: 'bold', fontSize: '1.3rem', marginBottom: '0.5rem' }}>Password Required</h2>
            <p style={{ color: '#5a5460', fontSize: '0.85rem', marginBottom: '1.5rem' }}>This file is password protected</p>
            {errorCode === 'WRONG_PASSWORD' && (
              <p style={{ color: '#ef4444', fontSize: '0.8rem', marginBottom: '1rem' }}>Wrong password!</p>
            )}
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handlePasswordSubmit()}
              placeholder="Enter password"
              style={{ width: '100%', padding: '0.75rem 1rem', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(212,175,55,0.2)', borderRadius: '12px', color: '#f0eee8', fontSize: '0.9rem', outline: 'none', marginBottom: '1rem', boxSizing: 'border-box', fontFamily: 'Georgia, serif' }}
            />
            <button onClick={handlePasswordSubmit}
              style={{ width: '100%', padding: '0.85rem', background: 'linear-gradient(135deg, #7c3aed, #d4af37)', border: 'none', borderRadius: '12px', color: '#fff', fontWeight: 'bold', cursor: 'pointer', fontSize: '0.95rem' }}>
              Access File
            </button>
          </div>
        )}

        {/* Expired */}
        {!isLoading && isExpired && (
          <div style={{ textAlign: 'center' }}>
            <AlertCircle size={48} color="#ef4444" style={{ margin: '0 auto 1rem', display: 'block' }} />
            <h2 style={{ color: '#f0eee8', fontWeight: 'bold', fontSize: '1.3rem', marginBottom: '0.5rem' }}>Link Expired</h2>
            <p style={{ color: '#5a5460', fontSize: '0.85rem' }}>This link has expired. Ask the owner for a new link.</p>
          </div>
        )}

        {/* Not found */}
        {!isLoading && notFound && (
          <div style={{ textAlign: 'center' }}>
            <AlertCircle size={48} color="#ef4444" style={{ margin: '0 auto 1rem', display: 'block' }} />
            <h2 style={{ color: '#f0eee8', fontWeight: 'bold', fontSize: '1.3rem', marginBottom: '0.5rem' }}>Link Not Found</h2>
            <p style={{ color: '#5a5460', fontSize: '0.85rem' }}>This link does not exist or has been removed.</p>
          </div>
        )}

        {/* File found */}
        {!isLoading && data?.item && data?.type === 'file' && (() => {
          const { icon: Icon, color } = getFileIcon(data.item.mime_type);
          return (
            <div style={{ textAlign: 'center' }}>
              {data.item.mime_type?.startsWith('image/') ? (
                <img src={data.item.url} alt={data.item.name}
                  style={{ width: '100%', maxHeight: '250px', objectFit: 'contain', borderRadius: '16px', marginBottom: '1.5rem', background: 'rgba(255,255,255,0.04)' }} />
              ) : (
                <div style={{ width: '72px', height: '72px', borderRadius: '20px', background: 'rgba(212,175,55,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem' }}>
                  <Icon size={32} color={color} />
                </div>
              )}
              <h2 style={{ color: '#f0eee8', fontWeight: 'bold', fontSize: '1.1rem', marginBottom: '0.4rem', wordBreak: 'break-all' }}>{data.item.name}</h2>
              <p style={{ color: '#5a5460', fontSize: '0.8rem', marginBottom: '1.5rem' }}>{formatSize(data.item.size_bytes)}</p>
              <a href={data.item.url} download={data.item.name}
                style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', background: 'linear-gradient(135deg, #7c3aed, #d4af37)', color: '#fff', textDecoration: 'none', padding: '0.9rem 2rem', borderRadius: '12px', fontWeight: 'bold', fontSize: '0.95rem' }}>
                <Download size={18} /> Download File
              </a>
            </div>
          );
        })()}

        {/* Folder found */}
        {!isLoading && data?.item && data?.type === 'folder' && (
          <div style={{ textAlign: 'center' }}>
            <div style={{ width: '72px', height: '72px', borderRadius: '20px', background: 'rgba(212,175,55,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem' }}>
              <span style={{ fontSize: '2.5rem' }}>📁</span>
            </div>
            <h2 style={{ color: '#f0eee8', fontWeight: 'bold', fontSize: '1.1rem', marginBottom: '0.4rem' }}>{data.item.name}</h2>
            <p style={{ color: '#5a5460', fontSize: '0.8rem', marginBottom: '1.5rem' }}>Shared folder</p>
            <Link href="/login" style={{ display: 'inline-block', background: 'linear-gradient(135deg, #7c3aed, #d4af37)', color: '#fff', textDecoration: 'none', padding: '0.9rem 2rem', borderRadius: '12px', fontWeight: 'bold', fontSize: '0.95rem' }}>
              Sign in to Access
            </Link>
          </div>
        )}

      </div>

      <p style={{ color: '#3a3848', fontSize: '0.75rem', marginTop: '1.5rem' }}>Shared via Cloud Drive</p>
    </div>
  );
}
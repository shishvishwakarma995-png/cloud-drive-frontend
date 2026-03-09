'use client';
import { useQuery } from '@tanstack/react-query';
import Sidebar from '@/components/layout/Sidebar';
import FileGrid from '@/components/files/FileGrid';
import { useTheme } from '@/context/ThemeContext';
import { Clock } from 'lucide-react';
import api from '@/lib/api';

export default function RecentPage() {
  const { t } = useTheme();

  const { data, isLoading } = useQuery({
    queryKey: ['recent'],
    queryFn: async () => {
      const res = await api.get('/api/files/recent');
      return res.data;
    },
  });

  const files = data?.files || [];

  return (
    <div className={`flex min-h-screen ${t.bg}`}>
      <Sidebar />
      <div className="ml-64 flex-1 flex flex-col">

        {/* Header */}
        <div className={`flex items-center gap-3 px-6 py-4 border-b ${t.border} ${t.sidebar.split(' ')[0]}`}>
          <div className={`w-9 h-9 rounded-xl ${t.accentBg} flex items-center justify-center`}>
            <Clock size={18} className={t.accentText} />
          </div>
          <div>
            <h1 className={`font-bold text-lg ${t.text}`}>Recent</h1>
            <p className={`text-xs ${t.textSub}`}>{files.length} recent files</p>
          </div>
        </div>

        <div className="flex-1 p-6">
          {isLoading && (
            <div className="grid grid-cols-6 gap-3">
              {[...Array(12)].map((_, i) => (
                <div key={i} className={`border ${t.border} rounded-2xl p-4 animate-pulse h-24 ${t.accentBg}`} />
              ))}
            </div>
          )}

          {!isLoading && files.length === 0 && (
            <div className="flex flex-col items-center justify-center h-72 text-center">
              <div className={`w-20 h-20 rounded-2xl ${t.accentBg} flex items-center justify-center mb-4`}>
                <Clock size={36} className={t.accentText} />
              </div>
              <p className={`font-semibold text-lg ${t.text}`}>No recent files</p>
              <p className={`text-sm mt-1 ${t.textMuted}`}>Files you upload will appear here</p>
            </div>
          )}

          {!isLoading && files.length > 0 && (
            <div>
              <h3 className={`text-xs font-bold uppercase tracking-widest mb-3 ${t.textSub}`}>
                Recent Files — {files.length}
              </h3>
              <FileGrid files={files} view="grid" />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

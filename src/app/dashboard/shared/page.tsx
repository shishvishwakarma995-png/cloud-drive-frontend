'use client';
import Sidebar from '@/components/layout/Sidebar';
import { Trash2 } from 'lucide-react';
import { useTheme } from '@/context/ThemeContext';
export default function TrashPage() {
  const { t } = useTheme();
  return (
    <div className={`flex min-h-screen ${t.bg}`}>
      <Sidebar />
      <div className="ml-64 flex-1 flex flex-col items-center justify-center">
        <div className={`w-20 h-20 rounded-2xl ${t.accentBg} flex items-center justify-center mb-4`}>
          <Trash2 size={32} className={t.accentText} />
        </div>
        <p className={`font-semibold text-lg ${t.text}`}>Shared by others</p>
        <p className={`text-sm mt-1 ${t.textMuted}`}>Files shared by others will appear here</p>
      </div>
    </div>
  );
}

'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { HardDrive, Users, Star, Clock, Trash2, Cloud, Sun, Moon, Activity } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useTheme } from '@/context/ThemeContext';
import { useQuery } from '@tanstack/react-query';
import api from '@/lib/api';

const navItems = [
  { label: 'My Drive', href: '/dashboard', icon: HardDrive },
  { label: 'Shared with Me', href: '/dashboard/shared', icon: Users },
  { label: 'Starred', href: '/dashboard/starred', icon: Star },
  { label: 'Recent', href: '/dashboard/recent', icon: Clock },
  { label: 'Activity', href: '/dashboard/activity', icon: Activity },
  { label: 'Trash', href: '/dashboard/trash', icon: Trash2 },
];

export default function Sidebar() {
  const pathname = usePathname();
  const { user, logout } = useAuth();
  const { mode, toggleMode, t } = useTheme();

  const { data: storageData } = useQuery({
    queryKey: ['storage'],
    queryFn: async () => {
      const res = await api.get('/api/files/storage');
      return res.data;
    },
    refetchInterval: 30000,
  });

  const usedBytes = storageData?.used || 0;
  const totalGB = storageData?.totalGB || 15;
  const percentage = storageData?.percentage || 0;

  const formatStorage = (bytes: number) => {
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    if (bytes < 1024 * 1024 * 1024) return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
    return `${(bytes / (1024 * 1024 * 1024)).toFixed(2)} GB`;
  };

  return (
    <div className={`w-64 h-screen fixed left-0 top-0 flex flex-col border-r ${t.sidebar}`}>

      {/* Logo + Theme Toggle */}
      <div className={`p-5 border-b ${t.border} flex items-center justify-between`}>
        <div className="flex items-center gap-2.5">
          <div className={`w-9 h-9 rounded-xl ${t.accent} flex items-center justify-center shadow-sm`}>
            <Cloud size={18} className="text-white" />
          </div>
          <span className={`font-bold text-lg ${t.text}`}>Cloud Drive</span>
        </div>
        <button
          onClick={toggleMode}
          className={`w-8 h-8 rounded-lg ${t.accentBg} flex items-center justify-center transition ${t.accentText}`}
          title={mode === 'dark' ? 'Switch to Light' : 'Switch to Dark'}>
          {mode === 'dark' ? <Sun size={15} /> : <Moon size={15} />}
        </button>
      </div>

      {/* Nav */}
      <nav className="flex-1 p-3 space-y-0.5 mt-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;
          return (
            <Link key={item.href} href={item.href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all relative ${
                isActive
                  ? `${t.accentBg} ${t.accentText}`
                  : `${t.textMuted} ${t.hover}`
              }`}>
              {isActive && (
                <div className={`absolute left-0 top-1/2 -translate-y-1/2 w-1 h-5 rounded-r-full ${t.accent}`} />
              )}
              <Icon size={17} className={isActive ? t.accentText : t.textSub} />
              {item.label}
            </Link>
          );
        })}
      </nav>

      {/* Storage */}
      <div className={`mx-3 mb-3 p-3 rounded-xl ${t.accentBg} border ${t.accentBorder}`}>
        <div className={`flex justify-between text-xs ${t.accentText} mb-1.5`}>
          <span className="font-semibold">Storage</span>
          <span>{formatStorage(usedBytes)} / {totalGB} GB</span>
        </div>
        <div className="h-1.5 rounded-full overflow-hidden bg-white/10">
          <div
            className={`h-full rounded-full transition-all duration-500 ${t.accent}`}
            style={{ width: `${Math.max(percentage, 0.5)}%` }}
          />
        </div>
        <p className={`text-xs mt-1 ${t.accentText} opacity-70`}>{percentage}% used</p>
      </div>

      {/* User */}
      <div className={`p-3 border-t ${t.border}`}>
        <Link href="/dashboard/profile"
          className={`flex items-center gap-3 px-2 py-2 rounded-xl ${t.hover} transition`}>
          <div className={`w-8 h-8 rounded-full ${t.accent} flex items-center justify-center text-white text-sm font-bold shrink-0`}>
            {user?.name?.charAt(0).toUpperCase()}
          </div>
          <div className="flex-1 min-w-0">
            <p className={`text-sm font-semibold truncate ${t.text}`}>{user?.name}</p>
            <p className={`text-xs truncate ${t.textSub}`}>{user?.email}</p>
          </div>
        </Link>
        <button onClick={logout}
          className={`w-full mt-1 text-xs py-1.5 rounded-lg transition font-medium ${t.textMuted} hover:text-red-500 hover:bg-red-50`}>
          Sign out
        </button>
      </div>
    </div>
  );
}
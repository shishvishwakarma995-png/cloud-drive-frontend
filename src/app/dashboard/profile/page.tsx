'use client';
import { useState, useRef } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useTheme } from '@/context/ThemeContext';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import Sidebar from '@/components/layout/Sidebar';
import api from '@/lib/api';
import { User, Mail, Lock, Camera, Save, Eye, EyeOff, Calendar, HardDrive, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function ProfilePage() {
  const { user, logout } = useAuth();
  const { t } = useTheme();
  const queryClient = useQueryClient();
  const fileRef = useRef<HTMLInputElement>(null);

  const [name, setName] = useState(user?.name || '');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [profileMsg, setProfileMsg] = useState('');
  const [passwordMsg, setPasswordMsg] = useState('');
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [avatarData, setAvatarData] = useState<string | null>(null);

  // Storage data
  const { data: storageData } = useQuery({
    queryKey: ['storage'],
    queryFn: async () => {
      const res = await api.get('/api/files/storage');
      return res.data;
    },
  });

  // Update profile
  const updateProfile = useMutation({
    mutationFn: async () => {
      const res = await api.patch('/api/auth/profile', {
        name,
        imageData: avatarData,
      });
      return res.data;
    },
    onSuccess: () => {
      setProfileMsg('✓ Profile updated successfully!');
      setAvatarData(null);
      queryClient.invalidateQueries({ queryKey: ['me'] });
      setTimeout(() => setProfileMsg(''), 3000);
    },
    onError: (err: any) => {
      setProfileMsg('✗ ' + (err.response?.data?.error?.message || 'Failed to update'));
    },
  });

  // Change password
  const changePassword = useMutation({
    mutationFn: async () => {
      const res = await api.patch('/api/auth/change-password', {
        currentPassword,
        newPassword,
      });
      return res.data;
    },
    onSuccess: () => {
      setPasswordMsg('✓ Password changed successfully!');
      setCurrentPassword('');
      setNewPassword('');
      setTimeout(() => setPasswordMsg(''), 3000);
    },
    onError: (err: any) => {
      setPasswordMsg('✗ ' + (err.response?.data?.error?.message || 'Failed to change password'));
    },
  });

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const base64 = (reader.result as string).split(',')[1];
      setAvatarData(base64);
      setAvatarPreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const usedGB = storageData?.usedGB || '0.00';
  const totalGB = storageData?.totalGB || 15;
  const percentage = storageData?.percentage || 0;

  const initials = user?.name?.split(' ').map((n: string) => n[0]).join('').toUpperCase() || 'U';

  return (
    <div className={`flex min-h-screen ${t.bg}`}>
      <Sidebar />
      <div className="ml-64 flex-1 flex flex-col">

        {/* Header */}
        <div className={`flex items-center gap-3 px-6 py-4 border-b ${t.border} ${t.sidebar.split(' ')[0]}`}>
          <Link href="/dashboard" className={`p-2 rounded-xl ${t.hover} ${t.textSub} transition`}>
            <ArrowLeft size={18} />
          </Link>
          <div className={`w-9 h-9 rounded-xl ${t.accentBg} flex items-center justify-center`}>
            <User size={18} className={t.accentText} />
          </div>
          <div>
            <h1 className={`font-bold text-lg ${t.text}`}>Profile</h1>
            <p className={`text-xs ${t.textSub}`}>Manage your account</p>
          </div>
        </div>

        <div className="flex-1 p-6 max-w-2xl">

          {/* Avatar + Basic Info Card */}
          <div className={`rounded-2xl border ${t.border} p-6 mb-4 ${t.sidebar.split(' ')[0]}`}>
            <h2 className={`font-bold text-sm uppercase tracking-widest mb-4 ${t.textSub}`}>Profile Info</h2>

            {/* Avatar */}
            <div className="flex items-center gap-5 mb-6">
              <div className="relative">
                {avatarPreview || user?.image_url ? (
                  <img
                    src={avatarPreview || user?.image_url}
                    alt="avatar"
                    className="w-20 h-20 rounded-2xl object-cover"
                  />
                ) : (
                  <div className={`w-20 h-20 rounded-2xl ${t.accentBg} flex items-center justify-center`}>
                    <span className={`text-2xl font-bold ${t.accentText}`}>{initials}</span>
                  </div>
                )}
                <button
                  onClick={() => fileRef.current?.click()}
                  className={`absolute -bottom-2 -right-2 w-7 h-7 rounded-full ${t.accent} flex items-center justify-center shadow-lg transition`}>
                  <Camera size={13} className="text-white" />
                </button>
                <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleAvatarChange} />
              </div>
              <div>
                <p className={`font-bold text-lg ${t.text}`}>{user?.name}</p>
                <p className={`text-sm ${t.textSub}`}>{user?.email}</p>
                {avatarPreview && (
                  <p className="text-xs text-amber-400 mt-1">New photo selected — save to apply!</p>
                )}
              </div>
            </div>

            {/* Name field */}
            <div className="mb-4">
              <label className={`block text-xs font-semibold uppercase tracking-widest mb-2 ${t.textSub}`}>
                Full Name
              </label>
              <div className="relative">
                <User size={15} className={`absolute left-3.5 top-1/2 -translate-y-1/2 ${t.textSub}`} />
                <input
                  type="text"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  className={`w-full pl-10 pr-4 py-2.5 rounded-xl border text-sm outline-none ${t.input} ${t.text}`}
                />
              </div>
            </div>

            {/* Email field (readonly) */}
            <div className="mb-5">
              <label className={`block text-xs font-semibold uppercase tracking-widest mb-2 ${t.textSub}`}>
                Email Address
              </label>
              <div className="relative">
                <Mail size={15} className={`absolute left-3.5 top-1/2 -translate-y-1/2 ${t.textSub}`} />
                <input
                  type="email"
                  value={user?.email || ''}
                  readOnly
                  className={`w-full pl-10 pr-4 py-2.5 rounded-xl border text-sm outline-none opacity-60 cursor-not-allowed ${t.input} ${t.text}`}
                />
              </div>
              <p className={`text-xs mt-1 ${t.textSub}`}>Email cannot be changed</p>
            </div>

            {profileMsg && (
              <p className={`text-sm mb-3 ${profileMsg.startsWith('✓') ? 'text-green-400' : 'text-red-400'}`}>
                {profileMsg}
              </p>
            )}

            <button
              onClick={() => updateProfile.mutate()}
              disabled={updateProfile.isPending}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-white transition ${t.accent} disabled:opacity-60`}>
              <Save size={15} />
              {updateProfile.isPending ? 'Saving...' : 'Save Changes'}
            </button>
          </div>

          {/* Change Password Card */}
          <div className={`rounded-2xl border ${t.border} p-6 mb-4 ${t.sidebar.split(' ')[0]}`}>
            <h2 className={`font-bold text-sm uppercase tracking-widest mb-4 ${t.textSub}`}>Change Password</h2>

            <div className="mb-4">
              <label className={`block text-xs font-semibold uppercase tracking-widest mb-2 ${t.textSub}`}>
                Current Password
              </label>
              <div className="relative">
                <Lock size={15} className={`absolute left-3.5 top-1/2 -translate-y-1/2 ${t.textSub}`} />
                <input
                  type={showCurrent ? 'text' : 'password'}
                  value={currentPassword}
                  onChange={e => setCurrentPassword(e.target.value)}
                  placeholder="Enter current password"
                  className={`w-full pl-10 pr-10 py-2.5 rounded-xl border text-sm outline-none ${t.input} ${t.text}`}
                />
                <button onClick={() => setShowCurrent(!showCurrent)}
                  className={`absolute right-3.5 top-1/2 -translate-y-1/2 ${t.textSub}`}>
                  {showCurrent ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
            </div>

            <div className="mb-5">
              <label className={`block text-xs font-semibold uppercase tracking-widest mb-2 ${t.textSub}`}>
                New Password
              </label>
              <div className="relative">
                <Lock size={15} className={`absolute left-3.5 top-1/2 -translate-y-1/2 ${t.textSub}`} />
                <input
                  type={showNew ? 'text' : 'password'}
                  value={newPassword}
                  onChange={e => setNewPassword(e.target.value)}
                  placeholder="Min 8 characters"
                  className={`w-full pl-10 pr-10 py-2.5 rounded-xl border text-sm outline-none ${t.input} ${t.text}`}
                />
                <button onClick={() => setShowNew(!showNew)}
                  className={`absolute right-3.5 top-1/2 -translate-y-1/2 ${t.textSub}`}>
                  {showNew ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
            </div>

            {passwordMsg && (
              <p className={`text-sm mb-3 ${passwordMsg.startsWith('✓') ? 'text-green-400' : 'text-red-400'}`}>
                {passwordMsg}
              </p>
            )}

            <button
              onClick={() => changePassword.mutate()}
              disabled={changePassword.isPending || !currentPassword || !newPassword}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-white transition ${t.accent} disabled:opacity-60`}>
              <Lock size={15} />
              {changePassword.isPending ? 'Changing...' : 'Change Password'}
            </button>
          </div>

          {/* Storage + Account Info Card */}
          <div className={`rounded-2xl border ${t.border} p-6 ${t.sidebar.split(' ')[0]}`}>
            <h2 className={`font-bold text-sm uppercase tracking-widest mb-4 ${t.textSub}`}>Account Info</h2>

            {/* Storage */}
            <div className="mb-5">
              <div className="flex justify-between items-center mb-2">
                <div className="flex items-center gap-2">
                  <HardDrive size={15} className={t.accentText} />
                  <span className={`text-sm font-semibold ${t.text}`}>Storage</span>
                </div>
                <span className={`text-sm font-bold ${t.accentText}`}>{usedGB} / {totalGB} GB</span>
              </div>
              <div className={`w-full h-2 rounded-full bg-white/10 overflow-hidden`}>
                <div
                  className={`h-full rounded-full transition-all duration-500 ${t.accent}`}
                  style={{ width: `${percentage}%` }}
                />
              </div>
              <p className={`text-xs mt-1 ${t.textSub}`}>{percentage}% used</p>
            </div>

            {/* Join date */}
            <div className={`flex items-center gap-3 p-3 rounded-xl ${t.accentBg}`}>
              <Calendar size={15} className={t.accentText} />
              <div>
                <p className={`text-xs ${t.textSub}`}>Member since</p>
                <p className={`text-sm font-semibold ${t.text}`}>
                  {user?.created_at
                    ? new Date(user.created_at).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })
                    : 'N/A'}
                </p>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
'use client';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function DashboardPage() {
  const { user, loading, logout } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) router.push('/login');
  }, [user, loading]);

  if (loading) return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center">
      <div className="text-gray-400">Loading...</div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-950 text-white p-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-2xl font-bold">☁️ Cloud Drive</h1>
          <button onClick={logout} className="text-sm text-gray-400 hover:text-white border border-gray-700 rounded-lg px-4 py-2 transition">
            Logout
          </button>
        </div>
        <div className="bg-gray-900 rounded-2xl p-6 border border-gray-800">
          <p className="text-gray-400">Welcome, <span className="text-white font-semibold">{user?.name}</span>! 🎉</p>
          <p className="text-gray-500 text-sm mt-1">Dashboard UI coming next...</p>
        </div>
      </div>
    </div>
  );
}
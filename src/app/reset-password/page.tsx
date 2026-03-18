'use client';
import { useState, Suspense, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Cloud, Lock, Eye, EyeOff, CheckCircle } from 'lucide-react';
import api from '@/lib/api';

function ResetPasswordForm() {
  const router = useRouter();
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState('');
  const [accessToken, setAccessToken] = useState('');

  // Hash se token uthao (#access_token=...)
  useEffect(() => {
    const hash = window.location.hash;
    const params = new URLSearchParams(hash.replace('#', ''));
    const token = params.get('access_token') || '';
    setAccessToken(token);
  }, []);

  const handleReset = async () => {
    if (!password || !confirm) return setError('Both fields required');
    if (password !== confirm) return setError('Passwords do not match');
    if (password.length < 8) return setError('Password must be at least 8 characters');
    if (!accessToken) return setError('Invalid or expired reset link. Please request a new one.');

    setLoading(true);
    setError('');
    try {
      await api.post('/api/auth/reset-password', { accessToken, newPassword: password });
      setDone(true);
      setTimeout(() => router.push('/login'), 3000);
    } catch (err: any) {
      setError(err.response?.data?.error?.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-purple-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="w-14 h-14 bg-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
            <Cloud size={28} className="text-white" />
          </div>
          <h1 className="text-2xl font-bold text-slate-800">Reset Password</h1>
          <p className="text-slate-500 mt-1 text-sm">Enter your new password below</p>
        </div>

        <div className="bg-white rounded-3xl shadow-xl p-8">
          {done ? (
            <div className="text-center py-4">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle size={32} className="text-green-500" />
              </div>
              <h2 className="font-bold text-lg text-slate-800 mb-2">Password Updated!</h2>
              <p className="text-slate-500 text-sm">Redirecting to login...</p>
            </div>
          ) : (
            <div className="space-y-4">
              {error && (
                <div className="bg-red-50 border border-red-200 text-red-600 text-sm rounded-xl px-4 py-3">
                  {error}
                </div>
              )}
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">New Password</label>
                <div className="relative">
                  <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type={showPass ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Min 8 characters"
                    className="w-full pl-10 pr-10 py-3 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                  <button onClick={() => setShowPass(!showPass)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400">
                    {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Confirm Password</label>
                <div className="relative">
                  <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type={showPass ? 'text' : 'password'}
                    value={confirm}
                    onChange={(e) => setConfirm(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleReset()}
                    placeholder="Repeat password"
                    className="w-full pl-10 pr-4 py-3 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>
              </div>
              <button
                onClick={handleReset}
                disabled={loading}
                className="w-full py-3 bg-purple-600 hover:bg-purple-700 text-white font-semibold rounded-xl transition text-sm disabled:opacity-60">
                {loading ? 'Updating...' : 'Update Password'}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse text-slate-500">Loading...</div>
      </div>
    }>
      <ResetPasswordForm />
    </Suspense>
  );
}
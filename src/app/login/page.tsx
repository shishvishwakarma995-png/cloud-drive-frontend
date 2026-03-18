'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import api from '@/lib/api';
import Link from 'next/link';
import { Cloud, Mail, Lock, Eye, EyeOff, ArrowRight } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPass, setShowPass] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await api.post('/api/auth/login', form);
      if (res.data.accessToken) {
        localStorage.setItem('accessToken', res.data.accessToken);
      }
      if (res.data.user) {
        window.location.href = '/dashboard';
      }
    } catch (err: any) {
      setError(err.response?.data?.error?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      onMouseMove={(e) => setMousePos({ x: e.clientX, y: e.clientY })}
      style={{
        minHeight: '100vh',
        background: '#0a0a0f',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '1rem',
        fontFamily: 'Georgia, serif',
        position: 'relative',
        overflow: 'hidden',
      }}>

      <div style={{
        position: 'fixed',
        left: mousePos.x - 250,
        top: mousePos.y - 250,
        width: '500px', height: '500px',
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(212,175,55,0.05) 0%, transparent 70%)',
        pointerEvents: 'none', zIndex: 0,
        transition: 'left 0.15s ease, top 0.15s ease',
      }} />

      <div style={{
        position: 'absolute', top: '10%', left: '5%',
        width: '400px', height: '400px', borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(124,58,237,0.06) 0%, transparent 70%)',
        pointerEvents: 'none',
      }} />
      <div style={{
        position: 'absolute', bottom: '10%', right: '5%',
        width: '300px', height: '300px', borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(212,175,55,0.06) 0%, transparent 70%)',
        pointerEvents: 'none',
      }} />

      <style>{`
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .login-card { animation: fadeInUp 0.5s ease forwards; }
        .login-input {
          width: 100%; padding: 0.75rem 1rem 0.75rem 2.8rem;
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(212,175,55,0.2);
          border-radius: 12px; color: #f0eee8; font-size: 0.9rem;
          outline: none; transition: all 0.2s;
          font-family: Georgia, serif;
          box-sizing: border-box;
        }
        .login-input::placeholder { color: #4a4760; }
        .login-input:focus {
          border-color: rgba(212,175,55,0.6);
          background: rgba(212,175,55,0.05);
          box-shadow: 0 0 0 3px rgba(212,175,55,0.1);
        }
      `}</style>

      <div className="login-card" style={{
        width: '100%', maxWidth: '440px',
        background: 'rgba(18,17,26,0.9)',
        border: '1px solid rgba(212,175,55,0.15)',
        borderRadius: '24px',
        padding: '2.5rem',
        backdropFilter: 'blur(20px)',
        position: 'relative', zIndex: 1,
        boxShadow: '0 25px 80px rgba(0,0,0,0.5)',
      }}>

        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div style={{
            width: '56px', height: '56px', borderRadius: '16px',
            background: 'linear-gradient(135deg, #7c3aed, #d4af37)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            margin: '0 auto 1rem',
            boxShadow: '0 8px 25px rgba(212,175,55,0.25)',
          }}>
            <Cloud size={26} color="#fff" />
          </div>
          <h1 style={{ fontSize: '1.6rem', fontWeight: 'bold', color: '#f0eee8', marginBottom: '0.3rem' }}>
            Welcome back
          </h1>
          <p style={{ fontSize: '0.85rem', color: '#4a4760' }}>Sign in to your Cloud Drive</p>
        </div>

        {error && (
          <div style={{
            background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)',
            color: '#f87171', fontSize: '0.85rem', borderRadius: '10px',
            padding: '0.75rem 1rem', marginBottom: '1.5rem',
          }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '1.2rem' }}>
            <label style={{ display: 'block', fontSize: '0.8rem', color: '#8a8090', marginBottom: '0.5rem', letterSpacing: '0.05em' }}>
              EMAIL ADDRESS
            </label>
            <div style={{ position: 'relative' }}>
              <Mail size={15} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: '#4a4760' }} />
              <input type="email" value={form.email}
                onChange={e => setForm({ ...form, email: e.target.value })}
                className="login-input" placeholder="you@example.com" required />
            </div>
          </div>

          <div style={{ marginBottom: '1.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
              <label style={{ fontSize: '0.8rem', color: '#8a8090', letterSpacing: '0.05em' }}>PASSWORD</label>
              <Link href="/forgot-password" style={{ fontSize: '0.75rem', color: '#d4af37', textDecoration: 'none' }}>
                Forgot password?
              </Link>
            </div>
            <div style={{ position: 'relative' }}>
              <Lock size={15} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: '#4a4760' }} />
              <input type={showPass ? 'text' : 'password'} value={form.password}
                onChange={e => setForm({ ...form, password: e.target.value })}
                className="login-input" placeholder="••••••••"
                style={{ paddingRight: '3rem' }} required />
              <button type="button" onClick={() => setShowPass(!showPass)} style={{
                position: 'absolute', right: '1rem', top: '50%', transform: 'translateY(-50%)',
                background: 'none', border: 'none', cursor: 'pointer', color: '#4a4760', padding: 0,
              }}>
                {showPass ? <EyeOff size={15} /> : <Eye size={15} />}
              </button>
            </div>
          </div>

          <button type="submit" disabled={loading} style={{
            width: '100%', padding: '0.85rem',
            background: loading ? 'rgba(212,175,55,0.4)' : 'linear-gradient(135deg, #7c3aed, #d4af37)',
            border: 'none', borderRadius: '12px',
            color: '#fff', fontWeight: 'bold', fontSize: '0.95rem',
            cursor: loading ? 'not-allowed' : 'pointer',
            transition: 'all 0.3s', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
            fontFamily: 'Georgia, serif',
          }}>
            {loading ? 'Signing in...' : (<>Sign In <ArrowRight size={16} /></>)}
          </button>
        </form>

        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', margin: '1.5rem 0' }}>
          <div style={{ flex: 1, height: '1px', background: 'rgba(212,175,55,0.1)' }} />
          <span style={{ fontSize: '0.75rem', color: '#4a4760' }}>or</span>
          <div style={{ flex: 1, height: '1px', background: 'rgba(212,175,55,0.1)' }} />
        </div>

        <p style={{ textAlign: 'center', fontSize: '0.85rem', color: '#4a4760' }}>
          Don't have an account?{' '}
          <Link href="/register" style={{ color: '#d4af37', textDecoration: 'none', fontWeight: 'bold' }}>
            Create account
          </Link>
        </p>
      </div>
    </div>
  );
}
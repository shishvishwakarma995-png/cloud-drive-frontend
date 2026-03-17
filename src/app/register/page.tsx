'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import api from '@/lib/api';
import Link from 'next/link';
import { Cloud, Mail, Lock, Eye, EyeOff, User, ArrowRight } from 'lucide-react';

export default function RegisterPage() {
  const router = useRouter();
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPass, setShowPass] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await api.post('/api/auth/register', form);
      router.push('/dashboard');
    } catch (err: any) {
      setError(err.response?.data?.error?.message || 'Registration failed');
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

      {/* Cursor glow */}
      <div style={{
        position: 'fixed',
        left: mousePos.x - 250,
        top: mousePos.y - 250,
        width: '500px', height: '500px',
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(124,58,237,0.05) 0%, transparent 70%)',
        pointerEvents: 'none', zIndex: 0,
        transition: 'left 0.15s ease, top 0.15s ease',
      }} />

      {/* Background decorations */}
      <div style={{
        position: 'absolute', top: '10%', right: '5%',
        width: '400px', height: '400px', borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(124,58,237,0.06) 0%, transparent 70%)',
        pointerEvents: 'none',
      }} />
      <div style={{
        position: 'absolute', bottom: '10%', left: '5%',
        width: '300px', height: '300px', borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(212,175,55,0.06) 0%, transparent 70%)',
        pointerEvents: 'none',
      }} />

      <style>{`
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .register-card { animation: fadeInUp 0.5s ease forwards; }
        .register-input {
          width: 100%; padding: 0.75rem 1rem 0.75rem 2.8rem;
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(212,175,55,0.2);
          border-radius: 12px; color: #f0eee8; font-size: 0.9rem;
          outline: none; transition: all 0.2s;
          font-family: Georgia, serif;
          box-sizing: border-box;
        }
        .register-input::placeholder { color: #4a4760; }
        .register-input:focus {
          border-color: rgba(124,58,237,0.6);
          background: rgba(124,58,237,0.05);
          box-shadow: 0 0 0 3px rgba(124,58,237,0.1);
        }
      `}</style>

      <div className="register-card" style={{
        width: '100%', maxWidth: '440px',
        background: 'rgba(18,17,26,0.9)',
        border: '1px solid rgba(124,58,237,0.15)',
        borderRadius: '24px',
        padding: '2.5rem',
        backdropFilter: 'blur(20px)',
        position: 'relative', zIndex: 1,
        boxShadow: '0 25px 80px rgba(0,0,0,0.5)',
      }}>

        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div style={{
            width: '56px', height: '56px', borderRadius: '16px',
            background: 'linear-gradient(135deg, #d4af37, #7c3aed)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            margin: '0 auto 1rem',
            boxShadow: '0 8px 25px rgba(124,58,237,0.25)',
          }}>
            <Cloud size={26} color="#fff" />
          </div>
          <h1 style={{ fontSize: '1.6rem', fontWeight: 'bold', color: '#f0eee8', marginBottom: '0.3rem' }}>
            Create account
          </h1>
          <p style={{ fontSize: '0.85rem', color: '#4a4760' }}>Start using Cloud Drive for free</p>
        </div>

        {/* Error */}
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
          {/* Name */}
          <div style={{ marginBottom: '1.2rem' }}>
            <label style={{ display: 'block', fontSize: '0.8rem', color: '#8a8090', marginBottom: '0.5rem', letterSpacing: '0.05em' }}>
              FULL NAME
            </label>
            <div style={{ position: 'relative' }}>
              <User size={15} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: '#4a4760' }} />
              <input
                type="text"
                value={form.name}
                onChange={e => setForm({ ...form, name: e.target.value })}
                className="register-input"
                placeholder="John Doe"
                required
              />
            </div>
          </div>

          {/* Email */}
          <div style={{ marginBottom: '1.2rem' }}>
            <label style={{ display: 'block', fontSize: '0.8rem', color: '#8a8090', marginBottom: '0.5rem', letterSpacing: '0.05em' }}>
              EMAIL ADDRESS
            </label>
            <div style={{ position: 'relative' }}>
              <Mail size={15} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: '#4a4760' }} />
              <input
                type="email"
                value={form.email}
                onChange={e => setForm({ ...form, email: e.target.value })}
                className="register-input"
                placeholder="you@example.com"
                required
              />
            </div>
          </div>

          {/* Password */}
          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{ display: 'block', fontSize: '0.8rem', color: '#8a8090', marginBottom: '0.5rem', letterSpacing: '0.05em' }}>
              PASSWORD
            </label>
            <div style={{ position: 'relative' }}>
              <Lock size={15} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: '#4a4760' }} />
              <input
                type={showPass ? 'text' : 'password'}
                value={form.password}
                onChange={e => setForm({ ...form, password: e.target.value })}
                className="register-input"
                placeholder="Min 8 characters"
                style={{ paddingRight: '3rem' }}
                required
              />
              <button type="button" onClick={() => setShowPass(!showPass)} style={{
                position: 'absolute', right: '1rem', top: '50%', transform: 'translateY(-50%)',
                background: 'none', border: 'none', cursor: 'pointer', color: '#4a4760', padding: 0,
              }}>
                {showPass ? <EyeOff size={15} /> : <Eye size={15} />}
              </button>
            </div>

            {/* Password strength indicator */}
            <div style={{ display: 'flex', gap: '4px', marginTop: '8px' }}>
              {[1, 2, 3, 4].map((i) => (
                <div key={i} style={{
                  flex: 1, height: '3px', borderRadius: '2px',
                  background: form.password.length >= i * 2
                    ? i <= 1 ? '#ef4444'
                      : i <= 2 ? '#f59e0b'
                        : i <= 3 ? '#8b5cf6'
                          : '#d4af37'
                    : 'rgba(255,255,255,0.08)',
                  transition: 'background 0.3s',
                }} />
              ))}
            </div>
            <p style={{ fontSize: '0.7rem', color: '#4a4760', marginTop: '4px' }}>
              {form.password.length === 0 ? 'Enter a strong password'
                : form.password.length < 4 ? 'Too weak'
                  : form.password.length < 6 ? 'Could be stronger'
                    : form.password.length < 8 ? 'Almost there!'
                      : '✓ Strong password'}
            </p>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            style={{
              width: '100%', padding: '0.85rem',
              background: loading ? 'rgba(124,58,237,0.4)' : 'linear-gradient(135deg, #d4af37, #7c3aed)',
              border: 'none', borderRadius: '12px',
              color: '#fff', fontWeight: 'bold', fontSize: '0.95rem',
              cursor: loading ? 'not-allowed' : 'pointer',
              transition: 'all 0.3s', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
              fontFamily: 'Georgia, serif',
            }}
            onMouseEnter={e => {
              if (!loading) {
                (e.currentTarget as HTMLButtonElement).style.transform = 'translateY(-2px)';
                (e.currentTarget as HTMLButtonElement).style.boxShadow = '0 8px 25px rgba(124,58,237,0.3)';
              }
            }}
            onMouseLeave={e => {
              (e.currentTarget as HTMLButtonElement).style.transform = 'translateY(0)';
              (e.currentTarget as HTMLButtonElement).style.boxShadow = 'none';
            }}>
            {loading ? 'Creating account...' : (<>Create Account <ArrowRight size={16} /></>)}
          </button>
        </form>

        {/* Divider */}
        <div style={{
          display: 'flex', alignItems: 'center', gap: '1rem',
          margin: '1.5rem 0',
        }}>
          <div style={{ flex: 1, height: '1px', background: 'rgba(124,58,237,0.1)' }} />
          <span style={{ fontSize: '0.75rem', color: '#4a4760' }}>or</span>
          <div style={{ flex: 1, height: '1px', background: 'rgba(124,58,237,0.1)' }} />
        </div>

        {/* Login link */}
        <p style={{ textAlign: 'center', fontSize: '0.85rem', color: '#4a4760' }}>
          Already have an account?{' '}
          <Link href="/login" style={{
            color: '#d4af37', textDecoration: 'none', fontWeight: 'bold', transition: 'opacity 0.2s',
          }}
            onMouseEnter={e => (e.currentTarget as HTMLAnchorElement).style.opacity = '0.7'}
            onMouseLeave={e => (e.currentTarget as HTMLAnchorElement).style.opacity = '1'}>
            Sign in
          </Link>
        </p>

      </div>
    </div>
  );
}

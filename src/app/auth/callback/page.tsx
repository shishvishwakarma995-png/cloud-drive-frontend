'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@supabase/supabase-js';
import api from '@/lib/api';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function AuthCallbackPage() {
  const router = useRouter();

  useEffect(() => {
    const handleCallback = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();

        if (error || !session) {
          router.push('/login');
          return;
        }

        // Create/login the user in the backend
        const res = await api.post('/api/auth/oauth-login', {
          accessToken: session.access_token,
          email: session.user.email,
          name: session.user.user_metadata?.full_name || session.user.email?.split('@')[0],
        });

        if (res.data.accessToken) {
          localStorage.setItem('accessToken', res.data.accessToken);
          window.location.href = '/dashboard';
        }
      } catch (err) {
        router.push('/login');
      }
    };

    handleCallback();
  }, []);

  return (
    <div style={{
      minHeight: '100vh', background: '#0a0a0f',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontFamily: 'Georgia, serif',
    }}>
      <div style={{ textAlign: 'center', color: '#f0eee8' }}>
        <div style={{
          width: '48px', height: '48px', borderRadius: '50%',
          border: '3px solid rgba(212,175,55,0.3)',
          borderTopColor: '#d4af37',
          animation: 'spin 1s linear infinite',
          margin: '0 auto 1rem',
        }} />
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        <p style={{ color: '#8a8090' }}>Signing you in...</p>
      </div>
    </div>
  );
}
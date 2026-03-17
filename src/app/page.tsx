'use client';
import Link from 'next/link';
import { useEffect, useState, useRef } from 'react';
import { Cloud, Upload, Share2, Search, Shield, Zap, FolderOpen, Star, ArrowRight, Check } from 'lucide-react';

export default function LandingPage() {
  const [scrolled, setScrolled] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const heroRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePos({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <div style={{
      minHeight: '100vh',
      background: '#0a0a0a',
      color: '#f5f0e8',
      fontFamily: "'Georgia', serif",
      overflowX: 'hidden',
      cursor: 'default',
    }}>

      {/* Cursor glow effect */}
      <div style={{
        position: 'fixed',
        left: mousePos.x - 200,
        top: mousePos.y - 200,
        width: '400px',
        height: '400px',
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(212,175,55,0.06) 0%, transparent 70%)',
        pointerEvents: 'none',
        zIndex: 999,
        transition: 'left 0.1s ease, top 0.1s ease',
      }} />

      {/* Navbar */}
      <nav style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
        padding: '1rem 2rem',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        background: scrolled ? 'rgba(10,10,10,0.95)' : 'transparent',
        borderBottom: scrolled ? '1px solid rgba(212,175,55,0.2)' : 'none',
        transition: 'all 0.3s ease',
        backdropFilter: scrolled ? 'blur(10px)' : 'none',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{
            width: '36px', height: '36px', borderRadius: '10px',
            background: 'linear-gradient(135deg, #d4af37, #f5c842)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            transition: 'transform 0.2s, box-shadow 0.2s',
          }}
            onMouseEnter={e => {
              (e.currentTarget as HTMLDivElement).style.transform = 'scale(1.1) rotate(5deg)';
              (e.currentTarget as HTMLDivElement).style.boxShadow = '0 0 20px rgba(212,175,55,0.4)';
            }}
            onMouseLeave={e => {
              (e.currentTarget as HTMLDivElement).style.transform = 'scale(1) rotate(0deg)';
              (e.currentTarget as HTMLDivElement).style.boxShadow = 'none';
            }}>
            <Cloud size={18} color="#0a0a0a" />
          </div>
          <span style={{ fontSize: '1.2rem', fontWeight: 'bold', letterSpacing: '0.05em', color: '#f5f0e8' }}>
            Cloud Drive
          </span>
        </div>
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
          <Link href="/login" style={{
            color: '#c8a96e', textDecoration: 'none', fontSize: '0.9rem',
            padding: '0.5rem 1.2rem', borderRadius: '8px',
            border: '1px solid rgba(212,175,55,0.3)',
            transition: 'all 0.2s',
          }}
            onMouseEnter={e => {
              (e.currentTarget as HTMLAnchorElement).style.background = 'rgba(212,175,55,0.1)';
              (e.currentTarget as HTMLAnchorElement).style.borderColor = 'rgba(212,175,55,0.6)';
              (e.currentTarget as HTMLAnchorElement).style.boxShadow = '0 0 15px rgba(212,175,55,0.15)';
            }}
            onMouseLeave={e => {
              (e.currentTarget as HTMLAnchorElement).style.background = 'transparent';
              (e.currentTarget as HTMLAnchorElement).style.borderColor = 'rgba(212,175,55,0.3)';
              (e.currentTarget as HTMLAnchorElement).style.boxShadow = 'none';
            }}>Sign In</Link>
          <Link href="/register" style={{
            background: 'linear-gradient(135deg, #d4af37, #f5c842)',
            color: '#0a0a0a', textDecoration: 'none', fontSize: '0.9rem',
            padding: '0.5rem 1.4rem', borderRadius: '8px', fontWeight: 'bold',
            transition: 'all 0.2s',
          }}
            onMouseEnter={e => {
              (e.currentTarget as HTMLAnchorElement).style.transform = 'translateY(-2px)';
              (e.currentTarget as HTMLAnchorElement).style.boxShadow = '0 8px 25px rgba(212,175,55,0.35)';
            }}
            onMouseLeave={e => {
              (e.currentTarget as HTMLAnchorElement).style.transform = 'translateY(0)';
              (e.currentTarget as HTMLAnchorElement).style.boxShadow = 'none';
            }}>Get Started</Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section ref={heroRef} style={{
        minHeight: '100vh',
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
        textAlign: 'center', padding: '6rem 2rem 4rem',
        position: 'relative',
        background: 'radial-gradient(ellipse at top, rgba(212,175,55,0.08) 0%, transparent 60%)',
      }}>
        <div style={{
          position: 'absolute', top: '15%', left: '10%',
          width: '300px', height: '300px', borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(212,175,55,0.05) 0%, transparent 70%)',
          pointerEvents: 'none',
          animation: 'pulse 4s ease-in-out infinite',
        }} />
        <div style={{
          position: 'absolute', bottom: '20%', right: '8%',
          width: '200px', height: '200px', borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(212,175,55,0.04) 0%, transparent 70%)',
          pointerEvents: 'none',
          animation: 'pulse 5s ease-in-out infinite reverse',
        }} />

        <style>{`
          @keyframes pulse {
            0%, 100% { transform: scale(1); opacity: 0.5; }
            50% { transform: scale(1.2); opacity: 1; }
          }
          @keyframes fadeInUp {
            from { opacity: 0; transform: translateY(30px); }
            to { opacity: 1; transform: translateY(0); }
          }
          @keyframes shimmer {
            0% { background-position: -200% center; }
            100% { background-position: 200% center; }
          }
          .hero-badge { animation: fadeInUp 0.6s ease forwards; }
          .hero-title { animation: fadeInUp 0.7s ease 0.1s both; }
          .hero-desc { animation: fadeInUp 0.7s ease 0.2s both; }
          .hero-btns { animation: fadeInUp 0.7s ease 0.3s both; }
          .hero-stats { animation: fadeInUp 0.7s ease 0.4s both; }
        `}</style>

        {/* Badge */}
        <div className="hero-badge" style={{
          display: 'inline-flex', alignItems: 'center', gap: '8px',
          background: 'rgba(212,175,55,0.1)', border: '1px solid rgba(212,175,55,0.3)',
          borderRadius: '100px', padding: '0.4rem 1rem', marginBottom: '2rem',
          fontSize: '0.8rem', color: '#d4af37', letterSpacing: '0.1em',
        }}>
          <Star size={12} fill="#d4af37" color="#d4af37" />
          YOUR FILES, YOUR CONTROL
        </div>

        <h1 className="hero-title" style={{
          fontSize: 'clamp(2.5rem, 6vw, 5rem)',
          fontWeight: 'bold', lineHeight: 1.1, marginBottom: '1.5rem', maxWidth: '800px',
          background: 'linear-gradient(270deg, #f5f0e8, #d4af37, #f5c842, #f5f0e8)',
          backgroundSize: '200% auto',
          WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
          animation: 'shimmer 4s linear infinite',
        }}>
          Store, Share & Access Your Files Anywhere
        </h1>

        <p className="hero-desc" style={{
          fontSize: 'clamp(1rem, 2vw, 1.25rem)', color: '#9a8c7a',
          maxWidth: '550px', lineHeight: 1.7, marginBottom: '3rem',
        }}>
          A premium cloud storage experience. Upload, organize, and share your files securely with anyone, from anywhere.
        </p>

        <div className="hero-btns" style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', justifyContent: 'center' }}>
          <Link href="/register" style={{
            display: 'flex', alignItems: 'center', gap: '8px',
            background: 'linear-gradient(135deg, #d4af37, #f5c842)',
            color: '#0a0a0a', textDecoration: 'none',
            padding: '0.9rem 2rem', borderRadius: '12px', fontWeight: 'bold', fontSize: '1rem',
            transition: 'all 0.3s',
          }}
            onMouseEnter={e => {
              (e.currentTarget as HTMLAnchorElement).style.transform = 'translateY(-3px)';
              (e.currentTarget as HTMLAnchorElement).style.boxShadow = '0 12px 30px rgba(212,175,55,0.4)';
            }}
            onMouseLeave={e => {
              (e.currentTarget as HTMLAnchorElement).style.transform = 'translateY(0)';
              (e.currentTarget as HTMLAnchorElement).style.boxShadow = 'none';
            }}>
            Start Free Today <ArrowRight size={18} />
          </Link>
          <Link href="/login" style={{
            display: 'flex', alignItems: 'center', gap: '8px',
            color: '#c8a96e', textDecoration: 'none',
            padding: '0.9rem 2rem', borderRadius: '12px',
            border: '1px solid rgba(212,175,55,0.3)', fontSize: '1rem',
            transition: 'all 0.3s',
          }}
            onMouseEnter={e => {
              (e.currentTarget as HTMLAnchorElement).style.background = 'rgba(212,175,55,0.08)';
              (e.currentTarget as HTMLAnchorElement).style.borderColor = 'rgba(212,175,55,0.5)';
              (e.currentTarget as HTMLAnchorElement).style.boxShadow = '0 0 20px rgba(212,175,55,0.1)';
            }}
            onMouseLeave={e => {
              (e.currentTarget as HTMLAnchorElement).style.background = 'transparent';
              (e.currentTarget as HTMLAnchorElement).style.borderColor = 'rgba(212,175,55,0.3)';
              (e.currentTarget as HTMLAnchorElement).style.boxShadow = 'none';
            }}>
            Sign In
          </Link>
        </div>

        {/* Stats */}
        <div className="hero-stats" style={{
          display: 'flex', gap: '3rem', marginTop: '4rem',
          flexWrap: 'wrap', justifyContent: 'center',
        }}>
          {[
            { value: '15 GB', label: 'Free Storage' },
            { value: '256-bit', label: 'Encryption' },
            { value: '99.9%', label: 'Uptime' },
          ].map((stat) => (
            <div key={stat.label} style={{ textAlign: 'center', transition: 'transform 0.2s' }}
              onMouseEnter={e => (e.currentTarget as HTMLDivElement).style.transform = 'translateY(-4px)'}
              onMouseLeave={e => (e.currentTarget as HTMLDivElement).style.transform = 'translateY(0)'}>
              <div style={{ fontSize: '1.8rem', fontWeight: 'bold', color: '#d4af37' }}>{stat.value}</div>
              <div style={{ fontSize: '0.8rem', color: '#6b5f50', letterSpacing: '0.1em', marginTop: '4px' }}>{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Features Section */}
      <section style={{ padding: '6rem 2rem', maxWidth: '1100px', margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
          <h2 style={{
            fontSize: 'clamp(1.8rem, 4vw, 3rem)', fontWeight: 'bold', marginBottom: '1rem',
            background: 'linear-gradient(135deg, #f5f0e8, #d4af37)',
            WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
          }}>Everything You Need</h2>
          <p style={{ color: '#6b5f50', fontSize: '1rem', maxWidth: '500px', margin: '0 auto' }}>
            Powerful features wrapped in a beautiful, intuitive interface
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
          {[
            { icon: Upload, title: 'Easy Upload', desc: 'Drag & drop files or click to browse. Upload multiple files at once with progress tracking.' },
            { icon: Share2, title: 'Smart Sharing', desc: 'Share files and folders with teammates. Set viewer or editor permissions with ease.' },
            { icon: Search, title: 'Instant Search', desc: 'Find any file in seconds. Search by name, type, or date across your entire drive.' },
            { icon: Shield, title: 'Secure Storage', desc: 'Your files are encrypted and protected. Only you and your chosen people can access them.' },
            { icon: FolderOpen, title: 'Smart Organization', desc: 'Create folders, move files with drag & drop, and navigate with breadcrumbs.' },
            { icon: Zap, title: 'Lightning Fast', desc: 'Optimized for speed. Files load instantly with our CDN-powered delivery network.' },
          ].map((feature) => (
            <div key={feature.title} style={{
              background: 'rgba(255,255,255,0.02)',
              border: '1px solid rgba(212,175,55,0.1)',
              borderRadius: '16px', padding: '2rem',
              transition: 'all 0.3s', cursor: 'default',
              position: 'relative', overflow: 'hidden',
            }}
              onMouseEnter={e => {
                const el = e.currentTarget as HTMLDivElement;
                el.style.border = '1px solid rgba(212,175,55,0.4)';
                el.style.background = 'rgba(212,175,55,0.05)';
                el.style.transform = 'translateY(-5px)';
                el.style.boxShadow = '0 15px 40px rgba(212,175,55,0.1)';
              }}
              onMouseLeave={e => {
                const el = e.currentTarget as HTMLDivElement;
                el.style.border = '1px solid rgba(212,175,55,0.1)';
                el.style.background = 'rgba(255,255,255,0.02)';
                el.style.transform = 'translateY(0)';
                el.style.boxShadow = 'none';
              }}>
              <div style={{
                width: '48px', height: '48px', borderRadius: '12px',
                background: 'rgba(212,175,55,0.1)',
                display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.2rem',
                transition: 'all 0.3s',
              }}>
                <feature.icon size={22} color="#d4af37" />
              </div>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 'bold', marginBottom: '0.6rem', color: '#f5f0e8' }}>
                {feature.title}
              </h3>
              <p style={{ fontSize: '0.9rem', color: '#6b5f50', lineHeight: 1.6 }}>{feature.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* How it Works */}
      <section style={{
        padding: '6rem 2rem',
        background: 'rgba(212,175,55,0.03)',
        borderTop: '1px solid rgba(212,175,55,0.08)',
        borderBottom: '1px solid rgba(212,175,55,0.08)',
      }}>
        <div style={{ maxWidth: '900px', margin: '0 auto', textAlign: 'center' }}>
          <h2 style={{
            fontSize: 'clamp(1.8rem, 4vw, 3rem)', fontWeight: 'bold', marginBottom: '1rem',
            background: 'linear-gradient(135deg, #f5f0e8, #d4af37)',
            WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
          }}>Get Started in 3 Steps</h2>
          <p style={{ color: '#6b5f50', marginBottom: '4rem' }}>Simple, fast, and secure</p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '2rem' }}>
            {[
              { step: '01', title: 'Create Account', desc: 'Sign up free in seconds. No credit card required.' },
              { step: '02', title: 'Upload Files', desc: 'Drag & drop or browse to upload your files and folders.' },
              { step: '03', title: 'Share & Access', desc: 'Share with anyone and access from any device, anywhere.' },
            ].map((item) => (
              <div key={item.step} style={{
                textAlign: 'center', padding: '2rem',
                borderRadius: '16px', transition: 'all 0.3s',
                border: '1px solid transparent',
              }}
                onMouseEnter={e => {
                  const el = e.currentTarget as HTMLDivElement;
                  el.style.background = 'rgba(212,175,55,0.04)';
                  el.style.border = '1px solid rgba(212,175,55,0.15)';
                  el.style.transform = 'translateY(-5px)';
                }}
                onMouseLeave={e => {
                  const el = e.currentTarget as HTMLDivElement;
                  el.style.background = 'transparent';
                  el.style.border = '1px solid transparent';
                  el.style.transform = 'translateY(0)';
                }}>
                <div style={{
                  fontSize: '3rem', fontWeight: 'bold',
                  color: 'rgba(212,175,55,0.25)', marginBottom: '1rem',
                  letterSpacing: '-0.02em',
                }}>{item.step}</div>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 'bold', marginBottom: '0.6rem', color: '#d4af37' }}>
                  {item.title}
                </h3>
                <p style={{ fontSize: '0.9rem', color: '#6b5f50', lineHeight: 1.6 }}>{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section style={{ padding: '6rem 2rem', maxWidth: '700px', margin: '0 auto', textAlign: 'center' }}>
        <h2 style={{
          fontSize: 'clamp(1.8rem, 4vw, 3rem)', fontWeight: 'bold', marginBottom: '1rem',
          background: 'linear-gradient(135deg, #f5f0e8, #d4af37)',
          WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
        }}>Free Forever</h2>
        <p style={{ color: '#6b5f50', marginBottom: '3rem' }}>Everything you need, no hidden charges</p>

        <div style={{
          background: 'rgba(212,175,55,0.04)',
          border: '1px solid rgba(212,175,55,0.2)',
          borderRadius: '20px', padding: '3rem',
          transition: 'all 0.3s',
        }}
          onMouseEnter={e => {
            (e.currentTarget as HTMLDivElement).style.boxShadow = '0 20px 60px rgba(212,175,55,0.1)';
            (e.currentTarget as HTMLDivElement).style.border = '1px solid rgba(212,175,55,0.35)';
          }}
          onMouseLeave={e => {
            (e.currentTarget as HTMLDivElement).style.boxShadow = 'none';
            (e.currentTarget as HTMLDivElement).style.border = '1px solid rgba(212,175,55,0.2)';
          }}>
          <div style={{ fontSize: '3rem', fontWeight: 'bold', color: '#d4af37', marginBottom: '0.5rem' }}>Free</div>
          <div style={{ color: '#6b5f50', marginBottom: '2rem' }}>No credit card needed</div>

          <div style={{ textAlign: 'left', marginBottom: '2.5rem' }}>
            {[
              '15 GB free storage',
              'Unlimited file uploads',
              'File sharing with permissions',
              'Search across all files',
              'Trash & restore deleted files',
              'Starred favorites',
              'Dark & light themes',
            ].map((feature) => (
              <div key={feature} style={{
                display: 'flex', alignItems: 'center', gap: '12px',
                padding: '0.7rem 0',
                borderBottom: '1px solid rgba(212,175,55,0.06)',
                transition: 'all 0.2s',
              }}
                onMouseEnter={e => (e.currentTarget as HTMLDivElement).style.paddingLeft = '8px'}
                onMouseLeave={e => (e.currentTarget as HTMLDivElement).style.paddingLeft = '0'}>
                <div style={{
                  width: '20px', height: '20px', borderRadius: '50%',
                  background: 'rgba(212,175,55,0.15)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                }}>
                  <Check size={11} color="#d4af37" />
                </div>
                <span style={{ fontSize: '0.95rem', color: '#c8b89a' }}>{feature}</span>
              </div>
            ))}
          </div>

          <Link href="/register" style={{
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
            background: 'linear-gradient(135deg, #d4af37, #f5c842)',
            color: '#0a0a0a', textDecoration: 'none',
            padding: '1rem 2rem', borderRadius: '12px', fontWeight: 'bold', fontSize: '1rem',
            transition: 'all 0.3s',
          }}
            onMouseEnter={e => {
              (e.currentTarget as HTMLAnchorElement).style.transform = 'translateY(-3px)';
              (e.currentTarget as HTMLAnchorElement).style.boxShadow = '0 12px 30px rgba(212,175,55,0.4)';
            }}
            onMouseLeave={e => {
              (e.currentTarget as HTMLAnchorElement).style.transform = 'translateY(0)';
              (e.currentTarget as HTMLAnchorElement).style.boxShadow = 'none';
            }}>
            Get Started Free <ArrowRight size={18} />
          </Link>
        </div>
      </section>

      {/* CTA */}
      <section style={{
        padding: '6rem 2rem', textAlign: 'center',
        background: 'radial-gradient(ellipse at center, rgba(212,175,55,0.06) 0%, transparent 70%)',
        borderTop: '1px solid rgba(212,175,55,0.08)',
      }}>
        <h2 style={{
          fontSize: 'clamp(1.8rem, 4vw, 3rem)', fontWeight: 'bold', marginBottom: '1rem',
          background: 'linear-gradient(135deg, #f5f0e8, #d4af37)',
          WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
        }}>Ready to Get Started?</h2>
        <p style={{ color: '#6b5f50', marginBottom: '2.5rem', fontSize: '1rem' }}>
          Join thousands of users who trust Cloud Drive for their storage needs
        </p>
        <Link href="/register" style={{
          display: 'inline-flex', alignItems: 'center', gap: '8px',
          background: 'linear-gradient(135deg, #d4af37, #f5c842)',
          color: '#0a0a0a', textDecoration: 'none',
          padding: '1rem 2.5rem', borderRadius: '12px', fontWeight: 'bold', fontSize: '1.1rem',
          transition: 'all 0.3s',
        }}
          onMouseEnter={e => {
            (e.currentTarget as HTMLAnchorElement).style.transform = 'translateY(-3px) scale(1.02)';
            (e.currentTarget as HTMLAnchorElement).style.boxShadow = '0 15px 40px rgba(212,175,55,0.4)';
          }}
          onMouseLeave={e => {
            (e.currentTarget as HTMLAnchorElement).style.transform = 'translateY(0) scale(1)';
            (e.currentTarget as HTMLAnchorElement).style.boxShadow = 'none';
          }}>
          Create Free Account <ArrowRight size={20} />
        </Link>
      </section>

      {/* Footer */}
      <footer style={{
        padding: '2rem',
        borderTop: '1px solid rgba(212,175,55,0.1)',
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        flexWrap: 'wrap', gap: '1rem',
        maxWidth: '1100px', margin: '0 auto',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div style={{
            width: '28px', height: '28px', borderRadius: '8px',
            background: 'linear-gradient(135deg, #d4af37, #f5c842)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <Cloud size={14} color="#0a0a0a" />
          </div>
          <span style={{ color: '#6b5f50', fontSize: '0.9rem' }}>Cloud Drive</span>
        </div>
        <div style={{ color: '#3d342a', fontSize: '0.85rem' }}>© 2026 Cloud Drive. All rights reserved.</div>
        <div style={{ display: 'flex', gap: '1.5rem' }}>
          <Link href="/login" style={{ color: '#6b5f50', textDecoration: 'none', fontSize: '0.85rem', transition: 'color 0.2s' }}
            onMouseEnter={e => (e.currentTarget as HTMLAnchorElement).style.color = '#d4af37'}
            onMouseLeave={e => (e.currentTarget as HTMLAnchorElement).style.color = '#6b5f50'}>Login</Link>
          <Link href="/register" style={{ color: '#6b5f50', textDecoration: 'none', fontSize: '0.85rem', transition: 'color 0.2s' }}
            onMouseEnter={e => (e.currentTarget as HTMLAnchorElement).style.color = '#d4af37'}
            onMouseLeave={e => (e.currentTarget as HTMLAnchorElement).style.color = '#6b5f50'}>Register</Link>
        </div>
      </footer>

    </div>
  );
}

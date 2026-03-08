'use client';
import { createContext, useContext, useState, useEffect } from 'react';

type Mode = 'light' | 'dark';
type Accent = 'purple' | 'golden';

interface ThemeContextType {
  mode: Mode;
  accent: Accent;
  toggleMode: () => void;
  toggleAccent: () => void;
  t: {
    bg: string;
    sidebar: string;
    card: string;
    border: string;
    text: string;
    textMuted: string;
    textSub: string;
    hover: string;
    accent: string;
    accentHover: string;
    accentText: string;
    accentBg: string;
    accentBorder: string;
    input: string;
  };
}

const themes = {
  'light-purple': {
    bg: 'bg-white',
    sidebar: 'bg-white border-slate-200',
    card: 'bg-white border-slate-200 shadow-sm hover:shadow-md hover:border-violet-200',
    border: 'border-slate-200',
    text: 'text-slate-900',
    textMuted: 'text-slate-500',
    textSub: 'text-slate-400',
    hover: 'hover:bg-violet-50',
    accent: 'bg-violet-600',
    accentHover: 'hover:bg-violet-500',
    accentText: 'text-violet-600',
    accentBg: 'bg-violet-50',
    accentBorder: 'border-violet-200',
    input: 'bg-slate-50 border-slate-200 focus:border-violet-400 focus:ring-violet-100',
  },
  'light-golden': {
    bg: 'bg-amber-50',
    sidebar: 'bg-white border-amber-100',
    card: 'bg-white border-amber-100 shadow-sm hover:shadow-md hover:border-amber-300',
    border: 'border-amber-100',
    text: 'text-slate-900',
    textMuted: 'text-slate-500',
    textSub: 'text-slate-400',
    hover: 'hover:bg-amber-50',
    accent: 'bg-amber-500',
    accentHover: 'hover:bg-amber-400',
    accentText: 'text-amber-600',
    accentBg: 'bg-amber-50',
    accentBorder: 'border-amber-200',
    input: 'bg-slate-50 border-amber-100 focus:border-amber-400 focus:ring-amber-100',
  },
  'dark-purple': {
    bg: 'bg-[#0f0f13]',
    sidebar: 'bg-[#16161d] border-[#2a2a3a]',
    card: 'bg-[#16161d] border-[#2a2a3a] shadow-sm hover:shadow-violet-900/20 hover:border-violet-700',
    border: 'border-[#2a2a3a]',
    text: 'text-slate-100',
    textMuted: 'text-slate-400',
    textSub: 'text-slate-500',
    hover: 'hover:bg-violet-950/40',
    accent: 'bg-violet-600',
    accentHover: 'hover:bg-violet-500',
    accentText: 'text-violet-400',
    accentBg: 'bg-violet-950/40',
    accentBorder: 'border-violet-800',
    input: 'bg-[#1e1e2a] border-[#2a2a3a] focus:border-violet-500 focus:ring-violet-900/30',
  },
  'dark-golden': {
    bg: 'bg-[#0f0d09]',
    sidebar: 'bg-[#161410] border-[#2d2618]',
    card: 'bg-[#161410] border-[#2d2618] shadow-sm hover:shadow-amber-900/20 hover:border-amber-700',
    border: 'border-[#2d2618]',
    text: 'text-slate-100',
    textMuted: 'text-slate-400',
    textSub: 'text-slate-500',
    hover: 'hover:bg-amber-950/40',
    accent: 'bg-amber-500',
    accentHover: 'hover:bg-amber-400',
    accentText: 'text-amber-400',
    accentBg: 'bg-amber-950/40',
    accentBorder: 'border-amber-800',
    input: 'bg-[#1e1a10] border-[#2d2618] focus:border-amber-500 focus:ring-amber-900/30',
  },
};

const ThemeContext = createContext<ThemeContextType | null>(null);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [mode, setMode] = useState<Mode>('light');
  const [accent, setAccent] = useState<Accent>('purple');

  const key = `${mode}-${accent}` as keyof typeof themes;
  const t = themes[key];

  return (
    <ThemeContext.Provider value={{
      mode, accent,
      toggleMode: () => setMode(m => m === 'light' ? 'dark' : 'light'),
      toggleAccent: () => setAccent(a => a === 'purple' ? 'golden' : 'purple'),
      t,
    }}>
      {children}
    </ThemeContext.Provider>
  );
}

export const useTheme = () => {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useTheme must be used within ThemeProvider');
  return ctx;
};
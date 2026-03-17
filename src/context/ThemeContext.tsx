'use client';
import { createContext, useContext, useState } from 'react';

type Mode = 'light' | 'dark';

interface ThemeContextType {
  mode: Mode;
  toggleMode: () => void;
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
  dark: {
    bg: 'bg-[#0a0a0f]',
    sidebar: 'bg-[#12111a] border-[#d4af3720]',
    card: 'bg-[#12111a] border-[#d4af3720] hover:border-[#d4af3750] hover:shadow-sm',
    border: 'border-[#d4af3725]',
    text: 'text-[#f0eee8]',
    textMuted: 'text-[#8a8090]',
    textSub: 'text-[#5a5460]',
    hover: 'hover:bg-[#d4af3710]',
    accent: 'bg-gradient-to-r from-[#7c3aed] to-[#d4af37]',
    accentHover: 'hover:opacity-90',
    accentText: 'text-[#d4af37]',
    accentBg: 'bg-[#d4af3712]',
    accentBorder: 'border-[#d4af3730]',
    input: 'bg-[#1a1822] border-[#d4af3725] focus:border-[#d4af37] focus:ring-[#d4af3720]',
  },
  light: {
    bg: 'bg-[#faf9f7]',
    sidebar: 'bg-white border-[#e8e0d0]',
    card: 'bg-white border-[#e8e0d0] hover:border-[#7c3aed40] hover:shadow-sm',
    border: 'border-[#e8e0d0]',
    text: 'text-[#1a1825]',
    textMuted: 'text-[#6b6880]',
    textSub: 'text-[#9a96a8]',
    hover: 'hover:bg-[#7c3aed08]',
    accent: 'bg-gradient-to-r from-[#7c3aed] to-[#d4af37]',
    accentHover: 'hover:opacity-90',
    accentText: 'text-[#7c3aed]',
    accentBg: 'bg-[#7c3aed08]',
    accentBorder: 'border-[#7c3aed25]',
    input: 'bg-white border-[#e8e0d0] focus:border-[#7c3aed] focus:ring-[#7c3aed15]',
  },
};

const ThemeContext = createContext<ThemeContextType | null>(null);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [mode, setMode] = useState<Mode>('dark');
  const t = themes[mode];

  return (
    <ThemeContext.Provider value={{
      mode,
      toggleMode: () => setMode(m => m === 'light' ? 'dark' : 'light'),
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
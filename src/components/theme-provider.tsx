'use client';

import { createContext, useCallback, useContext, useEffect, useState } from 'react';

export const themes = [
  { id: 'forest', name: 'Forest', description: 'The original campus green.', colors: ['#20543f', '#eaf1e9', '#f6f5ef'] },
  { id: 'midnight', name: 'Midnight', description: 'A low-light palette for evening study.', colors: ['#78c6a3', '#23332d', '#111a16'] },
  { id: 'ocean', name: 'Ocean', description: 'Cool blue with a clear, bright canvas.', colors: ['#245f83', '#e7f1f6', '#f1f6f8'] },
  { id: 'lavender', name: 'Lavender', description: 'Soft violet accents and warm surfaces.', colors: ['#68528a', '#eee9f5', '#f6f3f8'] },
  { id: 'sunrise', name: 'Sunrise', description: 'Warm clay, peach, and cream.', colors: ['#a34d35', '#f5e9df', '#faf4ed'] },
] as const;

export type ThemeId = (typeof themes)[number]['id'];
type ThemeContextValue = { theme: ThemeId; setTheme: (theme: ThemeId) => void; ready: boolean };
const ThemeContext = createContext<ThemeContextValue | null>(null);
const storageKey = 'nsut-connect-theme';

function isTheme(value: string | null): value is ThemeId {
  return themes.some((theme) => theme.id === value);
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<ThemeId>('forest');
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const saved = window.localStorage.getItem(storageKey);
    const nextTheme = isTheme(saved) ? saved : 'forest';
    setThemeState(nextTheme);
    document.documentElement.dataset.theme = nextTheme;
    setReady(true);
  }, []);

  const setTheme = useCallback((nextTheme: ThemeId) => {
    setThemeState(nextTheme);
    document.documentElement.dataset.theme = nextTheme;
    window.localStorage.setItem(storageKey, nextTheme);
  }, []);

  return <ThemeContext.Provider value={{ theme, setTheme, ready }}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) throw new Error('useTheme must be used inside ThemeProvider');
  return context;
}

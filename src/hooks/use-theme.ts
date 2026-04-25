'use client';

import { useCallback, useEffect, useState } from 'react';

import { THEME_STORAGE_KEY, type ThemePreference } from '@/lib/theme';

function applyTheme(pref: ThemePreference) {
  const root = document.documentElement;
  const resolved =
    pref === 'system'
      ? window.matchMedia('(prefers-color-scheme: dark)').matches
        ? 'dark'
        : 'light'
      : pref;
  root.classList.toggle('dark', resolved === 'dark');
}

export function useTheme() {
  const [theme, setThemeState] = useState<ThemePreference>('system');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const stored = (localStorage.getItem(THEME_STORAGE_KEY) ?? 'system') as ThemePreference;
    setThemeState(stored);
    setMounted(true);
  }, []);

  // Re-apply when the system preference changes and the user is on "system".
  useEffect(() => {
    if (theme !== 'system') return;
    const mq = window.matchMedia('(prefers-color-scheme: dark)');
    const handler = () => applyTheme('system');
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, [theme]);

  const setTheme = useCallback((next: ThemePreference) => {
    setThemeState(next);
    if (next === 'system') localStorage.removeItem(THEME_STORAGE_KEY);
    else localStorage.setItem(THEME_STORAGE_KEY, next);
    applyTheme(next);
  }, []);

  return { theme, setTheme, mounted };
}

'use client';

import { AmdlreProvider, AmdlreTheme, presetThemes } from '@amdlre/design-system';

import { ConfirmProvider } from '@/components/shared/confirm-modal';
import { AuthProvider } from './auth-provider';

// const projectTheme = presetThemes.royal;
const myTheme: AmdlreTheme = {
  colors: {
    background: '0 0% 98%',            // #FAFAFA
    foreground: '222 47% 11%',          // #0F172A (slate-900)
    primary: '262 83% 58%',             // #7C3AED (violet-600)
    primaryForeground: '0 0% 100%',     // white
    secondary: '160 84% 39%',           // #10B981 (emerald-500)
    secondaryForeground: '0 0% 100%',   // white
    muted: '210 40% 96%',               // slate-100
    mutedForeground: '215 16% 47%',     // slate-500
    accent: '263 70% 96%',              // light violet tint
    accentForeground: '263 67% 35%',    // #4C1D95 (deep violet)
    destructive: '0 84% 60%',           // red-500
    destructiveForeground: '0 0% 100%', // white
    border: '214 32% 91%',              // slate-200
    input: '214 32% 91%',               // slate-200
    ring: '262 83% 58%',                // matches primary
    card: '0 0% 100%',                  // white (glass cards)
    cardForeground: '222 47% 11%',      // slate-900
    popover: '0 0% 100%',
    popoverForeground: '222 47% 11%',
  },
  darkColors: {
    // Mirrors production tokens: bg-main #0F172A, bg-card #1E293B,
    // text-main #F1F5F9, text-muted #94A3B8, border-color #334155.
    background: '222 47% 11%',          // #0F172A — slate-900
    foreground: '210 40% 96%',          // #F1F5F9 — slate-100
    primary: '263 85% 68%',             // lighter violet for dark
    primaryForeground: '222 47% 11%',   // dark bg
    secondary: '160 72% 28%',           // darker emerald
    secondaryForeground: '210 40% 96%',
    muted: '217 33% 17%',               // #1E293B — slate-800
    mutedForeground: '215 20% 65%',     // #94A3B8 — slate-400
    accent: '263 45% 32%',              // ≈ #3F2E78 — visible muted violet for hover/selected rows
    accentForeground: '210 40% 96%',
    destructive: '0 91% 71%',           // tailwind red-400 — readable on dark surfaces
    destructiveForeground: '210 40% 96%',
    border: '215 25% 27%',              // #334155 — slate-700
    input: '215 25% 27%',               // #334155
    ring: '263 85% 68%',                // matches dark primary
    card: '217 33% 17%',                // #1E293B — slate-800 (clearly stands off bg)
    cardForeground: '210 40% 96%',
    popover: '217 33% 17%',             // #1E293B
    popoverForeground: '210 40% 96%',
  },
  fonts: {
    sans: '"IBM Plex Sans Arabic", sans-serif',
    heading: '"IBM Plex Sans Arabic", sans-serif',
    mono: 'ui-monospace, monospace',
  },
};

interface ProvidersProps {
  children: React.ReactNode;
}

export function Providers({ children }: ProvidersProps) {
  return (
    <AmdlreProvider theme={myTheme}>
      <AuthProvider>
        <ConfirmProvider>{children}</ConfirmProvider>
      </AuthProvider>
    </AmdlreProvider>
  );
}

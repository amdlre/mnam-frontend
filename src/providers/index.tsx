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
    background: '222 47% 11%',          // #0F172A
    foreground: '210 40% 98%',          // #F8FAFC
    primary: '263 85% 68%',             // lighter violet for dark
    primaryForeground: '222 47% 11%',   // dark bg
    secondary: '160 72% 28%',           // darker emerald
    secondaryForeground: '210 40% 98%',
    muted: '217 33% 18%',              // slate-800
    mutedForeground: '215 20% 65%',    // slate-400
    accent: '262 40% 20%',             // muted violet
    accentForeground: '210 40% 98%',
    destructive: '0 63% 31%',
    destructiveForeground: '210 40% 98%',
    border: '217 33% 18%',             // slate-800
    input: '217 33% 18%',
    ring: '263 85% 68%',               // matches dark primary
    card: '222 47% 13%',               // slightly lighter than bg
    cardForeground: '210 40% 98%',
    popover: '222 47% 13%',
    popoverForeground: '210 40% 98%',
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

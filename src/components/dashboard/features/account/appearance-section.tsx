'use client';

import { useTranslations } from 'next-intl';
import { Monitor, Moon, Palette, Sun } from 'lucide-react';
import { Card, CardContent } from '@amdlre/design-system';

import { useTheme } from '@/hooks/use-theme';

import type { ThemePreference } from '@/lib/theme';

interface Option {
  value: ThemePreference;
  label: string;
  icon: React.ReactNode;
}

export function AppearanceSection() {
  const t = useTranslations('dashboard.account.settings');
  const { theme, setTheme, mounted } = useTheme();

  const options: Option[] = [
    { value: 'light', label: t('themeLight'), icon: <Sun className="h-5 w-5" /> },
    { value: 'dark', label: t('themeDark'), icon: <Moon className="h-5 w-5" /> },
    { value: 'system', label: t('themeSystem'), icon: <Monitor className="h-5 w-5" /> },
  ];

  return (
    <Card className="border-neutral-dashboard-border">
      <CardContent className="p-6">
        <header className="border-neutral-dashboard-border mb-5 flex items-center gap-2 border-b pb-3">
          <Palette className="text-dashboard-primary-600 h-4 w-4" />
          <h2 className="text-neutral-dashboard-text text-sm font-bold">{t('appearanceTitle')}</h2>
        </header>

        <p className="text-neutral-dashboard-muted mb-5 text-xs">{t('appearanceHint')}</p>

        <div className="grid grid-cols-3 gap-3">
          {options.map((option) => {
            const active = mounted && theme === option.value;
            return (
              <button
                key={option.value}
                type="button"
                onClick={() => setTheme(option.value)}
                aria-pressed={active}
                className={`flex flex-col items-center justify-center rounded-lg border p-4 transition-all ${active
                    ? 'border-dashboard-primary-500 bg-dashboard-primary-50 text-dashboard-primary-700 ring-dashboard-primary-500 ring-1'
                    : 'border-neutral-dashboard-border bg-neutral-dashboard-card text-neutral-dashboard-muted hover:border-slate-400  '
                  }`}
              >
                {option.icon}
                <span className="mt-2 text-xs font-medium">{option.label}</span>
              </button>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}

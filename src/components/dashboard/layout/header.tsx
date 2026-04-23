'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { Bell, Menu } from 'lucide-react';

import { DashboardUserMenu } from './user-menu';

import type { DashboardUser } from '@/types/dashboard';

interface HeaderProps {
  user: DashboardUser;
  locale: string;
  onToggleSidebar: () => void;
}

export function DashboardHeader({ user, locale, onToggleSidebar }: HeaderProps) {
  const t = useTranslations('dashboard.header');

  return (
    <>
      <header className="bg-neutral-dashboard-card border-neutral-dashboard-border fixed top-0 end-0 start-0 z-40 h-16 border-b px-4 shadow-sm md:sticky md:top-0 md:px-6">
        <div className="flex h-full items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              type="button"
              onClick={onToggleSidebar}
              className="text-neutral-dashboard-muted hover:text-dashboard-primary-600 rounded-md p-2 transition-colors hover:bg-slate-50 lg:hidden"
              aria-label={t('openMenu')}
            >
              <Menu className="h-5 w-5" />
            </button>
            <Link href={`/${locale}/dashboard`} className="flex items-center lg:hidden">
              <Image
                src="/dashboard/mnam-logo.png"
                alt="Mnam"
                width={96}
                height={32}
                className="h-8 w-auto object-contain"
              />
            </Link>

            <div className="hidden md:block">
              <div className="text-neutral-dashboard-muted flex items-center text-sm">
                <span className="opacity-60">{t('system')}</span>
                <span className="mx-2">/</span>
                <span className="text-neutral-dashboard-text font-medium">{t('controlPanel')}</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 md:gap-4">
            <button
              type="button"
              className="hover:text-dashboard-primary-600 relative rounded-md p-2 text-slate-500 transition-colors hover:bg-slate-50"
              aria-label={t('notifications')}
            >
              <Bell className="h-5 w-5" />
            </button>

            <div className="bg-neutral-dashboard-border mx-1 h-6 w-px" />

            <DashboardUserMenu user={user} locale={locale} />
          </div>
        </div>
      </header>
      <div className="h-16 md:hidden" />
    </>
  );
}

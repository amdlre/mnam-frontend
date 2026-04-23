'use client';

import { useEffect, useRef, useState, useTransition } from 'react';
import { useLocale, useTranslations } from 'next-intl';
import { ChevronDown, LogOut, Settings, User as UserIcon } from 'lucide-react';

import { Link } from '@/i18n/navigation';
import { dashboardLogoutAction } from '@/actions/dashboard/auth';

import type { DashboardUser } from '@/types/dashboard';

interface Props {
  user: DashboardUser;
}

export function DashboardUserMenu({ user }: Props) {
  const t = useTranslations('dashboard.userMenu');
  const tRoles = useTranslations('dashboard.roles');
  const locale = useLocale();
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function onDocClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener('mousedown', onDocClick);
    return () => document.removeEventListener('mousedown', onDocClick);
  }, []);

  const roleLabel = tRoles(user.role);
  const initial = user.name?.charAt(0) || 'م';

  function handleLogout() {
    startTransition(async () => {
      await dashboardLogoutAction();
      // Full reload to clear all client state; locale-aware path
      window.location.href = `/${locale}/dashboard/login`;
    });
  }

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="border-neutral-dashboard-border hover:border-neutral-dashboard-border flex items-center gap-3 rounded-lg border border-transparent p-1.5 transition-colors hover:bg-slate-50"
      >
        <div className="hidden text-start sm:block">
          <p className="text-neutral-dashboard-text text-sm leading-tight font-bold">{user.name}</p>
          <p className="text-neutral-dashboard-muted text-[10px]">{roleLabel}</p>
        </div>
        <div className="bg-dashboard-primary-100 text-dashboard-primary-700 flex h-9 w-9 items-center justify-center rounded-md text-sm font-bold">
          {initial}
        </div>
        <ChevronDown
          className={`h-4 w-4 text-slate-400 transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
        />
      </button>

      {open ? (
        <div className="bg-neutral-dashboard-card border-neutral-dashboard-border absolute end-0 mt-2 w-64 rounded-lg border py-1 shadow-xl ring-1 ring-black/5">
          <div className="border-neutral-dashboard-border border-b bg-slate-50 px-4 py-3 sm:hidden">
            <p className="text-neutral-dashboard-text truncate font-bold">{user.name}</p>
            <p className="text-neutral-dashboard-muted truncate text-xs">{user.username}</p>
          </div>

          <div className="py-1">
            <Link
              href="/dashboard/profile"
              onClick={() => setOpen(false)}
              className="text-neutral-dashboard-text flex w-full items-center gap-3 px-4 py-2 text-sm transition-colors hover:bg-slate-50"
            >
              <UserIcon className="h-4 w-4 text-slate-500" />
              <span>{t('profile')}</span>
            </Link>
            <Link
              href="/dashboard/account"
              onClick={() => setOpen(false)}
              className="text-neutral-dashboard-text flex w-full items-center gap-3 px-4 py-2 text-sm transition-colors hover:bg-slate-50"
            >
              <Settings className="h-4 w-4 text-slate-500" />
              <span>{t('account')}</span>
            </Link>
          </div>

          <div className="border-neutral-dashboard-border mt-1 border-t py-1">
            <button
              type="button"
              onClick={handleLogout}
              disabled={isPending}
              className="flex w-full items-center gap-3 px-4 py-2 text-sm text-red-600 transition-colors hover:bg-red-50 disabled:opacity-60"
            >
              <LogOut className="h-4 w-4" />
              <span>{isPending ? t('loggingOut') : t('logout')}</span>
            </button>
          </div>
        </div>
      ) : null}
    </div>
  );
}

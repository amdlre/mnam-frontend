'use client';

import Image from 'next/image';
import { useTranslations } from 'next-intl';
import { X } from 'lucide-react';

import { Link, usePathname } from '@/i18n/navigation';
import { DASHBOARD_ROLE_PAGES } from '@/types/dashboard';
import { DASHBOARD_NAV_ITEMS } from './nav-items';

import type { DashboardUserRole } from '@/types/dashboard';

interface SidebarProps {
  role: DashboardUserRole;
  onClose?: () => void;
}

export function DashboardSidebar({ role, onClose }: SidebarProps) {
  const t = useTranslations('dashboard.nav');
  const tCommon = useTranslations('dashboard.common');
  const pathname = usePathname();

  const allowed = DASHBOARD_ROLE_PAGES[role] ?? [];
  const items = DASHBOARD_NAV_ITEMS.filter((i) => allowed.includes(i.id));

  const basePath = '/dashboard';

  return (
    <aside className="bg-neutral-dashboard-card border-neutral-dashboard-border relative z-50 flex h-full w-72 flex-col border-s shadow-sm">
      <div className="border-neutral-dashboard-border flex h-16 items-center justify-between border-b px-6">
        <Link href={basePath} className="flex items-center gap-3">
          <Image
            src="/dashboard/mnam-logo.png"
            alt="Mnam"
            width={120}
            height={32}
            className="h-8 w-auto object-contain"
            priority
          />
        </Link>
        {onClose ? (
          <button
            type="button"
            onClick={onClose}
            className="text-neutral-dashboard-muted rounded-md p-2 transition-colors hover:bg-slate-50 lg:hidden"
            aria-label={tCommon('close')}
          >
            <X className="h-5 w-5" />
          </button>
        ) : null}
      </div>

      <nav className="custom-scrollbar flex-1 space-y-1 overflow-y-auto px-3 py-6">
        <p className="text-neutral-dashboard-muted mb-2 px-3 text-[11px] font-bold tracking-wider uppercase opacity-80">
          {t('menu')}
        </p>

        {items.map((item) => {
          const href = item.path ? `${basePath}/${item.path}` : basePath;
          const isActive = item.path
            ? pathname === href || pathname.startsWith(`${href}/`)
            : pathname === href;
          const Icon = item.icon;
          return (
            <Link
              key={item.id}
              href={href}
              onClick={onClose}
              className={[
                'group flex w-full items-center gap-3 rounded-md px-3 py-2.5 transition-all duration-200',
                item.inBottomNav ? 'hidden lg:flex' : '',
                isActive
                  ? 'bg-dashboard-primary-50 text-dashboard-primary-700 ring-dashboard-primary-200 font-bold shadow-sm ring-1'
                  : 'text-neutral-dashboard-text hover:text-dashboard-primary-600 hover:bg-slate-50',
              ].join(' ')}
            >
              <Icon
                className={
                  isActive
                    ? 'text-dashboard-primary-700 h-5 w-5 transition-colors'
                    : 'group-hover:text-dashboard-primary-500 h-5 w-5 text-slate-400 transition-colors'
                }
              />
              <span className="text-sm">{t(item.labelKey)}</span>
              {isActive ? <span className="bg-dashboard-primary-600 me-auto h-1.5 w-1.5 rounded-full" /> : null}
            </Link>
          );
        })}
      </nav>

      <div className="border-neutral-dashboard-border border-t bg-slate-50/50 p-4">
        <div className="text-neutral-dashboard-muted flex items-center justify-between text-[11px] font-medium">
          <span>{tCommon('version')} 2.5.0</span>
          <span className="text-slate-400">Pro</span>
        </div>
      </div>
    </aside>
  );
}

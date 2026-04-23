'use client';

import { useTranslations } from 'next-intl';
import { Menu } from 'lucide-react';

import { Link, usePathname } from '@/i18n/navigation';
import { DASHBOARD_ROLE_PAGES } from '@/types/dashboard';
import { DASHBOARD_NAV_ITEMS } from './nav-items';

import type { DashboardUserRole } from '@/types/dashboard';

interface Props {
  role: DashboardUserRole;
  onToggleSidebar: () => void;
}

export function DashboardMobileBottomNav({ role, onToggleSidebar }: Props) {
  const t = useTranslations('dashboard.nav');
  const pathname = usePathname();
  const basePath = '/dashboard';
  const allowed = DASHBOARD_ROLE_PAGES[role] ?? [];
  const items = DASHBOARD_NAV_ITEMS.filter((i) => i.inBottomNav && allowed.includes(i.id));

  return (
    <div className="bg-neutral-dashboard-card border-neutral-dashboard-border pb-safe fixed bottom-0 end-0 start-0 z-50 border-t lg:hidden">
      <div className="flex h-16 items-center justify-around">
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
              className={`flex h-full w-full flex-col items-center justify-center space-y-1 outline-none transition-colors duration-200 ${
                isActive ? 'text-dashboard-primary-600' : 'text-neutral-400 hover:text-neutral-600'
              }`}
            >
              <div
                className={`flex h-8 items-center justify-center rounded-2xl transition-all duration-300 ${
                  isActive ? 'bg-dashboard-primary-50 px-5' : 'px-2'
                }`}
              >
                <Icon className={`h-6 w-6 ${isActive ? 'scale-110' : ''}`} />
              </div>
              <span className={`text-[10px] font-medium ${isActive ? 'font-bold' : ''}`}>{t(item.labelKey)}</span>
            </Link>
          );
        })}

        <button
          type="button"
          onClick={onToggleSidebar}
          className="flex h-full w-full flex-col items-center justify-center space-y-1 text-neutral-400 hover:text-neutral-600"
        >
          <Menu className="h-6 w-6" />
          <span className="text-[10px] font-medium">{t('menu')}</span>
        </button>
      </div>
    </div>
  );
}

'use client';

import { useMemo } from 'react';
import { useSearchParams } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { Search } from 'lucide-react';
import { CustomCombobox } from '@amdlre/design-system';

import { useRouter, usePathname } from '@/i18n/navigation';

export function UsersFilters() {
  const t = useTranslations('dashboard.users');
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  function update(key: string, value: string) {
    const params = new URLSearchParams(searchParams.toString());
    if (!value || value === 'all') params.delete(key);
    else params.set(key, value);
    const qs = params.toString();
    router.replace(qs ? `${pathname}?${qs}` : pathname);
  }

  const currentSearch = searchParams.get('q') || '';
  const currentRole = searchParams.get('role') || 'all';
  const currentStatus = searchParams.get('status') || 'all';

  const roleOptions = useMemo(
    () => [
      { value: 'all', label: t('allRoles') },
      { value: 'admin', label: t('roleAdmin') },
      { value: 'customers_agent', label: t('roleCustomersAgent') },
      { value: 'owners_agent', label: t('roleOwnersAgent') },
    ],
    [t],
  );

  const statusOptions = useMemo(
    () => [
      { value: 'all', label: t('allStatuses') },
      { value: 'active', label: t('active') },
      { value: 'inactive', label: t('inactive') },
    ],
    [t],
  );

  return (
    <div className="flex flex-wrap items-center gap-3">
      <div className="relative min-w-[200px] flex-grow">
        <Search className="text-neutral-dashboard-muted absolute top-2.5 end-3 h-4 w-4" />
        <input
          type="search"
          value={currentSearch}
          onChange={(e) => update('q', e.target.value)}
          placeholder={t('searchPlaceholder')}
          className="border-neutral-dashboard-border focus:ring-dashboard-primary-500 focus:border-dashboard-primary-500 w-full rounded-md border py-2 ps-3 pe-9 text-sm focus:ring-1"
        />
      </div>

      <CustomCombobox
        className="min-w-[140px]"
        options={roleOptions}
        value={currentRole}
        onValueChange={(v) => update('role', v || 'all')}
        placeholder={t('allRoles')}
      />

      <CustomCombobox
        className="min-w-[140px]"
        options={statusOptions}
        value={currentStatus}
        onValueChange={(v) => update('status', v || 'all')}
        placeholder={t('allStatuses')}
      />
    </div>
  );
}

export function UsersViewToggle() {
  const t = useTranslations('dashboard.users');
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  function update(value: string) {
    const params = new URLSearchParams(searchParams.toString());
    if (value === 'grid') params.delete('view');
    else params.set('view', value);
    const qs = params.toString();
    router.replace(qs ? `${pathname}?${qs}` : pathname);
  }

  const currentView = searchParams.get('view') || 'grid';

  return (
    <div className="border-neutral-dashboard-border flex rounded border bg-slate-100 p-0.5">
      <button
        type="button"
        onClick={() => update('grid')}
        className={`rounded px-2 py-1 text-xs font-medium transition-colors ${
          currentView === 'grid'
            ? 'text-dashboard-primary-600 bg-white shadow-sm'
            : 'text-neutral-500 hover:text-neutral-700'
        }`}
      >
        {t('grid')}
      </button>
      <button
        type="button"
        onClick={() => update('table')}
        className={`rounded px-2 py-1 text-xs font-medium transition-colors ${
          currentView === 'table'
            ? 'text-dashboard-primary-600 bg-white shadow-sm'
            : 'text-neutral-500 hover:text-neutral-700'
        }`}
      >
        {t('table')}
      </button>
    </div>
  );
}

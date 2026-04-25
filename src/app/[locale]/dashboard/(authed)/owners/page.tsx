import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import { Briefcase, Building2, Folder, Plus, TrendingUp } from 'lucide-react';
import { Button } from '@amdlre/design-system';

import { Link } from '@/i18n/navigation';
import { fetchOwners } from '@/lib/api/dashboard/entities';
import { HeaderInfo } from '@/components/dashboard/shared/header-info';
import { StatCard } from '@/components/dashboard/shared/stat-card';

interface Props {
  params: Promise<{ locale: string }>;
}

export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

export default async function DashboardOwnersPage({ params }: Props) {
  const { locale } = await params;
  const [t, owners] = await Promise.all([
    getTranslations('dashboard.owners'),
    fetchOwners(),
  ]);

  const totalProjects = owners.reduce((sum, o) => sum + o.projectCount, 0);
  const totalUnits = owners.reduce((sum, o) => sum + o.unitCount, 0);
  const avgUnits = owners.length === 0 ? 0 : Math.round((totalUnits / owners.length) * 10) / 10;

  return (
    <div className="space-y-6">
      <HeaderInfo
        title={t('title')}
        subtitle={t('subtitle')}
        actions={
          <Button
            href="/dashboard/owners/new"
            locale={locale}
            leftIcon={<Plus className="h-4 w-4" />}
          >
            {t('add')}
          </Button>
        }
      />

      <div className="grid grid-cols-2 gap-3 md:gap-4 lg:grid-cols-4">
        <StatCard
          label={t('stats.total')}
          value={owners.length}
          icon={<Briefcase className="text-slate-300" />}
        />
        <StatCard
          label={t('stats.projects')}
          value={totalProjects}
          icon={<Folder className="text-slate-300" />}
        />
        <StatCard
          label={t('stats.units')}
          value={totalUnits}
          icon={<Building2 className="text-slate-300" />}
        />
        <StatCard
          label={t('stats.avgUnits')}
          value={avgUnits}
          icon={<TrendingUp className="text-slate-300" />}
        />
      </div>

      {owners.length === 0 ? (
        <div className="bg-neutral-dashboard-card border-neutral-dashboard-border rounded-md border p-12 text-center shadow-sm">
          <Briefcase className="mx-auto mb-4 h-12 w-12 text-slate-300" />
          <p className="text-neutral-dashboard-muted text-sm">{t('empty')}</p>
        </div>
      ) : (
        <div className="bg-neutral-dashboard-card border-neutral-dashboard-border overflow-hidden rounded-md border shadow-sm">
          <div className="overflow-x-auto">
            <table className="min-w-full text-right text-sm">
              <thead className="text-neutral-dashboard-muted border-neutral-dashboard-border border-b bg-slate-50">
                <tr>
                  <th className="px-4 py-3 font-medium">{t('cols.name')}</th>
                  <th className="px-4 py-3 font-medium">{t('cols.phone')}</th>
                  <th className="px-4 py-3 font-medium">{t('cols.email')}</th>
                  <th className="px-4 py-3 font-medium">{t('cols.projects')}</th>
                  <th className="px-4 py-3 font-medium">{t('cols.units')}</th>
                  <th className="px-4 py-3 font-medium">{t('cols.actions')}</th>
                </tr>
              </thead>
              <tbody className="divide-neutral-dashboard-border divide-y">
                {owners.map((o) => (
                  <tr key={o.id} className="transition-colors hover:bg-slate-50">
                    <td className="text-neutral-dashboard-text px-4 py-3 font-medium">
                      {o.ownerName}
                    </td>
                    <td className="text-neutral-dashboard-muted px-4 py-3 font-mono text-xs">
                      {o.ownerMobilePhone}
                    </td>
                    <td className="text-neutral-dashboard-muted px-4 py-3">
                      {o.paypalEmail || '-'}
                    </td>
                    <td className="text-neutral-dashboard-text px-4 py-3 font-semibold">
                      {o.projectCount}
                    </td>
                    <td className="text-neutral-dashboard-text px-4 py-3 font-semibold">
                      {o.unitCount}
                    </td>
                    <td className="px-4 py-3">
                      <Link
                        href={`/dashboard/owners/${o.id}`}
                        className="text-dashboard-primary-600 text-xs font-medium hover:underline"
                      >
                        {t('cols.view')}
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import { Bed, CalendarCheck, DollarSign, Users as UsersIcon } from 'lucide-react';

import { fetchDashboardSummary } from '@/lib/api/dashboard/summary';
import { KpiCard } from '@/components/dashboard/features/home/kpi-card';

interface Props {
  params: Promise<{ locale: string }>;
}

export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

function formatNumber(value: number, locale: string) {
  return new Intl.NumberFormat(locale === 'ar' ? 'ar-SA' : 'en-US').format(value);
}

function formatCurrency(value: number, locale: string) {
  return new Intl.NumberFormat(locale === 'ar' ? 'ar-SA' : 'en-US', {
    style: 'currency',
    currency: 'SAR',
    maximumFractionDigits: 0,
  }).format(value);
}

function formatPercent(value: number, locale: string) {
  return new Intl.NumberFormat(locale === 'ar' ? 'ar-SA' : 'en-US', {
    style: 'percent',
    maximumFractionDigits: 1,
  }).format(value / 100);
}

export default async function DashboardHomePage({ params }: Props) {
  const { locale } = await params;
  const [t, summary] = await Promise.all([
    getTranslations('dashboard.home'),
    fetchDashboardSummary(),
  ]);

  const kpis = summary?.kpis;

  return (
    <div className="space-y-8">
      <header>
        <h1 className="text-neutral-dashboard-text text-2xl font-bold">{t('title')}</h1>
        <p className="text-neutral-dashboard-muted mt-1 text-sm">{t('subtitle')}</p>
      </header>

      <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <KpiCard
          label={t('kpis.revenue')}
          value={formatCurrency(kpis?.currentMonthRevenue ?? 0, locale)}
          sublabel={t('kpis.revenueSub')}
          icon={DollarSign}
          tone="success"
        />
        <KpiCard
          label={t('kpis.currentGuests')}
          value={formatNumber(kpis?.currentGuests ?? 0, locale)}
          sublabel={t('kpis.currentGuestsSub')}
          icon={UsersIcon}
          tone="info"
        />
        <KpiCard
          label={t('kpis.totalUnits')}
          value={formatNumber(kpis?.totalUnits ?? 0, locale)}
          sublabel={t('kpis.totalUnitsSub')}
          icon={Bed}
          tone="primary"
        />
        <KpiCard
          label={t('kpis.occupancy')}
          value={formatPercent(kpis?.occupancyRate ?? 0, locale)}
          sublabel={t('kpis.occupancySub')}
          icon={CalendarCheck}
          tone="warning"
        />
      </section>

      <section className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <div className="bg-neutral-dashboard-card border-neutral-dashboard-border rounded-lg border p-6 shadow-sm">
          <h2 className="text-neutral-dashboard-text text-lg font-bold">{t('todayFocus.arrivals')}</h2>
          <p className="text-neutral-dashboard-muted mt-2 text-sm">
            {summary?.todayFocus?.arrivals?.length
              ? t('todayFocus.count', { count: summary?.todayFocus?.arrivals?.length })
              : t('todayFocus.none')}
          </p>
        </div>
        <div className="bg-neutral-dashboard-card border-neutral-dashboard-border rounded-lg border p-6 shadow-sm">
          <h2 className="text-neutral-dashboard-text text-lg font-bold">{t('todayFocus.departures')}</h2>
          <p className="text-neutral-dashboard-muted mt-2 text-sm">
            {summary?.todayFocus?.departures?.length
              ? t('todayFocus.count', { count: summary?.todayFocus?.departures?.length })
              : t('todayFocus.none')}
          </p>
        </div>
        <div className="bg-neutral-dashboard-card border-neutral-dashboard-border rounded-lg border p-6 shadow-sm">
          <h2 className="text-neutral-dashboard-text text-lg font-bold">{t('todayFocus.pending')}</h2>
          <p className="text-neutral-dashboard-muted mt-2 text-sm">
            {summary?.todayFocus?.pendingCheckins?.length
              ? t('todayFocus.count', { count: summary?.todayFocus?.pendingCheckins?.length })
              : t('todayFocus.none')}
          </p>
        </div>
      </section>

      {!summary ? (
        <p className="text-neutral-dashboard-muted text-center text-sm">{t('summaryUnavailable')}</p>
      ) : null}
    </div>
  );
}

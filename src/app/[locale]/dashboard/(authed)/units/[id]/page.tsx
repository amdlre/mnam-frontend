import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getTranslations } from 'next-intl/server';
import { Building2, DollarSign, Home, Sparkles } from 'lucide-react';

import { fetchUnitById } from '@/lib/api/dashboard/units';
import { HeaderInfo } from '@/components/dashboard/shared/header-info';

interface Props {
  params: Promise<{ id: string; locale: string }>;
}

export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

const STATUS_STYLES: Record<string, string> = {
  متاحة: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  محجوزة: 'bg-blue-50 text-blue-700 border-blue-200',
  'تحتاج تنظيف': 'bg-amber-50 text-amber-700 border-amber-200',
  صيانة: 'bg-red-50 text-red-700 border-red-200',
  مخفية: 'bg-slate-50 text-slate-600 border-slate-200',
};

function formatCurrency(value: number, locale: string) {
  return new Intl.NumberFormat(locale === 'ar' ? 'ar-SA' : 'en-US', {
    style: 'currency',
    currency: 'SAR',
    maximumFractionDigits: 0,
  }).format(value);
}

export default async function DashboardUnitDetailPage({ params }: Props) {
  const { id, locale } = await params;
  const [t, unit] = await Promise.all([
    getTranslations('dashboard.unitDetail'),
    fetchUnitById(id),
  ]);
  if (!unit) notFound();

  const statusClass =
    STATUS_STYLES[unit.status] ?? 'bg-slate-50 text-slate-600 border-slate-200';

  return (
    <div className="space-y-6">
      <HeaderInfo
        size="md"
        title={unit.unitName}
        subtitle={unit.projectName}
        backHref="/dashboard/units"
        actions={
          <span className={`rounded border px-2 py-0.5 text-[10px] ${statusClass}`}>
            {unit.status}
          </span>
        }
      />

      <div className="grid grid-cols-1 gap-6 md:grid-cols-12">
        <section className="space-y-6 md:col-span-5">
          <InfoCard title={t('overview')} icon={<Home className="h-4 w-4 text-slate-500" />}>
            <InfoRow label={t('project')}>{unit.projectName}</InfoRow>
            {unit.ownerName ? <InfoRow label={t('owner')}>{unit.ownerName}</InfoRow> : null}
            <InfoRow label={t('type')}>{unit.unitType}</InfoRow>
            <InfoRow label={t('status')}>{unit.status}</InfoRow>
          </InfoCard>

          <InfoCard title={t('specs')} icon={<Building2 className="h-4 w-4 text-slate-500" />}>
            <InfoRow label={t('rooms')}>{unit.rooms}</InfoRow>
            <InfoRow label={t('floor')}>{unit.floorNumber ?? '-'}</InfoRow>
            <InfoRow label={t('area')}>{unit.unitArea ?? '-'}</InfoRow>
            <InfoRow label={t('city')}>{unit.city || '-'}</InfoRow>
            <InfoRow label={t('permitNo')}>{unit.permit_no || '-'}</InfoRow>
          </InfoCard>
        </section>

        <section className="space-y-6 md:col-span-7">
          <InfoCard title={t('pricing')} icon={<DollarSign className="h-4 w-4 text-slate-500" />}>
            <InfoRow label={t('weekdayPrice')}>
              {formatCurrency(unit.priceDaysOfWeek, locale)}
            </InfoRow>
            <InfoRow label={t('weekendPrice')}>
              {formatCurrency(unit.priceInWeekends, locale)}
            </InfoRow>
          </InfoCard>

          <InfoCard title={t('amenities')} icon={<Sparkles className="h-4 w-4 text-slate-500" />}>
            {unit.amenities.length === 0 ? (
              <p className="text-neutral-dashboard-muted py-3 text-sm">{t('noAmenities')}</p>
            ) : (
              <div className="flex flex-wrap gap-2 py-3">
                {unit.amenities.map((a) => (
                  <span
                    key={a}
                    className="border-neutral-dashboard-border text-neutral-dashboard-text rounded border bg-slate-50 px-2 py-0.5 text-xs"
                  >
                    {a}
                  </span>
                ))}
              </div>
            )}
          </InfoCard>

          <InfoCard title={t('description')}>
            <p className="text-neutral-dashboard-text py-3 text-sm leading-relaxed">
              {unit.description || (
                <span className="text-neutral-dashboard-muted">{t('noDescription')}</span>
              )}
            </p>
          </InfoCard>
        </section>
      </div>
    </div>
  );
}

function InfoCard({
  title,
  icon,
  children,
}: {
  title: string;
  icon?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div className="bg-neutral-dashboard-card border-neutral-dashboard-border rounded-xl border p-6 shadow-sm">
      <h2 className="border-neutral-dashboard-border text-neutral-dashboard-text mb-3 flex items-center gap-2 border-b pb-3 text-base font-bold">
        {icon}
        {title}
      </h2>
      <dl className="divide-neutral-dashboard-border divide-y">{children}</dl>
    </div>
  );
}

function InfoRow({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between py-3">
      <dt className="text-neutral-dashboard-muted text-sm">{label}</dt>
      <dd className="text-neutral-dashboard-text text-sm font-semibold">{children}</dd>
    </div>
  );
}

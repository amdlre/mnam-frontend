import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';

interface Props {
  params: Promise<{ locale: string }>;
}

export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

export default async function DashboardAccountPage({ params }: Props) {
  await params;
  const t = await getTranslations('dashboard.account');

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-neutral-dashboard-text text-2xl font-bold">{t('title')}</h1>
        <p className="text-neutral-dashboard-muted mt-1 text-sm">{t('subtitle')}</p>
      </header>

      <div className="bg-neutral-dashboard-card border-neutral-dashboard-border rounded-lg border p-6 shadow-sm">
        <p className="text-neutral-dashboard-muted text-sm">{t('comingSoon')}</p>
      </div>
    </div>
  );
}

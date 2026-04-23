import Image from 'next/image';
import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';

import { redirect } from '@/i18n/navigation';
import { hasDashboardSession } from '@/lib/api/dashboard/auth';
import { DashboardLoginForm } from '@/components/dashboard/login-form';

interface Props {
  params: Promise<{ locale: string }>;
}

export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

export default async function DashboardLoginPage({ params }: Props) {
  const { locale } = await params;
  if (await hasDashboardSession()) redirect({ href: '/dashboard', locale });

  const t = await getTranslations('dashboard.login');

  return (
    <div className="bg-neutral-dashboard-bg flex min-h-screen items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="mb-8 flex justify-center">
          <Image
            src="/dashboard/mnam-logo.png"
            alt="Mnam"
            width={160}
            height={64}
            className="h-16 w-auto object-contain"
            priority
          />
        </div>

        <div className="border-neutral-dashboard-border overflow-hidden rounded-lg border bg-white shadow-xl">
          <div className="p-8">
            <h1 className="text-neutral-dashboard-text mb-2 text-center text-2xl font-bold">
              {t('title')}
            </h1>
            <p className="text-neutral-dashboard-muted mb-8 text-center text-sm">
              {t('subtitle')}
            </p>

            <DashboardLoginForm />
          </div>
        </div>

        <div className="mt-8 text-center">
          <p className="text-neutral-dashboard-muted text-xs">{t('copyright')}</p>
        </div>
      </div>
    </div>
  );
}

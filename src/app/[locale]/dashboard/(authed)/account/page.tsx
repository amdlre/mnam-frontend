import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import { Card, CardContent, Typography } from '@amdlre/design-system';

import { fetchMyAccount, fetchMyTasks } from '@/lib/api/dashboard/account';
import { HeaderInfo } from '@/components/dashboard/shared/header-info';
import { AccountTabs } from '@/components/dashboard/features/account/account-tabs';

interface Props {
  params: Promise<{ locale: string }>;
}

export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

export default async function DashboardAccountPage({ params }: Props) {
  const { locale } = await params;
  const t = await getTranslations('dashboard.account');

  const profile = await fetchMyAccount();
  if (!profile) {
    return (
      <div className="space-y-6">
        <HeaderInfo title={t('title')} subtitle={t('subtitle')} />
        <Card className="border-neutral-dashboard-border">
          <CardContent className="p-6">
            <Typography as="p" variant="muted" className="text-sm">
              {t('noActivities')}
            </Typography>
          </CardContent>
        </Card>
      </div>
    );
  }

  const tasks = await fetchMyTasks(profile.id);

  return (
    <div className="space-y-6">
      <HeaderInfo title={t('title')} subtitle={t('subtitle')} />
      <AccountTabs profile={profile} tasks={tasks} locale={locale} />
    </div>
  );
}

import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import { Card, CardContent, Typography } from '@amdlre/design-system';

import { HeaderInfo } from '@/components/dashboard/shared/header-info';

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
      <HeaderInfo title={t('title')} subtitle={t('subtitle')} />

      <Card className="border-neutral-dashboard-border">
        <CardContent className="p-6">
          <Typography as="p" variant="muted" className="text-sm">
            {t('comingSoon')}
          </Typography>
        </CardContent>
      </Card>
    </div>
  );
}

import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import { Card, CardContent, Typography } from '@amdlre/design-system';

import { fetchDashboardCurrentUser } from '@/lib/api/dashboard/auth';
import { HeaderInfo } from '@/components/dashboard/shared/header-info';

interface Props {
  params: Promise<{ locale: string }>;
}

export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

export default async function DashboardProfilePage({ params }: Props) {
  await params;
  const [t, tRoles, user] = await Promise.all([
    getTranslations('dashboard.profile'),
    getTranslations('dashboard.roles'),
    fetchDashboardCurrentUser(),
  ]);

  return (
    <div className="space-y-6">
      <HeaderInfo title={t('title')} subtitle={t('subtitle')} />

      <Card className="border-neutral-dashboard-border">
        <CardContent className="p-6">
          <dl className="divide-neutral-dashboard-border divide-y">
            <ProfileRow label={t('name')} value={user?.name ?? '—'} />
            <ProfileRow label={t('username')} value={user?.username ?? '—'} />
            <ProfileRow label={t('email')} value={user?.email ?? '—'} />
            <ProfileRow label={t('role')} value={user ? tRoles(user.role) : '—'} />
          </dl>
        </CardContent>
      </Card>

      <Typography as="p" variant="muted" className="text-center text-xs">
        {t('editHint')}
      </Typography>
    </div>
  );
}

function ProfileRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between py-3">
      <dt className="text-neutral-dashboard-muted text-sm font-medium">{label}</dt>
      <dd className="text-neutral-dashboard-text text-sm font-semibold">{value}</dd>
    </div>
  );
}

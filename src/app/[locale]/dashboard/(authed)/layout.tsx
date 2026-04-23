import type { Metadata } from 'next';

import { redirect } from '@/i18n/navigation';
import { fetchDashboardCurrentUser } from '@/lib/api/dashboard/auth';
import { DashboardShell } from '@/components/dashboard/layout/shell';

interface LayoutProps {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}

export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

export default async function DashboardAuthedLayout({ children, params }: LayoutProps) {
  const { locale } = await params;
  const user = await fetchDashboardCurrentUser();
  if (!user) {
    redirect({ href: '/dashboard/login', locale });
  }

  return <DashboardShell user={user!}>{children}</DashboardShell>;
}

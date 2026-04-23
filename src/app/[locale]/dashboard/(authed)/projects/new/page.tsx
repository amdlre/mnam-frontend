import type { Metadata } from 'next';

import { fetchSimpleOwners } from '@/lib/api/dashboard/entities';
import { ProjectCreateForm } from '@/components/dashboard/features/projects/project-create-form';

export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

export default async function DashboardProjectCreatePage() {
  const owners = await fetchSimpleOwners();
  return <ProjectCreateForm owners={owners} />;
}

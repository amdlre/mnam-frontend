import type { Metadata } from 'next';

import { fetchSimpleProjects } from '@/lib/api/dashboard/entities';
import { UnitCreateForm } from '@/components/dashboard/features/units/unit-create-form';

export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

export default async function DashboardUnitCreatePage() {
  const projects = await fetchSimpleProjects();
  return <UnitCreateForm projects={projects} />;
}

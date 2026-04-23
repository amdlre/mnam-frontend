import type { Metadata } from 'next';

import { fetchSimpleProjects } from '@/lib/api/dashboard/entities';
import { fetchUnits } from '@/lib/api/dashboard/units';
import { BookingCreateForm } from '@/components/dashboard/features/bookings/booking-create-form';

export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

export default async function DashboardBookingCreatePage() {
  const [projects, units] = await Promise.all([fetchSimpleProjects(), fetchUnits()]);
  return <BookingCreateForm projects={projects} units={units} />;
}

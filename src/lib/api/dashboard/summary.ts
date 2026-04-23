import { dashboardApi } from './fetcher';
import { DASHBOARD_ENDPOINTS } from './endpoints';

import type { DashboardSummary } from '@/types/dashboard';

export async function fetchDashboardSummary(): Promise<DashboardSummary | null> {
  try {
    return await dashboardApi.get<DashboardSummary>(DASHBOARD_ENDPOINTS.dashboard.summary);
  } catch {
    return null;
  }
}

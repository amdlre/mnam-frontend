import { cookies } from 'next/headers';

import { DASHBOARD_API_CONFIG } from './config';
import { dashboardApi } from './fetcher';
import { DASHBOARD_ENDPOINTS } from './endpoints';

import type { DashboardMeResponse, DashboardUser } from '@/types/dashboard';

export async function fetchDashboardCurrentUser(): Promise<DashboardUser | null> {
  try {
    const store = await cookies();
    const session = store.get(DASHBOARD_API_CONFIG.sessionCookieName)?.value;
    if (!session) return null;

    const me = await dashboardApi.get<DashboardMeResponse>(DASHBOARD_ENDPOINTS.auth.me);
    return {
      id: me.id,
      username: me.username,
      name: me.name || [me.first_name, me.last_name].filter(Boolean).join(' ').trim() || me.username,
      email: me.email,
      role: me.role,
    };
  } catch {
    return null;
  }
}

export async function hasDashboardSession(): Promise<boolean> {
  const store = await cookies();
  return !!store.get(DASHBOARD_API_CONFIG.sessionCookieName)?.value;
}

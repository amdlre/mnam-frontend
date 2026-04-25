import { DASHBOARD_ENDPOINTS } from './endpoints';
import { dashboardApi } from './fetcher';

import type { DashboardUserRole } from '@/types/dashboard';

export interface AccountTaskActivity {
  id: string;
  title: string;
  status: 'todo' | 'done';
  activityType?: string;
  entityType?: string | null;
  entityId?: string | null;
  amount?: number | null;
  createdAt: string | null;
}

export interface AccountProfile {
  id: string;
  username: string;
  firstName: string;
  lastName: string;
  fullName: string;
  email: string;
  phone: string | null;
  role: DashboardUserRole;
  roleLabel: string;
  isActive: boolean;
  createdAt: string | null;
  // From employee profile endpoint
  todayActivities: number;
  totalActivities: number;
  pendingTasksCount: number;
  bookedTodayCount: number;
  dailyTarget: number;
  progressPercent: number;
  recentActivities: AccountTaskActivity[];
}

interface ApiUserMe {
  id: string;
  username: string;
  email: string;
  first_name: string;
  last_name: string;
  phone: string | null;
  role: DashboardUserRole;
  is_active: boolean;
  created_at: string;
}

interface ApiEmployeeProfile {
  employee?: {
    id: string;
    username: string;
    first_name: string;
    last_name: string;
    role: DashboardUserRole;
    role_label?: string;
    email: string;
    phone?: string | null;
    is_active: boolean;
  };
  daily_performance?: {
    booked_today_count?: number;
    daily_target?: number;
    progress_percent?: number;
  };
  tasks?: {
    recent?: Array<{
      id: string;
      title: string;
      status?: 'todo' | 'done';
      activity_type?: string;
      created_at?: string | null;
    }>;
    todo_count?: number;
    done_count?: number;
    today_count?: number;
    total?: number;
  };
}

interface ApiTasksList {
  tasks: Array<{
    id: string;
    title: string;
    status?: 'todo' | 'done';
    activity_type?: string;
    entity_type?: string | null;
    entity_id?: string | null;
    amount?: number | null;
    created_at?: string | null;
  }>;
  total_count: number;
  page: number;
  page_size: number;
}

const ROLE_LABELS_FALLBACK: Record<DashboardUserRole, string> = {
  system_owner: 'مالك النظام',
  admin: 'مدير نظام',
  owners_agent: 'وكيل ملاك',
  customers_agent: 'وكيل عملاء',
};

export async function fetchMyAccount(): Promise<AccountProfile | null> {
  let me: ApiUserMe;
  try {
    me = await dashboardApi.get<ApiUserMe>(DASHBOARD_ENDPOINTS.profile.me);
  } catch {
    return null;
  }

  let perf: ApiEmployeeProfile | null = null;
  try {
    perf = await dashboardApi.get<ApiEmployeeProfile>(
      DASHBOARD_ENDPOINTS.tasks.employeeProfile(me.id),
    );
  } catch {
    perf = null;
  }

  const recent = (perf?.tasks?.recent ?? []).map((a) => ({
    id: a.id,
    title: a.title,
    status: (a.status ?? 'done') as 'todo' | 'done',
    activityType: a.activity_type,
    createdAt: a.created_at ?? null,
  }));

  return {
    id: me.id,
    username: me.username,
    firstName: me.first_name,
    lastName: me.last_name,
    fullName: `${me.first_name} ${me.last_name}`.trim() || me.username,
    email: me.email,
    phone: me.phone,
    role: me.role,
    roleLabel: perf?.employee?.role_label ?? ROLE_LABELS_FALLBACK[me.role] ?? me.role,
    isActive: me.is_active,
    createdAt: me.created_at,
    todayActivities: perf?.tasks?.today_count ?? 0,
    totalActivities: perf?.tasks?.total ?? 0,
    pendingTasksCount: perf?.tasks?.todo_count ?? 0,
    bookedTodayCount: perf?.daily_performance?.booked_today_count ?? 0,
    dailyTarget: perf?.daily_performance?.daily_target ?? 0,
    progressPercent: perf?.daily_performance?.progress_percent ?? 0,
    recentActivities: recent,
  };
}

export async function fetchMyTasks(employeeId: string): Promise<AccountTaskActivity[]> {
  try {
    const data = await dashboardApi.get<ApiTasksList>(
      `${DASHBOARD_ENDPOINTS.tasks.list}?assigned_to_id=${encodeURIComponent(employeeId)}&page_size=100`,
    );
    return data.tasks.map((a) => ({
      id: a.id,
      title: a.title,
      status: (a.status ?? 'done') as 'todo' | 'done',
      activityType: a.activity_type,
      entityType: a.entity_type ?? null,
      entityId: a.entity_id ?? null,
      amount: a.amount ?? null,
      createdAt: a.created_at ?? null,
    }));
  } catch {
    return [];
  }
}

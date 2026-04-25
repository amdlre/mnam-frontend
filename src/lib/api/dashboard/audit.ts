import { DASHBOARD_ENDPOINTS } from './endpoints';
import { dashboardApi } from './fetcher';

export interface AuditLogEntry {
  id: string;
  userId: string | null;
  userName: string | null;
  activityType: string;
  activityLabel: string;
  entityType: string;
  entityLabel: string;
  entityId: string | null;
  entityName: string | null;
  description: string | null;
  ipAddress: string | null;
  createdAt: string;
}

export interface AuditLogsPage {
  logs: AuditLogEntry[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export interface AuditStats {
  totalActivities: number;
  deletedRecordsCount: number;
  byActivityType: Record<string, number>;
  topUsers: Array<{ userId: string; userName: string; count: number }>;
}

export interface AuditTypeOption {
  value: string;
  label: string;
}

export interface DeletedRecord {
  id: string;
  entityType: string;
  entityLabel: string;
  name: string;
  deletedAt: string | null;
  deletedBy: string | null;
}

interface ApiAuditEntry {
  id: string;
  user_id?: string | null;
  user_name?: string | null;
  activity_type: string;
  activity_label?: string | null;
  entity_type: string;
  entity_label?: string | null;
  entity_id?: string | null;
  entity_name?: string | null;
  description?: string | null;
  ip_address?: string | null;
  created_at: string;
}

interface ApiAuditPage {
  logs: ApiAuditEntry[];
  total: number;
  page: number;
  page_size: number;
  total_pages: number;
}

interface ApiAuditStats {
  total_activities?: number;
  deleted_records_count?: number;
  by_activity_type?: Record<string, number>;
  top_users?: Array<{ user_id: string; user_name: string; count: number }>;
}

interface ApiDeletedRecord {
  id: string;
  entity_type: string;
  entity_label: string;
  name: string;
  deleted_at?: string | null;
  deleted_by?: string | null;
}

const EMPTY_PAGE: AuditLogsPage = {
  logs: [],
  total: 0,
  page: 1,
  pageSize: 20,
  totalPages: 1,
};

const EMPTY_STATS: AuditStats = {
  totalActivities: 0,
  deletedRecordsCount: 0,
  byActivityType: {},
  topUsers: [],
};

function normalize(e: ApiAuditEntry): AuditLogEntry {
  return {
    id: e.id,
    userId: e.user_id ?? null,
    userName: e.user_name ?? null,
    activityType: e.activity_type,
    activityLabel: e.activity_label ?? e.activity_type,
    entityType: e.entity_type,
    entityLabel: e.entity_label ?? e.entity_type,
    entityId: e.entity_id ?? null,
    entityName: e.entity_name ?? null,
    description: e.description ?? null,
    ipAddress: e.ip_address ?? null,
    createdAt: e.created_at,
  };
}

export interface AuditLogsFilters {
  page?: number;
  pageSize?: number;
  search?: string;
  activityType?: string;
  entityType?: string;
}

export async function fetchAuditLogs(filters: AuditLogsFilters = {}): Promise<AuditLogsPage> {
  const qs = new URLSearchParams();
  qs.set('page', String(filters.page ?? 1));
  qs.set('page_size', String(filters.pageSize ?? 20));
  if (filters.search) qs.set('search', filters.search);
  if (filters.activityType && filters.activityType !== 'all') {
    qs.set('activity_type', filters.activityType);
  }
  if (filters.entityType && filters.entityType !== 'all') {
    qs.set('entity_type', filters.entityType);
  }
  try {
    const data = await dashboardApi.get<ApiAuditPage>(
      `${DASHBOARD_ENDPOINTS.audit.logs}?${qs.toString()}`,
    );
    return {
      logs: data.logs.map(normalize),
      total: data.total,
      page: data.page,
      pageSize: data.page_size,
      totalPages: data.total_pages,
    };
  } catch {
    return EMPTY_PAGE;
  }
}

export async function fetchAuditStats(days = 7): Promise<AuditStats> {
  try {
    const data = await dashboardApi.get<ApiAuditStats>(
      `${DASHBOARD_ENDPOINTS.audit.stats}?days=${days}`,
    );
    return {
      totalActivities: data.total_activities ?? 0,
      deletedRecordsCount: data.deleted_records_count ?? 0,
      byActivityType: data.by_activity_type ?? {},
      topUsers: (data.top_users ?? []).map((u) => ({
        userId: u.user_id,
        userName: u.user_name,
        count: u.count,
      })),
    };
  } catch {
    return EMPTY_STATS;
  }
}

export async function fetchAuditActivityTypes(): Promise<AuditTypeOption[]> {
  try {
    return await dashboardApi.get<AuditTypeOption[]>(DASHBOARD_ENDPOINTS.audit.activityTypes);
  } catch {
    return [];
  }
}

export async function fetchAuditEntityTypes(): Promise<AuditTypeOption[]> {
  try {
    return await dashboardApi.get<AuditTypeOption[]>(DASHBOARD_ENDPOINTS.audit.entityTypes);
  } catch {
    return [];
  }
}

export async function fetchDeletedRecords(): Promise<DeletedRecord[]> {
  try {
    const data = await dashboardApi.get<{ records?: ApiDeletedRecord[] }>(
      DASHBOARD_ENDPOINTS.audit.deleted,
    );
    return (data.records ?? []).map((r) => ({
      id: r.id,
      entityType: r.entity_type,
      entityLabel: r.entity_label,
      name: r.name,
      deletedAt: r.deleted_at ?? null,
      deletedBy: r.deleted_by ?? null,
    }));
  } catch {
    return [];
  }
}

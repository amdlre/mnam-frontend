'use server';

import {
  fetchAuditLogs,
  type AuditLogsFilters,
  type AuditLogsPage,
} from '@/lib/api/dashboard/audit';

export interface AuditFetchResult {
  success: boolean;
  data?: AuditLogsPage;
  message?: string;
}

export async function fetchAuditLogsAction(
  filters: AuditLogsFilters,
): Promise<AuditFetchResult> {
  try {
    const data = await fetchAuditLogs(filters);
    return { success: true, data };
  } catch (error) {
    if (error instanceof Error) {
      return { success: false, message: error.message };
    }
    return { success: false, message: 'unknownError' };
  }
}

'use client';

import { useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';
import { Card, CardContent, CustomCombobox, CustomInput } from '@amdlre/design-system';

import { fetchAuditLogsAction } from '@/actions/dashboard/audit';

import type {
  AuditLogEntry,
  AuditLogsPage,
  AuditTypeOption,
  DeletedRecord,
} from '@/lib/api/dashboard/audit';

type Tab = 'logs' | 'deleted';

interface Props {
  initialPage: AuditLogsPage;
  activityTypes: AuditTypeOption[];
  entityTypes: AuditTypeOption[];
  deletedRecords: DeletedRecord[];
}

const PAGE_SIZE = 20;

export function AuditTable({ initialPage, activityTypes, entityTypes, deletedRecords }: Props) {
  const t = useTranslations('dashboard.audit');
  const [tab, setTab] = useState<Tab>('logs');
  const [page, setPage] = useState<AuditLogsPage>(initialPage);
  const [pageNumber, setPageNumber] = useState(1);
  const [search, setSearch] = useState('');
  const [activityType, setActivityType] = useState('all');
  const [entityType, setEntityType] = useState('all');
  const [isLoading, setIsLoading] = useState(false);

  // Debounced refetch on filter changes
  useEffect(() => {
    const handle = setTimeout(async () => {
      setIsLoading(true);
      const result = await fetchAuditLogsAction({
        page: pageNumber,
        pageSize: PAGE_SIZE,
        search: search || undefined,
        activityType,
        entityType,
      });
      if (result.success && result.data) {
        setPage(result.data);
      }
      setIsLoading(false);
    }, 250);
    return () => clearTimeout(handle);
  }, [pageNumber, search, activityType, entityType]);

  // Reset to first page when filters change
  useEffect(() => {
    setPageNumber(1);
  }, [search, activityType, entityType]);

  const formatDate = (iso: string) =>
    new Intl.DateTimeFormat('ar-SA', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(new Date(iso));

  return (
    <Card className="border-neutral-dashboard-border">
      <CardContent className="p-0">
        <nav className="border-neutral-dashboard-border flex gap-2 border-b px-4 pt-2">
          <button
            type="button"
            onClick={() => setTab('logs')}
            className={
              tab === 'logs'
                ? 'border-dashboard-primary-600 text-dashboard-primary-600 -mb-px border-b-2 px-3 py-2 text-sm font-medium'
                : 'text-neutral-dashboard-muted -mb-px border-b-2 border-transparent px-3 py-2 text-sm font-medium'
            }
          >
            {t('tabs.logs')} ({page.total})
          </button>
          <button
            type="button"
            onClick={() => setTab('deleted')}
            className={
              tab === 'deleted'
                ? 'border-dashboard-primary-600 text-dashboard-primary-600 -mb-px border-b-2 px-3 py-2 text-sm font-medium'
                : 'text-neutral-dashboard-muted -mb-px border-b-2 border-transparent px-3 py-2 text-sm font-medium'
            }
          >
            {t('tabs.deleted')} ({deletedRecords.length})
          </button>
        </nav>

        {tab === 'logs' ? (
          <>
            <div className="border-neutral-dashboard-border grid grid-cols-1 gap-x-4 border-b p-4 md:grid-cols-3">
              <div className="md:col-span-1">
                <CustomInput
                  type="search"
                  placeholder={t('search')}
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
              <CustomCombobox
                options={[
                  { value: 'all', label: t('allActivities') },
                  ...activityTypes.map((a) => ({ value: a.value, label: a.label })),
                ]}
                value={activityType}
                onValueChange={(v) => setActivityType(v || 'all')}
                placeholder={t('allActivities')}
              />
              <CustomCombobox
                options={[
                  { value: 'all', label: t('allEntities') },
                  ...entityTypes.map((e) => ({ value: e.value, label: e.label })),
                ]}
                value={entityType}
                onValueChange={(v) => setEntityType(v || 'all')}
                placeholder={t('allEntities')}
              />
            </div>

            <div className="overflow-x-auto">
              <table className="min-w-full text-right text-sm">
                <thead className="border-neutral-dashboard-border text-neutral-dashboard-muted border-b bg-slate-50">
                  <tr>
                    <th className="px-4 py-3 font-medium">{t('cols.time')}</th>
                    <th className="px-4 py-3 font-medium">{t('cols.user')}</th>
                    <th className="px-4 py-3 font-medium">{t('cols.activity')}</th>
                    <th className="px-4 py-3 font-medium">{t('cols.entity')}</th>
                    <th className="px-4 py-3 font-medium">{t('cols.details')}</th>
                  </tr>
                </thead>
                <tbody className="divide-neutral-dashboard-border divide-y">
                  {isLoading ? (
                    <tr>
                      <td colSpan={5} className="text-neutral-dashboard-muted px-4 py-12 text-center">
                        ...
                      </td>
                    </tr>
                  ) : page.logs.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="text-neutral-dashboard-muted px-4 py-12 text-center">
                        {t('empty')}
                      </td>
                    </tr>
                  ) : (
                    page.logs.map((log: AuditLogEntry) => (
                      <tr key={log.id} className="hover:bg-slate-50">
                        <td className="px-4 py-3 text-xs">{formatDate(log.createdAt)}</td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2">
                            <div className="border-neutral-dashboard-border flex h-6 w-6 items-center justify-center rounded border bg-slate-100 text-xs font-bold text-slate-500">
                              {log.userName?.charAt(0) ?? '?'}
                            </div>
                            <span className="text-sm font-medium">{log.userName ?? '—'}</span>
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <span className="border-neutral-dashboard-border inline-block rounded border bg-slate-50 px-2 py-0.5 text-[10px]">
                            {log.activityLabel}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <span className="border-neutral-dashboard-border inline-block rounded border bg-slate-50 px-1.5 py-0.5 text-xs">
                            {log.entityLabel}
                          </span>
                          {log.entityName ? (
                            <div className="mt-1 max-w-[150px] truncate text-xs font-medium">
                              {log.entityName}
                            </div>
                          ) : null}
                        </td>
                        <td className="px-4 py-3">
                          <p className="text-neutral-dashboard-muted max-w-xs truncate text-xs">
                            {log.description ?? '-'}
                          </p>
                          {log.ipAddress ? (
                            <p className="mt-0.5 font-mono text-[10px] text-slate-400">
                              IP: {log.ipAddress}
                            </p>
                          ) : null}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {page.totalPages > 1 ? (
              <div className="border-neutral-dashboard-border flex items-center justify-between border-t bg-slate-50 px-4 py-3">
                <button
                  type="button"
                  onClick={() => setPageNumber((p) => Math.max(1, p - 1))}
                  disabled={page.page <= 1}
                  className="border-neutral-dashboard-border rounded border bg-white px-3 py-1 text-xs hover:bg-slate-50 disabled:opacity-50"
                >
                  «
                </button>
                <span className="text-xs">
                  {page.page} / {page.totalPages}
                </span>
                <button
                  type="button"
                  onClick={() => setPageNumber((p) => Math.min(page.totalPages, p + 1))}
                  disabled={page.page >= page.totalPages}
                  className="border-neutral-dashboard-border rounded border bg-white px-3 py-1 text-xs hover:bg-slate-50 disabled:opacity-50"
                >
                  »
                </button>
              </div>
            ) : null}
          </>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full text-right text-sm">
              <thead className="border-b border-red-100 bg-red-50 text-red-800">
                <tr>
                  <th className="px-4 py-3 font-medium">{t('cols.entity')}</th>
                  <th className="px-4 py-3 font-medium">{t('cols.name')}</th>
                  <th className="px-4 py-3 font-medium">{t('cols.deletedAt')}</th>
                  <th className="px-4 py-3 font-medium">{t('cols.deletedBy')}</th>
                </tr>
              </thead>
              <tbody className="divide-neutral-dashboard-border divide-y">
                {deletedRecords.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="text-neutral-dashboard-muted px-4 py-12 text-center">
                      {t('emptyDeleted')}
                    </td>
                  </tr>
                ) : (
                  deletedRecords.map((r) => (
                    <tr key={`${r.entityType}-${r.id}`}>
                      <td className="px-4 py-3">
                        <span className="rounded border border-red-100 bg-red-50 px-2 py-0.5 text-[10px] text-red-700">
                          {r.entityLabel}
                        </span>
                      </td>
                      <td className="px-4 py-3 font-medium">{r.name}</td>
                      <td className="px-4 py-3 text-xs">
                        {r.deletedAt ? formatDate(r.deletedAt) : '-'}
                      </td>
                      <td className="px-4 py-3 text-xs">{r.deletedBy ?? '-'}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

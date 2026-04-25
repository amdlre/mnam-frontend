'use client';

import { useState } from 'react';
import { Building2, CalendarDays, DollarSign, Loader2, Sparkles, Users } from 'lucide-react';

import { StatCard } from '@/components/dashboard/shared/stat-card';
import { downloadFinancialPDF, type FinancialPeriod } from '@/lib/financials/download-pdf';

interface PeriodData {
  income: number;
  occupancy: number;
  nights: number;
  cancellations: number;
}

interface Labels {
  tabs: Record<FinancialPeriod, string>;
  income: string;
  occupiedUnits: string;
  occupancy: string;
  nights: string;
  cancellations: string;
  currency: string;
  exportTitle: string;
  exportFormat: string;
  exportLabels: Record<FinancialPeriod, string>;
}

interface Props {
  data: Record<FinancialPeriod, PeriodData>;
  labels: Labels;
  /** Per-period title used in the PDF body. */
  pdfTitles: Record<FinancialPeriod, string>;
}

export function FinancialsTabs({ data, labels, pdfTitles }: Props) {
  const [active, setActive] = useState<FinancialPeriod>('daily');
  const [exportingPeriod, setExportingPeriod] = useState<FinancialPeriod | null>(null);

  const current = data[active];
  const occupancyLabel = active === 'daily' ? labels.occupiedUnits : labels.occupancy;

  const handleExport = async (period: FinancialPeriod) => {
    if (exportingPeriod) return;
    setExportingPeriod(period);
    try {
      const periodData = data[period];
      const periodOccupancyLabel = period === 'daily' ? labels.occupiedUnits : labels.occupancy;
      await downloadFinancialPDF(period, {
        title: pdfTitles[period],
        income: periodData.income,
        occupancy: periodData.occupancy,
        nights: periodData.nights,
        cancellations: periodData.cancellations,
        occupancyLabel: periodOccupancyLabel,
      });
    } finally {
      setExportingPeriod(null);
    }
  };

  return (
    <>
      <div className="border-neutral-dashboard-border flex gap-2 border-b">
        {(['daily', 'weekly', 'monthly'] as const).map((tab) => (
          <button
            key={tab}
            type="button"
            onClick={() => setActive(tab)}
            className={
              active === tab
                ? 'border-dashboard-primary-600 text-dashboard-primary-600 -mb-px border-b-2 px-3 py-2 text-sm font-medium'
                : 'text-neutral-dashboard-muted hover:text-neutral-dashboard-text -mb-px border-b-2 border-transparent px-3 py-2 text-sm font-medium'
            }
          >
            {labels.tabs[tab]}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-2 gap-3 md:gap-4 lg:grid-cols-4">
        <StatCard
          label={labels.income}
          value={`${current.income.toLocaleString()} ${labels.currency}`}
          icon={<DollarSign className="text-slate-300" />}
        />
        <StatCard
          label={occupancyLabel}
          value={current.occupancy}
          icon={<Building2 className="text-slate-300" />}
        />
        <StatCard
          label={labels.nights}
          value={current.nights}
          icon={<Users className="text-slate-300" />}
        />
        <StatCard
          label={labels.cancellations}
          value={current.cancellations}
          icon={<Sparkles className="text-slate-300" />}
        />
      </div>

      <div className="border-neutral-dashboard-border bg-neutral-dashboard-card rounded-md border p-6 shadow-sm">
        <h3 className="mb-4 text-base font-bold">{labels.exportTitle}</h3>
        <div className="grid grid-cols-1 gap-3 md:grid-cols-3 md:gap-4">
          {(['daily', 'weekly', 'monthly'] as const).map((period) => {
            const isExporting = exportingPeriod === period;
            return (
              <button
                key={period}
                type="button"
                onClick={() => handleExport(period)}
                disabled={Boolean(exportingPeriod)}
                className="border-neutral-dashboard-border flex items-center justify-between rounded-md border p-4 text-start transition-colors hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60"
              >
                <div className="flex items-center gap-3">
                  <div className="rounded bg-slate-100 p-2 text-slate-600">
                    {isExporting ? (
                      <Loader2 className="h-5 w-5 animate-spin" />
                    ) : (
                      <CalendarDays className="h-5 w-5" />
                    )}
                  </div>
                  <div>
                    <span className="text-neutral-dashboard-text block text-sm font-medium">
                      {labels.exportLabels[period]}
                    </span>
                    <span className="text-neutral-dashboard-muted block text-xs">
                      {labels.exportFormat}
                    </span>
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </>
  );
}

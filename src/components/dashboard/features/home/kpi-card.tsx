import type { LucideIcon } from 'lucide-react';

interface KpiCardProps {
  label: string;
  value: string;
  sublabel?: string;
  icon: LucideIcon;
  tone?: 'primary' | 'success' | 'warning' | 'info';
}

const toneClasses: Record<NonNullable<KpiCardProps['tone']>, string> = {
  primary: 'bg-dashboard-primary-50 text-dashboard-primary-700',
  success: 'bg-emerald-50 text-emerald-700',
  warning: 'bg-amber-50 text-amber-700',
  info: 'bg-sky-50 text-sky-700',
};

export function KpiCard({ label, value, sublabel, icon: Icon, tone = 'primary' }: KpiCardProps) {
  return (
    <div className="bg-neutral-dashboard-card border-neutral-dashboard-border rounded-lg border p-6 shadow-sm transition-shadow hover:shadow-md">
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <p className="text-neutral-dashboard-muted text-sm font-medium">{label}</p>
          <p className="text-neutral-dashboard-text mt-2 text-2xl font-bold">{value}</p>
          {sublabel ? (
            <p className="text-neutral-dashboard-muted mt-1 text-xs">{sublabel}</p>
          ) : null}
        </div>
        <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-md ${toneClasses[tone]}`}>
          <Icon className="h-5 w-5" />
        </div>
      </div>
    </div>
  );
}

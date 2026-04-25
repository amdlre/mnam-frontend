import type { LucideIcon } from 'lucide-react';
import { Card, CardContent, Typography } from '@amdlre/design-system';

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
    <Card className="border-neutral-dashboard-border transition-shadow hover:shadow-md">
      <CardContent className="p-6">
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0">
            <Typography as="p" variant="muted" className="text-sm font-medium">
              {label}
            </Typography>
            <Typography
              as="p"
              variant="large"
              className="text-neutral-dashboard-text mt-2 text-2xl font-bold"
            >
              {value}
            </Typography>
            {sublabel ? (
              <Typography as="p" variant="muted" className="mt-1 text-xs">
                {sublabel}
              </Typography>
            ) : null}
          </div>
          <div
            className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-md ${toneClasses[tone]}`}
          >
            <Icon className="h-5 w-5" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

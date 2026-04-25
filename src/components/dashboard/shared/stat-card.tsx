import type { ReactNode } from 'react';
import { Card, CardContent, Typography } from '@amdlre/design-system';

export interface StatCardProps {
  label: string;
  value: number | string;
  subtitle?: string;
  /** Optional icon rendered on the end side. */
  icon?: ReactNode;
  /** Color tone applied to the value text. */
  valueTone?: 'default' | 'success' | 'warning' | 'danger' | 'info';
}

const TONE_CLASSES: Record<NonNullable<StatCardProps['valueTone']>, string> = {
  default: 'text-neutral-dashboard-text',
  success: 'text-emerald-600',
  warning: 'text-amber-600',
  danger: 'text-red-600',
  info: 'text-sky-600',
};

export function StatCard({
  label,
  value,
  subtitle,
  icon,
  valueTone = 'default',
}: StatCardProps) {
  return (
    <Card className="border-neutral-dashboard-border min-h-[80px] rounded-md shadow-sm">
      <CardContent className="flex items-start justify-between p-3 md:p-4">
        <div>
          <Typography as="p" variant="muted" className="text-xs font-medium md:text-sm">
            {label}
          </Typography>
          <Typography
            as="p"
            variant="large"
            className={`mt-1 font-bold md:text-2xl ${TONE_CLASSES[valueTone]}`}
          >
            {value}
          </Typography>
          {subtitle ? (
            <Typography as="p" variant="muted" className="mt-1 text-[10px] md:text-xs">
              {subtitle}
            </Typography>
          ) : null}
        </div>
        {icon ? <div className="shrink-0">{icon}</div> : null}
      </CardContent>
    </Card>
  );
}

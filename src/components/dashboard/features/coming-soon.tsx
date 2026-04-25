import type { LucideIcon } from 'lucide-react';
import { Card, CardContent, Typography } from '@amdlre/design-system';

import { HeaderInfo } from '@/components/dashboard/shared/header-info';

interface ComingSoonProps {
  title: string;
  subtitle?: string;
  body: string;
  icon: LucideIcon;
}

export function ComingSoon({ title, subtitle, body, icon: Icon }: ComingSoonProps) {
  return (
    <div className="space-y-6">
      <HeaderInfo title={title} subtitle={subtitle} />

      <Card className="border-neutral-dashboard-border">
        <CardContent className="flex flex-col items-center justify-center p-12 text-center">
          <div className="bg-dashboard-primary-50 text-dashboard-primary-700 mb-4 flex h-16 w-16 items-center justify-center rounded-full">
            <Icon className="h-8 w-8" />
          </div>
          <Typography as="p" variant="large" className="text-neutral-dashboard-text font-bold">
            {body}
          </Typography>
        </CardContent>
      </Card>
    </div>
  );
}

'use client';

import { useTransition } from 'react';
import { Loader2 } from 'lucide-react';
import { CustomCombobox } from '@amdlre/design-system';

import { useRouter } from '@/i18n/navigation';

import { updateCleaningRequestStatusAction } from '@/actions/dashboard/cleaning';
import { CLEANING_REQUEST_STATUSES } from '@/types/dashboard';

import type { CleaningRequestStatus } from '@/types/dashboard';

interface Props {
  requestId: string;
  currentStatus: CleaningRequestStatus;
}

export function CleaningStatusSelect({ requestId, currentStatus }: Props) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  function onChange(value: string) {
    if (!value || value === currentStatus) return;
    const next = value as CleaningRequestStatus;
    startTransition(async () => {
      await updateCleaningRequestStatusAction(requestId, next);
      router.refresh();
    });
  }

  return (
    <div className="flex items-center gap-2">
      <CustomCombobox
        className="min-w-[140px]"
        options={CLEANING_REQUEST_STATUSES.map((s) => ({ value: s, label: s }))}
        value={currentStatus}
        onValueChange={onChange}
        placeholder={currentStatus}
      />
      {isPending ? <Loader2 className="text-dashboard-primary-600 h-3 w-3 animate-spin" /> : null}
    </div>
  );
}

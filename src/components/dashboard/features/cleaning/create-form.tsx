'use client';

import { useMemo, useState, useTransition } from 'react';
import { useTranslations } from 'next-intl';
import { Loader2, Sparkles } from 'lucide-react';
import { Button, CustomCombobox } from '@amdlre/design-system';

import { useRouter } from '@/i18n/navigation';

import { createCleaningRequestAction } from '@/actions/dashboard/cleaning';
import { CLEANING_REQUEST_TYPES } from '@/types/dashboard';

import type { CleaningRequestType, FetchedUnit } from '@/types/dashboard';

interface Props {
  units: FetchedUnit[];
  activeUnitIds: string[];
}

export function CleaningCreateForm({ units, activeUnitIds }: Props) {
  const t = useTranslations('dashboard.cleaning');
  const router = useRouter();
  const [selectedUnit, setSelectedUnit] = useState('');
  const [selectedType, setSelectedType] = useState<CleaningRequestType>('تنظيف');
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const activeSet = useMemo(() => new Set(activeUnitIds), [activeUnitIds]);

  // CustomCombobox can't disable individual options, so units with an active
  // request are excluded entirely from the picker.
  const unitOptions = useMemo(
    () =>
      units
        .filter((u) => !activeSet.has(u.id))
        .map((u) => ({ value: u.id, label: `${u.unitName} — ${u.projectName}` })),
    [units, activeSet],
  );

  const typeOptions = useMemo(
    () => CLEANING_REQUEST_TYPES.map((tt) => ({ value: tt, label: tt })),
    [],
  );

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!selectedUnit) {
      setError(t('unitRequired'));
      return;
    }
    setError(null);
    startTransition(async () => {
      const result = await createCleaningRequestAction(selectedUnit, selectedType);
      if (!result.success) {
        setError(result.message || t('createFailed'));
        return;
      }
      setSelectedUnit('');
      setSelectedType('تنظيف');
      router.refresh();
    });
  }

  return (
    <div className="bg-neutral-dashboard-card border-neutral-dashboard-border rounded-md border shadow-sm">
      <div className="border-neutral-dashboard-border flex items-center gap-2 border-b px-4 py-3">
        <Sparkles className="text-dashboard-primary-600 dark:text-dashboard-primary-400 h-5 w-5" />
        <h3 className="text-neutral-dashboard-text text-sm font-semibold">{t('quickCreate')}</h3>
      </div>
      <form onSubmit={onSubmit} className="p-4">
        <div className="grid grid-cols-1 items-end gap-3 md:grid-cols-3">
          <CustomCombobox
            label={t('unit')}
            isRequired
            options={unitOptions}
            value={selectedUnit}
            onValueChange={setSelectedUnit}
            placeholder={t('unitPlaceholder')}
          />

          <CustomCombobox
            label={t('type')}
            isRequired
            options={typeOptions}
            value={selectedType}
            onValueChange={(v) => setSelectedType((v || 'تنظيف') as CleaningRequestType)}
            placeholder={t('type')}
          />

          <Button
            type="submit"
            disabled={isPending || !selectedUnit}
            isLoading={isPending}
            size={"xl"}
          >
            {t('submit')}
          </Button>
        </div>

        {error ? <p className="text-destructive mt-3 text-sm">{error}</p> : null}
      </form>
    </div>
  );
}

'use client';

import { useTranslations } from 'next-intl';
import { ChevronLeft, ChevronRight, Loader2 } from 'lucide-react';

import { useWizard } from './use-wizard';
import { Button } from '@amdlre/design-system';

interface WizardFooterProps {
  submitLabel?: string;
  nextLabel?: string;
  backLabel?: string;
}

export function WizardFooter({ submitLabel, nextLabel, backLabel }: WizardFooterProps) {
  const t = useTranslations('dashboard.wizard');
  const { isFirst, isLast, goNext, goBack, isLoading, submitError } = useWizard();

  return (
    <div className="space-y-3">
      {submitError ? (
        <div className="rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-700">
          {submitError}
        </div>
      ) : null}

      <div className="flex items-center justify-between gap-3">
        <Button
          type="button"
          onClick={goBack}
          disabled={isFirst || isLoading}
          className={`inline-flex items-center gap-2 rounded-lg px-4 py-2.5 text-sm font-medium transition-colors ${isFirst
            ? 'invisible'
            : 'border-neutral-dashboard-border text-neutral-dashboard-text border bg-white hover:bg-slate-50 disabled:opacity-60'
            }`}
        >
          <ChevronRight className="h-4 w-4" />
          <span>{backLabel ?? t('back')}</span>
        </Button>

        <Button
          type="button"
          onClick={goNext}
          disabled={isLoading}
          className="bg-dashboard-primary-600 hover:bg-dashboard-primary-700 inline-flex items-center gap-2 rounded-lg px-5 py-2.5 text-sm font-medium text-white shadow-sm transition-all hover:shadow-md disabled:cursor-not-allowed disabled:opacity-70"
        >
          {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
          <span>{isLast ? (submitLabel ?? t('submit')) : (nextLabel ?? t('next'))}</span>
          {!isLast && !isLoading ? <ChevronLeft className="h-4 w-4" /> : null}
        </Button>
      </div>
    </div>
  );
}

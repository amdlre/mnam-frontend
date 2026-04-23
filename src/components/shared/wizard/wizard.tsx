'use client';

import { useCallback, useMemo, useState, useTransition } from 'react';

import type { FieldValues, UseFormReturn } from 'react-hook-form';

import { WizardContext } from './use-wizard';
import { WizardHeader } from './wizard-header';
import { WizardFooter } from './wizard-footer';

import type { WizardContextValue, WizardStepConfig } from './types';

interface WizardProps<TForm extends FieldValues> {
  form: UseFormReturn<TForm>;
  steps: WizardStepConfig<TForm>[];
  onComplete: (values: TForm) => Promise<{ success: boolean; message?: string } | void>;
  children: React.ReactNode;
  /** Optional submit button label for the last step. */
  submitLabel?: string;
}

export function Wizard<TForm extends FieldValues>({
  form,
  steps,
  onComplete,
  children,
  submitLabel,
}: WizardProps<TForm>) {
  const [currentStep, setCurrentStep] = useState(0);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const isFirst = currentStep === 0;
  const isLast = currentStep === steps.length - 1;

  const validateStep = useCallback(
    async (index: number) => {
      const step = steps[index];
      if (!step) return true;
      if (step.fields && step.fields.length > 0) {
        return form.trigger(step.fields);
      }
      return form.trigger();
    },
    [form, steps],
  );

  const goNext = useCallback(async (): Promise<boolean> => {
    setSubmitError(null);
    const ok = await validateStep(currentStep);
    if (!ok) return false;

    if (isLast) {
      const values = form.getValues();
      return new Promise<boolean>((resolve) => {
        startTransition(async () => {
          const result = await onComplete(values);
          if (result && result.success === false) {
            setSubmitError(result.message ?? null);
            resolve(false);
          } else {
            resolve(true);
          }
        });
      });
    }

    setCurrentStep((s) => Math.min(s + 1, steps.length - 1));
    return true;
  }, [currentStep, form, isLast, onComplete, steps.length, validateStep]);

  const goBack = useCallback(() => {
    setSubmitError(null);
    setCurrentStep((s) => Math.max(0, s - 1));
  }, []);

  const goTo = useCallback(
    (index: number) => {
      if (index < 0 || index >= steps.length) return;
      setCurrentStep(index);
    },
    [steps.length],
  );

  const value = useMemo<WizardContextValue<TForm>>(
    () => ({
      form,
      steps,
      currentStep,
      isFirst,
      isLast,
      goNext,
      goBack,
      goTo,
      isLoading: isPending,
      submitError,
    }),
    [form, steps, currentStep, isFirst, isLast, goNext, goBack, goTo, isPending, submitError],
  );

  return (
    <WizardContext.Provider value={value as unknown as WizardContextValue<FieldValues>}>
      <div className="space-y-6">
        <div className="bg-neutral-dashboard-card border-neutral-dashboard-border rounded-xl border p-6 shadow-sm">
          <WizardHeader />
        </div>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            void goNext();
          }}
          className="space-y-6"
          noValidate
        >
          {children}
          <WizardFooter submitLabel={submitLabel} />
        </form>
      </div>
    </WizardContext.Provider>
  );
}

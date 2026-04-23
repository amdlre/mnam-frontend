'use client';

import { Check } from 'lucide-react';

import { useWizard } from './use-wizard';

export function WizardHeader() {
  const { steps, currentStep } = useWizard();

  return (
    <ol className="flex flex-col items-start gap-3 sm:flex-row sm:items-center sm:gap-0">
      {steps.map((step, index) => {
        const isDone = index < currentStep;
        const isActive = index === currentStep;
        const circleClasses = isDone
          ? 'bg-dashboard-primary-600 text-white'
          : isActive
            ? 'bg-dashboard-primary-600 text-white ring-4 ring-dashboard-primary-100'
            : 'bg-slate-100 text-slate-400';
        const labelClasses = isActive || isDone
          ? 'text-neutral-dashboard-text'
          : 'text-neutral-dashboard-muted';

        return (
          <li key={step.id} className="flex flex-1 items-center gap-3 sm:gap-0">
            <div className="flex items-center gap-3">
              <div
                className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-sm font-bold transition-all ${circleClasses}`}
              >
                {isDone ? <Check className="h-4 w-4" /> : index + 1}
              </div>
              <div className="min-w-0 sm:me-3">
                <p className={`text-sm font-semibold ${labelClasses}`}>{step.title}</p>
                {step.description ? (
                  <p className="text-neutral-dashboard-muted truncate text-xs">{step.description}</p>
                ) : null}
              </div>
            </div>

            {index < steps.length - 1 ? (
              <div
                className={`hidden h-[2px] flex-1 rounded sm:block ${
                  isDone ? 'bg-dashboard-primary-600' : 'bg-slate-200'
                }`}
              />
            ) : null}
          </li>
        );
      })}
    </ol>
  );
}

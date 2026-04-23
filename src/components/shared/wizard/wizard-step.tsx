'use client';

import { useWizard } from './use-wizard';

interface WizardStepProps {
  id: string;
  children: React.ReactNode;
}

export function WizardStep({ id, children }: WizardStepProps) {
  const { steps, currentStep } = useWizard();
  const active = steps[currentStep]?.id === id;
  if (!active) return null;
  return <div className="animate-[dashboard-slide-in-up_0.25s_ease-out]">{children}</div>;
}

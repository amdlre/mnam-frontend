import type { ReactNode } from 'react';
import type { FieldValues, Path, UseFormReturn } from 'react-hook-form';
import type { ZodType } from 'zod';

export interface WizardStepConfig<TForm extends FieldValues = FieldValues> {
  id: string;
  title: string;
  description?: string;
  icon?: ReactNode;
  /** Fields in this step to validate before advancing. */
  fields?: Path<TForm>[];
  /** Optional Zod schema that picks this step's fields. */
  validationSchema?: ZodType<Partial<TForm>>;
}

export interface WizardContextValue<TForm extends FieldValues = FieldValues> {
  form: UseFormReturn<TForm>;
  steps: WizardStepConfig<TForm>[];
  currentStep: number;
  isFirst: boolean;
  isLast: boolean;
  goNext: () => Promise<boolean>;
  goBack: () => void;
  goTo: (index: number) => void;
  isLoading: boolean;
  submitError: string | null;
}

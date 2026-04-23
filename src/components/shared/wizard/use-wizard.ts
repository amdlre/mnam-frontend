'use client';

import { createContext, useContext } from 'react';

import type { FieldValues } from 'react-hook-form';

import type { WizardContextValue } from './types';

export const WizardContext = createContext<WizardContextValue<FieldValues> | null>(null);

export function useWizard<TForm extends FieldValues = FieldValues>(): WizardContextValue<TForm> {
  const ctx = useContext(WizardContext);
  if (!ctx) {
    throw new Error('useWizard must be used within <Wizard>');
  }
  return ctx as unknown as WizardContextValue<TForm>;
}

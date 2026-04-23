import type { ReactNode } from 'react';

export type ConfirmIconVariant = 'danger' | 'warning' | 'info' | 'success';
export type ConfirmButtonVariant = 'destructive' | 'default' | 'outline';

export interface ConfirmOptions {
  icon?: ReactNode;
  iconVariant?: ConfirmIconVariant;
  title: string;
  description?: string;
  confirmLabel?: string;
  /** Pass an empty string to hide the cancel button (alert mode). */
  cancelLabel?: string;
  confirmVariant?: ConfirmButtonVariant;
}

export interface ConfirmContextValue {
  confirm: (options: ConfirmOptions) => Promise<boolean>;
}

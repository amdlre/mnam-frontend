'use client';

import { useContext } from 'react';

import { ConfirmContext } from './confirm-provider';

import type { ConfirmOptions } from './types';

export function useConfirm(): (options: ConfirmOptions) => Promise<boolean> {
  const ctx = useContext(ConfirmContext);
  if (!ctx) {
    throw new Error('useConfirm must be used within ConfirmProvider');
  }
  return ctx.confirm;
}

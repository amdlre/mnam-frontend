'use client';

import { useEffect, useRef } from 'react';
import { AlertTriangle, CheckCircle2, Info, X } from 'lucide-react';

import type { ConfirmIconVariant, ConfirmOptions } from './types';

interface ConfirmModalProps {
  open: boolean;
  options: ConfirmOptions | null;
  onConfirm: () => void;
  onCancel: () => void;
}

const ICON_VARIANT_STYLES: Record<ConfirmIconVariant, { bg: string; color: string }> = {
  danger: { bg: 'bg-red-50', color: 'text-red-600' },
  warning: { bg: 'bg-amber-50', color: 'text-amber-600' },
  info: { bg: 'bg-sky-50', color: 'text-sky-600' },
  success: { bg: 'bg-emerald-50', color: 'text-emerald-600' },
};

function DefaultIcon({ variant }: { variant: ConfirmIconVariant }) {
  const classes = 'h-6 w-6';
  switch (variant) {
    case 'danger':
      return <X className={classes} />;
    case 'warning':
      return <AlertTriangle className={classes} />;
    case 'success':
      return <CheckCircle2 className={classes} />;
    case 'info':
    default:
      return <Info className={classes} />;
  }
}

export function ConfirmModal({ open, options, onConfirm, onCancel }: ConfirmModalProps) {
  const confirmRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') onCancel();
      else if (e.key === 'Enter') onConfirm();
    }
    window.addEventListener('keydown', onKey);
    confirmRef.current?.focus();
    return () => window.removeEventListener('keydown', onKey);
  }, [open, onCancel, onConfirm]);

  if (!open || !options) return null;

  const iconVariant: ConfirmIconVariant = options.iconVariant ?? 'info';
  const iconStyle = ICON_VARIANT_STYLES[iconVariant];
  const confirmVariant = options.confirmVariant ?? 'default';
  const confirmLabel = options.confirmLabel ?? 'تأكيد';
  // cancelLabel: undefined → default label; '' → hide the button; any other string → that label.
  const showCancel: string | null =
    options.cancelLabel === '' ? null : (options.cancelLabel ?? 'إلغاء');

  const confirmClasses =
    confirmVariant === 'destructive'
      ? 'bg-red-600 text-white hover:bg-red-700'
      : confirmVariant === 'outline'
        ? 'border border-neutral-dashboard-border bg-neutral-dashboard-card text-neutral-dashboard-text hover:bg-neutral-dashboard-bg'
        : 'bg-dashboard-primary-600 text-white hover:bg-dashboard-primary-700';

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-[100] flex items-center justify-center p-4"
    >
      <div
        className="absolute inset-0 bg-slate-950/40 backdrop-blur-sm"
        onClick={onCancel}
        aria-hidden="true"
      />
      <div className="bg-neutral-dashboard-card border-neutral-dashboard-border relative w-full max-w-md rounded-xl border p-6 shadow-2xl">
        <div className="flex flex-col items-center text-center">
          <div className={`${iconStyle.bg} ${iconStyle.color} mb-4 flex h-14 w-14 items-center justify-center rounded-full`}>
            {options.icon ?? <DefaultIcon variant={iconVariant} />}
          </div>
          <h2 className="text-neutral-dashboard-text text-lg font-semibold">{options.title}</h2>
          {options.description ? (
            <p className="text-neutral-dashboard-muted mt-2 text-sm leading-relaxed">
              {options.description}
            </p>
          ) : null}
        </div>

        <div className="mt-6 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
          {showCancel ? (
            <button
              type="button"
              onClick={onCancel}
              className="border-neutral-dashboard-border bg-neutral-dashboard-card text-neutral-dashboard-text hover:bg-neutral-dashboard-bg rounded-lg border px-4 py-2 text-sm font-medium transition-colors"
            >
              {showCancel}
            </button>
          ) : null}
          <button
            ref={confirmRef}
            type="button"
            onClick={onConfirm}
            className={`rounded-lg px-5 py-2 text-sm font-medium transition-colors ${confirmClasses}`}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}

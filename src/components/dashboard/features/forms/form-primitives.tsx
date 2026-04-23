'use client';

import type { ReactNode } from 'react';

export function FormField({
  label,
  required,
  error,
  hint,
  children,
}: {
  label: string;
  required?: boolean;
  error?: string;
  hint?: string;
  children: ReactNode;
}) {
  return (
    <div>
      <label className="text-neutral-dashboard-text mb-1 block text-sm font-medium">
        {label}
        {required ? <span className="ms-1 text-red-500">*</span> : null}
      </label>
      {children}
      {hint && !error ? <p className="text-neutral-dashboard-muted mt-1 text-xs">{hint}</p> : null}
      {error ? <p className="mt-1 text-xs text-red-600">{error}</p> : null}
    </div>
  );
}

export function FormCard({ title, children }: { title?: string; children: ReactNode }) {
  return (
    <div className="bg-neutral-dashboard-card border-neutral-dashboard-border space-y-6 rounded-xl border p-6 shadow-sm">
      {title ? (
        <h2 className="border-neutral-dashboard-border text-neutral-dashboard-text border-b pb-3 text-base font-bold">
          {title}
        </h2>
      ) : null}
      {children}
    </div>
  );
}

export function FormInputs() {
  return (
    <style>{`
      .input {
        width: 100%;
        padding: 0.5rem 0.75rem;
        border-radius: 0.5rem;
        border: 1px solid var(--color-neutral-dashboard-border);
        background: var(--color-neutral-dashboard-card);
        color: var(--color-neutral-dashboard-text);
        font-size: 0.875rem;
        outline: none;
        transition: box-shadow 0.15s;
      }
      .input:focus {
        border-color: var(--color-dashboard-primary-500);
        box-shadow: 0 0 0 2px var(--color-dashboard-primary-100);
      }
      textarea.input { min-height: 6rem; resize: vertical; }
    `}</style>
  );
}

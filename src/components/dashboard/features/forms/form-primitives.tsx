'use client';

import type { ReactNode } from 'react';
import { Card, CardContent, Label, Typography } from '@amdlre/design-system';

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
      <Label className="text-neutral-dashboard-text mb-1 block text-sm font-medium">
        {label}
        {required ? <span className="ms-1 text-red-500">*</span> : null}
      </Label>
      {children}
      {hint && !error ? (
        <Typography as="p" variant="muted" className="mt-1 text-xs">
          {hint}
        </Typography>
      ) : null}
      {error ? (
        <Typography as="p" variant="muted" className="mt-1 text-xs text-red-600">
          {error}
        </Typography>
      ) : null}
    </div>
  );
}

export function FormCard({ title, children }: { title?: string; children: ReactNode }) {
  return (
    <Card className="border-neutral-dashboard-border">
      <CardContent className="space-y-6 p-6">
        {title ? (
          <Typography
            as="h2"
            variant="h4"
            className="border-neutral-dashboard-border text-neutral-dashboard-text border-b pb-3 text-base font-bold"
          >
            {title}
          </Typography>
        ) : null}
        {children}
      </CardContent>
    </Card>
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

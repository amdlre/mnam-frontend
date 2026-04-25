'use client';

import { useState, useTransition } from 'react';
import { useTranslations } from 'next-intl';
import { Loader2, Lock, ShieldCheck } from 'lucide-react';
import { Button, Card, CardContent, CustomInput } from '@amdlre/design-system';

import { changePasswordAction } from '@/actions/dashboard/account';

type Message = { type: 'success' | 'error'; text: string };

export function AccountSettingsForm() {
  const t = useTranslations('dashboard.account.settings');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errors, setErrors] = useState<Record<string, string[]>>({});
  const [message, setMessage] = useState<Message | null>(null);
  const [isPending, startTransition] = useTransition();

  function fieldError(name: string) {
    return errors[name]?.[0];
  }

  function reset() {
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
  }

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setMessage(null);
    setErrors({});
    startTransition(async () => {
      const result = await changePasswordAction({
        currentPassword,
        newPassword,
        confirmPassword,
      });
      if (result.success) {
        setMessage({ type: 'success', text: t('success') });
        reset();
        return;
      }
      if (result.errors) {
        setErrors(result.errors);
        return;
      }
      setMessage({ type: 'error', text: result.message ?? t('fail') });
    });
  }

  return (
    <Card className="border-neutral-dashboard-border">
      <CardContent className="p-6">
        <header className="border-neutral-dashboard-border mb-5 flex items-center gap-2 border-b pb-3">
          <Lock className="text-dashboard-primary-600 h-4 w-4" />
          <h2 className="text-neutral-dashboard-text text-sm font-bold">{t('passwordTitle')}</h2>
        </header>

        <p className="text-neutral-dashboard-muted mb-5 text-xs">{t('passwordHint')}</p>

        <form onSubmit={onSubmit} className="space-y-4">
          {message ? (
            <div
              className={`rounded-md border p-3 text-sm ${
                message.type === 'success'
                  ? 'border-emerald-200 bg-emerald-50 text-emerald-700'
                  : 'border-red-200 bg-red-50 text-red-700'
              }`}
            >
              {message.text}
            </div>
          ) : null}

          <CustomInput
            type="password"
            label={t('currentPassword')}
            isRequired
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            error={fieldError('currentPassword')}
            autoComplete="current-password"
          />

          <div className="grid gap-4 md:grid-cols-2">
            <CustomInput
              type="password"
              label={t('newPassword')}
              isRequired
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              error={fieldError('newPassword')}
              autoComplete="new-password"
            />
            <CustomInput
              type="password"
              label={t('confirmPassword')}
              isRequired
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              error={fieldError('confirmPassword')}
              autoComplete="new-password"
            />
          </div>

          <Button
            type="submit"
            disabled={isPending}
            leftIcon={
              isPending ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <ShieldCheck className="h-4 w-4" />
              )
            }
          >
            {isPending ? t('submitting') : t('submit')}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}

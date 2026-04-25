'use client';

import { useState, useTransition } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslations } from 'next-intl';
import { AlertCircle, Eye, EyeOff, Loader2 } from 'lucide-react';
import { Button, CustomInput } from '@amdlre/design-system';

import { useRouter } from '@/i18n/navigation';
import { dashboardLoginAction } from '@/actions/dashboard/auth';
import {
  dashboardLoginSchema,
  type DashboardLoginFormData,
} from '@/lib/validations/dashboard/auth';

export function DashboardLoginForm() {
  const t = useTranslations('dashboard.login');
  const tErrors = useTranslations('dashboard.errors');
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<DashboardLoginFormData>({
    resolver: zodResolver(dashboardLoginSchema),
    defaultValues: { username: '', password: '' },
  });

  function onSubmit(data: DashboardLoginFormData) {
    setSubmitError(null);
    startTransition(async () => {
      const formData = new FormData();
      formData.set('username', data.username);
      formData.set('password', data.password);
      const result = await dashboardLoginAction(formData);
      if (!result.success) {
        setSubmitError(tErrors(result.messageKey || 'loginFailed'));
        return;
      }
      router.replace('/dashboard');
      router.refresh();
    });
  }

  const fieldErrorKey = (key?: string) => (key ? tErrors(key) : undefined);

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate>
      <CustomInput
        id="username"
        type="text"
        autoComplete="username"
        label={t('usernameLabel')}
        placeholder={t('usernameLabel')}
        error={fieldErrorKey(errors.username?.message)}
        {...register('username')}
      />

      <div className="relative">
        <CustomInput
          id="password"
          type={showPassword ? 'text' : 'password'}
          autoComplete="current-password"
          label={t('passwordLabel')}
          placeholder={t('passwordLabel')}
          error={fieldErrorKey(errors.password?.message)}
          className="pe-10"
          {...register('password')}
        />
        <button
          type="button"
          onClick={() => setShowPassword((v) => !v)}
          className="text-neutral-dashboard-muted hover:text-neutral-dashboard-text absolute end-0 top-[34px] flex h-10 items-center pe-3"
          aria-label={showPassword ? t('hidePassword') : t('showPassword')}
          tabIndex={-1}
        >
          {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
        </button>
      </div>

      {submitError ? (
        <div className="flex items-center gap-2 rounded-md border border-red-200 bg-red-50 p-3">
          <AlertCircle className="h-5 w-5 text-red-600" />
          <p className="text-sm text-red-700">{submitError}</p>
        </div>
      ) : null}

      <Button type="submit" disabled={isPending} className="w-full mt-3" size={"xl"} isLoading={isPending}>
        {t('submit')}
      </Button>
    </form>
  );
}

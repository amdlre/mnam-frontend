'use client';

import { useState, useTransition } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslations } from 'next-intl';
import { Loader2, ShieldCheck, UserCircle } from 'lucide-react';
import {
  Card,
  CardContent,
  CustomCombobox,
  CustomInput,
  WizardForm,
  type WizardFormStep,
} from '@amdlre/design-system';

import { useRouter } from '@/i18n/navigation';
import { useConfirm } from '@/components/shared/confirm-modal';
import { HeaderInfo } from '@/components/dashboard/shared/header-info';
import { toggleUserActiveAction, updateUserAction } from '@/actions/dashboard/users';
import {
  userEditSchema,
  type UserEditFormData,
} from '@/lib/validations/dashboard/users';

import type { AssignableRole, SystemUser } from '@/types/dashboard';

interface Props {
  user: SystemUser;
  roles: AssignableRole[];
}

export function UserEditForm({ user, roles }: Props) {
  const t = useTranslations('dashboard.userForm');
  const tErrors = useTranslations('dashboard.userForm.errors');
  const tWiz = useTranslations('dashboard.wizard');
  const router = useRouter();
  const confirm = useConfirm();
  const [isToggling, startToggleTransition] = useTransition();
  const [isActive, setIsActive] = useState(user.isActive);

  const form = useForm<UserEditFormData>({
    resolver: zodResolver(userEditSchema),
    defaultValues: {
      first_name: user.firstName,
      last_name: user.lastName,
      email: user.email,
      phone: user.phone,
      role: user.role,
      is_active: user.isActive,
    },
    mode: 'onBlur',
  });

  const {
    register,
    formState: { errors },
  } = form;

  const steps: WizardFormStep<UserEditFormData>[] = [
    {
      id: 'personal',
      title: t('personalSection'),
      icon: <UserCircle className="h-4 w-4" />,
      fields: ['first_name', 'last_name', 'phone'],
    },
    {
      id: 'access',
      title: t('accessSection'),
      icon: <ShieldCheck className="h-4 w-4" />,
      fields: ['email', 'role'],
    },
  ];

  async function onToggleActive() {
    const ok = await confirm({
      iconVariant: isActive ? 'warning' : 'info',
      title: isActive ? t('deactivate') : t('activate'),
      description: isActive ? t('confirmDeactivate') : t('confirmActivate'),
      confirmLabel: isActive ? t('deactivate') : t('activate'),
      cancelLabel: t('cancel'),
      confirmVariant: isActive ? 'destructive' : 'default',
    });
    if (!ok) return;
    startToggleTransition(async () => {
      const result = await toggleUserActiveAction(user.id);
      if (result.success) {
        setIsActive((prev) => !prev);
      } else {
        await confirm({
          iconVariant: 'danger',
          title: t('updateFailed'),
          description: result.message || t('updateFailed'),
          confirmLabel: t('cancel'),
          cancelLabel: '',
        });
      }
    });
  }

  const err = (k?: string) => (k ? tErrors(k) : '');

  return (
    <div className="space-y-6">
      <HeaderInfo
        size="md"
        title={`${user.firstName} ${user.lastName}`}
        subtitle={`@${user.username}`}
        backHref="/dashboard/users"
        backLabel={t('back')}
        actions={
          <>
            <span
              className={`rounded-full px-2 py-0.5 text-[10px] font-medium ${isActive ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'
                }`}
            >
              {isActive ? t('active') : t('inactive')}
            </span>
            <button
              type="button"
              onClick={onToggleActive}
              disabled={isToggling}
              className={`inline-flex items-center gap-2 rounded-lg border px-4 py-2.5 text-sm font-medium transition-colors disabled:opacity-60 ${isActive
                  ? 'border-red-200 bg-red-50 text-red-700 hover:bg-red-100'
                  : 'border-emerald-200 bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
                }`}
            >
              {isToggling ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
              <span>{isActive ? t('deactivate') : t('activate')}</span>
            </button>
          </>
        }
      />

      <WizardForm
        form={form}
        steps={steps}
        labels={{ back: tWiz('back'), next: tWiz('next'), submit: t('saveChanges') }}
        onComplete={async (values) => {
          const result = await updateUserAction(user.id, { ...values, is_active: isActive });
          if (!result.success) return { message: result.message || t('updateFailed') };
          router.push('/dashboard/users');
          router.refresh();
        }}
      >
        <Card>
          <CardContent className="space-y-6 p-6">
            <h2 className="border-b pb-3 text-base font-bold">{t('personalSection')}</h2>
            <div className="grid grid-cols-1 gap-x-6 md:grid-cols-2 lg:grid-cols-3">
              <CustomInput
                label={t('firstName')}
                isRequired
                type="text"
                placeholder={t('firstNamePlaceholder')}
                error={err(errors.first_name?.message)}
                {...register('first_name')}
              />
              <CustomInput
                label={t('lastName')}
                type="text"
                placeholder={t('lastNamePlaceholder')}
                error={err(errors.last_name?.message)}
                {...register('last_name')}
              />
              <CustomInput
                label={t('phone')}
                type="tel"
                dir="ltr"
                placeholder="05xxxxxxxx"
                error={err(errors.phone?.message)}
                {...register('phone')}
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="space-y-6 p-6">
            <h2 className="border-b pb-3 text-base font-bold">{t('accessSection')}</h2>
            <div className="grid grid-cols-1 gap-x-6 md:grid-cols-2 lg:grid-cols-3">
              <CustomInput
                label={t('email')}
                isRequired
                type="email"
                dir="ltr"
                placeholder="email@example.com"
                error={err(errors.email?.message)}
                {...register('email')}
              />
              <Controller
                control={form.control}
                name="role"
                render={({ field, fieldState }) => (
                  <CustomCombobox
                    label={t('role')}
                    isRequired
                    options={roles.map((r) => ({ value: r.value, label: r.label }))}
                    value={field.value}
                    onValueChange={field.onChange}
                    error={err(fieldState.error?.message)}
                    placeholder={t('selectRole')}
                    searchPlaceholder={t('selectRole')}
                  />
                )}
              />
            </div>
          </CardContent>
        </Card>
      </WizardForm>
    </div>
  );
}

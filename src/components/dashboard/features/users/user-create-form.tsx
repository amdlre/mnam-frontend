'use client';

import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslations } from 'next-intl';
import { LockKeyhole, UserCircle } from 'lucide-react';
import {
  Card,
  CardContent,
  CustomCombobox,
  CustomInput,
  WizardForm,
  type WizardFormStep,
} from '@amdlre/design-system';

import { useRouter } from '@/i18n/navigation';
import { HeaderInfo } from '@/components/dashboard/shared/header-info';
import { createUserAction } from '@/actions/dashboard/users';
import {
  userCreateSchema,
  type UserCreateFormData,
} from '@/lib/validations/dashboard/users';

import type { AssignableRole } from '@/types/dashboard';

interface Props {
  roles: AssignableRole[];
}

export function UserCreateForm({ roles }: Props) {
  const t = useTranslations('dashboard.userForm');
  const tErrors = useTranslations('dashboard.userForm.errors');
  const tWiz = useTranslations('dashboard.wizard');
  const router = useRouter();

  const defaultRole = roles[0]?.value ?? 'customers_agent';

  const form = useForm<UserCreateFormData>({
    resolver: zodResolver(userCreateSchema),
    defaultValues: {
      first_name: '',
      last_name: '',
      username: '',
      email: '',
      password: '',
      phone: '',
      role: defaultRole,
    },
    mode: 'onBlur',
  });

  const {
    register,
    formState: { errors },
  } = form;

  const steps: WizardFormStep<UserCreateFormData>[] = [
    {
      id: 'account',
      title: t('accountSection'),
      icon: <LockKeyhole className="h-4 w-4" />,
      fields: ['username', 'email', 'password', 'role'],
    },
    {
      id: 'personal',
      title: t('personalSection'),
      icon: <UserCircle className="h-4 w-4" />,
      fields: ['first_name', 'last_name', 'phone'],
    },
  ];

  const err = (k?: string) => (k ? tErrors(k) : '');

  return (
    <div className="space-y-6">
      <HeaderInfo
        size="md"
        title={t('createTitle')}
        subtitle={t('createSubtitle')}
        backHref="/dashboard/users"
        backLabel={t('back')}
      />

      <WizardForm
        form={form}
        steps={steps}
        labels={{ back: tWiz('back'), next: tWiz('next'), submit: t('createSubmit') }}
        onComplete={async (values) => {
          const result = await createUserAction(values);
          if (!result.success) return { message: result.message || t('createFailed') };
          router.push('/dashboard/users');
          router.refresh();
        }}
      >
        <Card>
          <CardContent className="space-y-6 p-6">
            <h2 className="border-b pb-3 text-base font-bold">{t('accountSection')}</h2>
            <div className="grid grid-cols-1 gap-x-6 md:grid-cols-2 lg:grid-cols-3">
              <CustomInput
                label={t('username')}
                isRequired
                type="text"
                dir="ltr"
                placeholder="username"
                error={err(errors.username?.message)}
                {...register('username')}
              />
              <CustomInput
                label={t('email')}
                isRequired
                type="email"
                dir="ltr"
                placeholder="email@example.com"
                error={err(errors.email?.message)}
                {...register('email')}
              />
              <CustomInput
                label={t('password')}
                isRequired
                type="password"
                dir="ltr"
                placeholder="••••••••"
                error={err(errors.password?.message)}
                {...register('password')}
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
      </WizardForm>
    </div>
  );
}

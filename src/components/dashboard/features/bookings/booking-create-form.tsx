'use client';

import { useMemo } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslations } from 'next-intl';
import { CalendarDays, ClipboardList } from 'lucide-react';
import {
  Card,
  CardContent,
  CustomCombobox,
  CustomInput,
  CustomTextarea,
  WizardForm,
  type WizardFormStep,
} from '@amdlre/design-system';

import { useRouter } from '@/i18n/navigation';
import { HeaderInfo } from '@/components/dashboard/shared/header-info';
import { createBookingAction } from '@/actions/dashboard/entities';
import {
  bookingCreateSchema,
  type BookingCreateFormData,
} from '@/lib/validations/dashboard/entities';
import { BOOKING_STATUSES, type FetchedUnit } from '@/types/dashboard';

import type { SimpleProject } from '@/lib/api/dashboard/entities';

interface Props {
  projects: SimpleProject[];
  units: FetchedUnit[];
}

const CHANNELS = ['direct', 'airbnb', 'booking.com', 'expedia', 'agoda', 'gathern', 'other_ota'];

export function BookingCreateForm({ projects, units }: Props) {
  const t = useTranslations('dashboard.bookingForm');
  const tErrors = useTranslations('dashboard.bookingForm.errors');
  const tWiz = useTranslations('dashboard.wizard');
  const router = useRouter();

  const form = useForm<BookingCreateFormData>({
    resolver: zodResolver(bookingCreateSchema),
    defaultValues: {
      project_id: projects[0]?.id ?? '',
      unit_id: '',
      guest_name: '',
      guest_phone: '',
      check_in_date: '',
      check_out_date: '',
      total_price: 0,
      status: 'مؤكد',
      channel_source: 'direct',
      notes: '',
    },
    mode: 'onBlur',
  });

  const {
    register,
    watch,
    setValue,
    formState: { errors },
  } = form;

  const projectId = watch('project_id');
  const availableUnits = useMemo(
    () => units.filter((u) => (projectId ? u.projectId === projectId : true) && u.status === 'متاحة'),
    [projectId, units],
  );

  const steps: WizardFormStep<BookingCreateFormData>[] = [
    {
      id: 'selection',
      title: t('steps.selection'),
      icon: <ClipboardList className="h-4 w-4" />,
      fields: ['project_id', 'unit_id', 'guest_name', 'guest_phone'],
    },
    {
      id: 'dates',
      title: t('steps.dates'),
      icon: <CalendarDays className="h-4 w-4" />,
      fields: ['check_in_date', 'check_out_date', 'total_price', 'status', 'channel_source'],
    },
  ];

  const err = (k?: string) => (k ? tErrors(k) : '');

  return (
    <div className="space-y-6">
      <HeaderInfo
        size="md"
        title={t('title')}
        subtitle={t('subtitle')}
        backHref="/dashboard/bookings"
      />

      <WizardForm
        form={form}
        steps={steps}
        labels={{ back: tWiz('back'), next: tWiz('next'), submit: t('submit') }}
        onComplete={async (values) => {
          const result = await createBookingAction(values);
          if (!result.success) return { message: result.message || t('createFailed') };
          router.push('/dashboard/bookings');
          router.refresh();
        }}
      >
        <Card>
          <CardContent className="space-y-6 p-6">
            <h2 className="border-b pb-3 text-base font-bold">{t('steps.selection')}</h2>
            <div className="grid grid-cols-1 gap-x-6 md:grid-cols-2 lg:grid-cols-3">
              <Controller
                control={form.control}
                name="project_id"
                render={({ field, fieldState }) => (
                  <CustomCombobox
                    label={t('project')}
                    isRequired
                    options={projects.map((p) => ({ value: p.id, label: p.name }))}
                    value={field.value}
                    onValueChange={(v) => {
                      field.onChange(v);
                      setValue('unit_id', '');
                    }}
                    error={err(fieldState.error?.message)}
                    placeholder={t('selectProject')}
                    emptyMessage={t('noProjects')}
                  />
                )}
              />
              <Controller
                control={form.control}
                name="unit_id"
                render={({ field, fieldState }) => (
                  <CustomCombobox
                    label={t('unit')}
                    isRequired
                    options={availableUnits.map((u) => ({ value: u.id, label: u.unitName }))}
                    value={field.value}
                    onValueChange={field.onChange}
                    error={err(fieldState.error?.message)}
                    placeholder={t('unitPlaceholder')}
                  />
                )}
              />
              <CustomInput
                label={t('guestName')}
                isRequired
                type="text"
                placeholder={t('guestName')}
                error={err(errors.guest_name?.message)}
                {...register('guest_name')}
              />
              <CustomInput
                label={t('guestPhone')}
                type="tel"
                dir="ltr"
                placeholder="05xxxxxxxx"
                error={err(errors.guest_phone?.message)}
                {...register('guest_phone')}
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="space-y-6 p-6">
            <h2 className="border-b pb-3 text-base font-bold">{t('steps.dates')}</h2>
            <div className="grid grid-cols-1 gap-x-6 md:grid-cols-2 lg:grid-cols-3">
              <CustomInput
                label={t('checkIn')}
                isRequired
                type="date"
                error={err(errors.check_in_date?.message)}
                {...register('check_in_date')}
              />
              <CustomInput
                label={t('checkOut')}
                isRequired
                type="date"
                error={err(errors.check_out_date?.message)}
                {...register('check_out_date')}
              />
              <CustomInput
                label={t('price')}
                type="number"
                step="0.01"
                placeholder="0.00"
                error={err(errors.total_price?.message)}
                {...register('total_price', { valueAsNumber: true })}
              />
              <Controller
                control={form.control}
                name="status"
                render={({ field, fieldState }) => (
                  <CustomCombobox
                    label={t('status')}
                    isRequired
                    options={BOOKING_STATUSES.map((s) => ({ value: s, label: s }))}
                    value={field.value}
                    onValueChange={field.onChange}
                    error={err(fieldState.error?.message)}
                    placeholder={t('selectStatus')}
                  />
                )}
              />
              <Controller
                control={form.control}
                name="channel_source"
                render={({ field, fieldState }) => (
                  <CustomCombobox
                    label={t('channel')}
                    options={CHANNELS.map((c) => ({ value: c, label: c }))}
                    value={field.value}
                    onValueChange={field.onChange}
                    error={err(fieldState.error?.message)}
                    placeholder={t('selectChannel')}
                  />
                )}
              />
              <div className="md:col-span-2 lg:col-span-3">
                <CustomTextarea
                  label={t('notes')}
                  placeholder={t('notesPlaceholder')}
                  error={err(errors.notes?.message)}
                  {...register('notes')}
                />
              </div>
            </div>
          </CardContent>
        </Card>
      </WizardForm>
    </div>
  );
}

'use client';

import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslations } from 'next-intl';
import { Building2, DollarSign } from 'lucide-react';
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
import { createUnitAction } from '@/actions/dashboard/entities';
import {
  unitCreateSchema,
  type UnitCreateFormData,
} from '@/lib/validations/dashboard/entities';

import type { SimpleProject } from '@/lib/api/dashboard/entities';

interface Props {
  projects: SimpleProject[];
}

const UNIT_TYPES = ['شقة', 'استوديو', 'فيلا', 'شاليه', 'بيت ريفي', 'استراحة', 'كرفان', 'مخيم', 'دوبلكس', 'تاون هاوس'];
const UNIT_STATUSES = ['متاحة', 'محجوزة', 'تحتاج تنظيف', 'صيانة', 'مخفية'];

export function UnitCreateForm({ projects }: Props) {
  const t = useTranslations('dashboard.unitForm');
  const tErrors = useTranslations('dashboard.unitForm.errors');
  const tWiz = useTranslations('dashboard.wizard');
  const router = useRouter();

  const form = useForm<UnitCreateFormData>({
    resolver: zodResolver(unitCreateSchema),
    defaultValues: {
      project_id: projects[0]?.id ?? '',
      unit_name: '',
      unit_type: UNIT_TYPES[0],
      rooms: 1,
      floor_number: 0,
      unit_area: 0,
      status: 'متاحة',
      base_weekday_price: 0,
      weekend_markup_percent: 0,
      description: '',
      permit_no: '',
    },
    mode: 'onBlur',
  });

  const {
    register,
    formState: { errors },
  } = form;

  const steps: WizardFormStep<UnitCreateFormData>[] = [
    {
      id: 'info',
      title: t('steps.info'),
      icon: <Building2 className="h-4 w-4" />,
      fields: ['project_id', 'unit_name', 'unit_type', 'rooms', 'status'],
    },
    {
      id: 'pricing',
      title: t('steps.pricing'),
      icon: <DollarSign className="h-4 w-4" />,
      fields: ['base_weekday_price', 'weekend_markup_percent'],
    },
  ];

  const err = (k?: string) => (k ? tErrors(k) : '');

  return (
    <div className="space-y-6">
      <HeaderInfo
        size="md"
        title={t('title')}
        subtitle={t('subtitle')}
        backHref="/dashboard/units"
      />

      <WizardForm
        form={form}
        steps={steps}
        labels={{ back: tWiz('back'), next: tWiz('next'), submit: t('submit') }}
        onComplete={async (values) => {
          const result = await createUnitAction(values);
          if (!result.success) return { message: result.message || t('createFailed') };
          router.push('/dashboard/units');
          router.refresh();
        }}
      >
        <Card>
          <CardContent className="space-y-6 p-6">
            <h2 className="border-b pb-3 text-base font-bold">{t('steps.info')}</h2>
            <div className="grid grid-cols-1 gap-x-6 md:grid-cols-2 lg:grid-cols-3">
              <div className="md:col-span-2 lg:col-span-3">
                <Controller
                  control={form.control}
                  name="project_id"
                  render={({ field, fieldState }) => (
                    <CustomCombobox
                      label={t('project')}
                      isRequired
                      options={projects.map((p) => ({ value: p.id, label: p.name }))}
                      value={field.value}
                      onValueChange={field.onChange}
                      error={err(fieldState.error?.message)}
                      placeholder={t('selectProject')}
                      emptyMessage={t('noProjects')}
                    />
                  )}
                />
              </div>
              <CustomInput
                label={t('unitName')}
                isRequired
                type="text"
                placeholder={t('unitName')}
                error={err(errors.unit_name?.message)}
                {...register('unit_name')}
              />
              <Controller
                control={form.control}
                name="unit_type"
                render={({ field, fieldState }) => (
                  <CustomCombobox
                    label={t('unitType')}
                    isRequired
                    options={UNIT_TYPES.map((u) => ({ value: u, label: u }))}
                    value={field.value}
                    onValueChange={field.onChange}
                    error={err(fieldState.error?.message)}
                    placeholder={t('selectUnitType')}
                  />
                )}
              />
              <CustomInput
                label={t('rooms')}
                isRequired
                type="number"
                placeholder="1"
                error={err(errors.rooms?.message)}
                {...register('rooms', { valueAsNumber: true })}
              />
              <Controller
                control={form.control}
                name="status"
                render={({ field, fieldState }) => (
                  <CustomCombobox
                    label={t('status')}
                    isRequired
                    options={UNIT_STATUSES.map((s) => ({ value: s, label: s }))}
                    value={field.value}
                    onValueChange={field.onChange}
                    error={err(fieldState.error?.message)}
                    placeholder={t('selectStatus')}
                  />
                )}
              />
              <CustomInput
                label={t('floor')}
                type="number"
                placeholder="0"
                error={err(errors.floor_number?.message)}
                {...register('floor_number', { valueAsNumber: true })}
              />
              <CustomInput
                label={t('area')}
                type="number"
                step="0.1"
                placeholder="0"
                error={err(errors.unit_area?.message)}
                {...register('unit_area', { valueAsNumber: true })}
              />
              <div className="md:col-span-2 lg:col-span-3">
                <CustomTextarea
                  label={t('description')}
                  placeholder={t('descriptionPlaceholder')}
                  error={err(errors.description?.message)}
                  {...register('description')}
                />
              </div>
              <CustomInput
                label={t('permitNo')}
                type="text"
                placeholder={t('permitNo')}
                error={err(errors.permit_no?.message)}
                {...register('permit_no')}
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="space-y-6 p-6">
            <h2 className="border-b pb-3 text-base font-bold">{t('steps.pricing')}</h2>
            <div className="grid grid-cols-1 gap-x-6 md:grid-cols-2 lg:grid-cols-3">
              <CustomInput
                label={t('weekdayPrice')}
                isRequired
                type="number"
                step="0.01"
                placeholder="0.00"
                error={err(errors.base_weekday_price?.message)}
                {...register('base_weekday_price', { valueAsNumber: true })}
              />
              <CustomInput
                label={t('weekendMarkup')}
                type="number"
                step="0.01"
                placeholder="0"
                error={err(errors.weekend_markup_percent?.message)}
                {...register('weekend_markup_percent', { valueAsNumber: true })}
              />
            </div>
          </CardContent>
        </Card>
      </WizardForm>
    </div>
  );
}

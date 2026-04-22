import { useState, useEffect } from 'react';
import { useForm as useReactHookForm } from 'react-hook-form';
import { useForm as useFormspree } from '@formspree/react';
import { useLocale } from 'next-intl';
import { zodResolver } from '@hookform/resolvers/zod';
import { ownerFormSchema } from '@/lib/validations/owner';
import type { OwnerFormData } from '@/lib/validations/owner';

export function useOwnerForm() {
  const locale = useLocale() as 'ar' | 'en';
  const [formspreeState, submitToFormspree] = useFormspree('xjgjelzp');
  const [showSuccess, setShowSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
    reset,
  } = useReactHookForm<OwnerFormData>({
    resolver: zodResolver(ownerFormSchema(locale)),
    defaultValues: {
      name: '',
      phone: '',
      city: '',
      unitType: '',
      unitCount: '',
    },
  });

  useEffect(() => {
    if (formspreeState.succeeded) {
      setShowSuccess(true);
      const timer = setTimeout(() => {
        setShowSuccess(false);
        reset();
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [formspreeState.succeeded, reset]);

  const onSubmit = async (data: OwnerFormData) => {
    const formData = new FormData();
    Object.entries(data).forEach(([key, value]) => {
      formData.append(key, value);
    });
    await submitToFormspree(formData);
  };

  return {
    register,
    handleSubmit: handleSubmit(onSubmit),
    errors,
    isSubmitting: formspreeState.submitting,
    showSuccess,
    setValue,
    watch,
  };
}

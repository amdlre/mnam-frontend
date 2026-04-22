import { z } from 'zod';

const messages = {
  ar: {
    required: 'الحقل مطلوب',
    phone: 'رقم الجوال يجب أن يكون 10 أرقام',
  },
  en: {
    required: 'This field is required',
    phone: 'Phone number must be 10 digits',
  },
};

export function ownerFormSchema(locale: 'ar' | 'en' = 'ar') {
  const t = messages[locale];

  return z.object({
    name: z.string().min(1, { message: t.required }),
    phone: z.string().regex(/^\d{10}$/, { message: t.phone }),
    city: z.string().min(1, { message: t.required }),
    unitType: z.string().min(1, { message: t.required }),
    unitCount: z.string().min(1, { message: t.required }),
  });
}

export type OwnerFormData = z.infer<ReturnType<typeof ownerFormSchema>>;

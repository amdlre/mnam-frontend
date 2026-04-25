'use server';

import { z } from 'zod';

import { DASHBOARD_ENDPOINTS } from '@/lib/api/dashboard/endpoints';
import { dashboardApi, DashboardApiException } from '@/lib/api/dashboard/fetcher';

const changePasswordSchema = z
  .object({
    currentPassword: z.string().min(1, 'كلمة المرور الحالية مطلوبة'),
    newPassword: z.string().min(6, 'يجب أن تكون كلمة المرور 6 أحرف على الأقل'),
    confirmPassword: z.string(),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: 'كلمة المرور الجديدة غير متطابقة',
    path: ['confirmPassword'],
  });

export type ChangePasswordInput = z.infer<typeof changePasswordSchema>;

export interface ChangePasswordResult {
  success: boolean;
  message?: string;
  errors?: Record<string, string[]>;
}

export async function changePasswordAction(
  input: ChangePasswordInput,
): Promise<ChangePasswordResult> {
  const parsed = changePasswordSchema.safeParse(input);
  if (!parsed.success) {
    return {
      success: false,
      errors: parsed.error.flatten().fieldErrors as Record<string, string[]>,
    };
  }
  try {
    await dashboardApi.post(DASHBOARD_ENDPOINTS.profile.changePassword, {
      current_password: parsed.data.currentPassword,
      new_password: parsed.data.newPassword,
    });
    return { success: true };
  } catch (error) {
    if (error instanceof DashboardApiException) {
      return { success: false, message: error.message };
    }
    return { success: false, message: 'unknownError' };
  }
}

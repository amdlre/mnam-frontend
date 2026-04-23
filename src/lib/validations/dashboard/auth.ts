import { z } from 'zod';

export const dashboardLoginSchema = z.object({
  username: z.string().min(1, { message: 'username_required' }),
  password: z.string().min(1, { message: 'password_required' }),
});

export type DashboardLoginFormData = z.infer<typeof dashboardLoginSchema>;

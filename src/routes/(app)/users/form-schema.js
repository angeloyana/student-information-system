import { z } from 'zod';

export const formSchema = z.object({
  firstName: z.string().min(2).max(64),
  lastName: z.string().min(2).max(64),
  role: z.enum(['superuser', 'admin']),
  email: z.string().email(),
  password: z.string().min(8),
});

export const updateFormSchema = formSchema.partial({
  password: true,
});

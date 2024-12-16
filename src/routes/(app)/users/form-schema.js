import { z } from 'zod';

export const formSchema = z.object({
  firstName: z
    .string()
    .trim()
    .min(1, { message: 'First name is required' })
    .max(128, { message: 'Must be less than 129 characters' }),
  lastName: z
    .string()
    .trim()
    .min(1, { message: 'Last name is required' })
    .max(128, { message: 'Must be less than 129 characters' }),
  role: z.enum(['superuser', 'admin']),
  email: z.string().email('Please enter a valid email'),
  password: z
    .string()
    .min(8, { message: 'Password must be greater than 8 characters' })
    .max(128, { message: 'Password must not exceed 129 characters' }),
});

export const updateFormSchema = formSchema.partial({
  password: true,
});

import { z } from 'zod';

export const generalFormSchema = z.object({
  firstName: z.string().min(2).max(64),
  lastName: z.string().min(2).max(64),
  email: z.string().email(),
});

export const passwordFormSchema = z
  .object({
    oldPassword: z.string(),
    newPassword: z.string().min(8),
    confirmNewPassword: z.string(),
  })
  .superRefine((data, ctx) => {
    if (data.newPassword != data.confirmNewPassword) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Passwords do not match',
        path: ['newPassword'],
      });
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Passwords do not match',
        path: ['confirmNewPassword'],
      });
    }
  });

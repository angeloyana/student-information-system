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
  email: z.string().email('Please enter a valid email'),
  classroomIds: z.array(z.string()),
  subjectIds: z.array(z.string()),
});

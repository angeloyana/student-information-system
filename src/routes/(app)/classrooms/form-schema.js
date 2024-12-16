import { z } from 'zod';

export const formSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, { message: 'Classroom name is required' })
    .max(128, { message: 'Must be less than 129 characters' }),
  subjectIds: z.array(z.string()),
  teacherId: z.string().nullable(),
});

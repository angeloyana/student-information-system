import { z } from 'zod';

export const formSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, { message: 'Subject name is required' })
    .max(128, { message: 'Must be less than 129 characters' }),
  classroomIds: z.array(z.string()),
  teacherIds: z.array(z.string()),
});

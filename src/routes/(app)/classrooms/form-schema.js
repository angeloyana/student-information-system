import { z } from 'zod';

export const formSchema = z.object({
  name: z.string().min(2).max(64),
  subjectIds: z.array(z.number()),
  teacherId: z.number().nullable(),
});

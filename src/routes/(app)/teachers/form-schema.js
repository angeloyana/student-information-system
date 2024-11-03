import { z } from 'zod';

export const formSchema = z.object({
  firstName: z.string().min(2).max(64),
  lastName: z.string().min(2).max(64),
  email: z.string().email(),
  classroomIds: z.array(z.number()),
  subjectIds: z.array(z.number()),
});

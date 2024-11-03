import { z } from 'zod';

export const formSchema = z.object({
  name: z.string().min(2).max(64),
  classroomIds: z.array(z.number()),
  teacherIds: z.array(z.number()),
});

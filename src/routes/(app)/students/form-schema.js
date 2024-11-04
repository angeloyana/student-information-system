import { z } from 'zod';

export const formSchema = z.object({
  firstName: z.string().min(2).max(64),
  lastName: z.string().min(2).max(64),
  sex: z.enum(['male', 'female']),
  birthDate: z.string().date(),
  email: z.string().email(),
  classroomId: z.string().nullable(),
});

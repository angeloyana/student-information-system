import { sql } from 'drizzle-orm';
import { superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import { fail, redirect } from '@sveltejs/kit';

import { db } from '$lib/server/db';
import {
  classrooms,
  subjects,
  teachers,
  subjectsToClassrooms,
} from '$lib/server/db/schema';
import { formSchema } from '../form-schema';

export const load = async ({ locals }) => {
  if (!locals.user) {
    redirect(302, '/auth/login');
  }

  const subjectsResult = await db.select().from(subjects);
  const teachersResult = await db
    .select({
      id: teachers.id,
      fullName: sql`${teachers.firstName} || ' ' || ${teachers.lastName}`,
    })
    .from(teachers);

  return {
    subjects: subjectsResult,
    teachers: teachersResult,
    form: await superValidate(zod(formSchema)),
  };
};

export const actions = {
  default: async (event) => {
    if (!event.locals.user) {
      redirect(302, '/auth/login');
    }

    const form = await superValidate(event, zod(formSchema));

    if (!form.valid) {
      return fail(400, {
        form,
      });
    }

    const { subjectIds, ...classroomData } = form.data;
    const [classroom] = await db
      .insert(classrooms)
      .values(classroomData)
      .returning();

    if (subjectIds.length) {
      await db.insert(subjectsToClassrooms).values(
        subjectIds.map((subjectId) => ({
          classroomId: classroom.id,
          subjectId,
        }))
      );
    }

    return {
      form,
    };
  },
};

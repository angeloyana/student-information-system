import { inArray, isNull } from 'drizzle-orm';
import { superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import { fail, redirect } from '@sveltejs/kit';

import { db } from '$lib/server/db';
import {
  classrooms,
  subjects,
  teachers,
  subjectsToTeachers,
} from '$lib/server/db/schema';
import { formSchema } from '../form-schema';
import { log } from '$lib/server/utils';

export const load = async ({ locals }) => {
  if (!locals.user) {
    redirect(302, '/auth/login');
  }

  const classroomsResult = await db
    .select()
    .from(classrooms)
    .where(isNull(classrooms.teacherId));
  const subjectsResult = await db.select().from(subjects);

  return {
    classrooms: classroomsResult,
    subjects: subjectsResult,
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

    const { classroomIds, subjectIds, ...teacherData } = form.data;
    const [teacher] = await db.insert(teachers).values(teacherData).returning();

    await db
      .update(classrooms)
      .set({ teacherId: teacher.id })
      .where(inArray(classrooms.id, classroomIds));

    if (subjectIds.length) {
      await db.insert(subjectsToTeachers).values(
        subjectIds.map((subjectId) => ({
          teacherId: teacher.id,
          subjectId,
        }))
      );
    }

    await log(event.locals.user.id, 'create', 'teacher', teacher.id);

    return {
      form,
    };
  },
};

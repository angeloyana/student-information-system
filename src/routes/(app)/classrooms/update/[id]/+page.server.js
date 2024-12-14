import { eq, sql } from 'drizzle-orm';
import { superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import { error, redirect } from '@sveltejs/kit';

import { db } from '$lib/server/db';
import {
  classrooms,
  subjects,
  teachers,
  subjectsToClassrooms,
} from '$lib/server/db/schema';
import { log } from '$lib/server/utils';
import { formSchema } from '../../form-schema';

export const load = async ({ locals, params }) => {
  if (!locals.user) {
    redirect(302, '/auth/login');
  }

  const result = await db
    .select()
    .from(classrooms)
    .where(eq(classrooms.id, params.id));

  if (!result[0]) {
    error(404);
  }

  const classroom = result[0];
  const subjectIds = (
    await db
      .select({ subjectId: subjectsToClassrooms.subjectId })
      .from(subjectsToClassrooms)
      .where(eq(subjectsToClassrooms.classroomId, classroom.id))
  ).map(({ subjectId }) => subjectId);
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
    form: await superValidate(
      {
        ...classroom,
        subjectIds,
      },
      zod(formSchema)
    ),
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
    const classroomId = event.params.id;

    await db
      .update(classrooms)
      .set(classroomData)
      .where(eq(classrooms.id, classroomId));

    await db
      .delete(subjectsToClassrooms)
      .where(eq(subjectsToClassrooms.classroomId, classroomId));

    if (subjectIds.length) {
      await db.insert(subjectsToClassrooms).values(
        subjectIds.map((subjectId) => ({
          classroomId,
          subjectId,
        }))
      );
    }

    await log(event.locals.user.id, 'update', 'classroom', classroomId);

    return {
      form,
    };
  },
};

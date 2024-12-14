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
  subjectsToTeachers,
} from '$lib/server/db/schema';
import { log } from '$lib/server/utils';
import { formSchema } from '../form-schema';

export const load = async ({ locals }) => {
  if (!locals.user) {
    redirect(302, '/auth/login');
  }

  const classroomsResult = await db.select().from(classrooms);
  const teachersResult = await db
    .select({
      id: teachers.id,
      fullName: sql`${teachers.firstName} || ' ' || ${teachers.lastName}`,
    })
    .from(teachers);

  return {
    classrooms: classroomsResult,
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

    const { classroomIds, teacherIds, ...subjectData } = form.data;
    const [subject] = await db.insert(subjects).values(subjectData).returning();

    if (classroomIds.length) {
      await db.insert(subjectsToClassrooms).values(
        classroomIds.map((classroomId) => ({
          classroomId,
          subjectId: subject.id,
        }))
      );
    }

    if (teacherIds.length) {
      await db.insert(subjectsToTeachers).values(
        teacherIds.map((teacherId) => ({
          teacherId,
          subjectId: subject.id,
        }))
      );
    }

    await log(event.locals.user.id, 'create', 'subject', subject.id);

    return {
      form,
    };
  },
};

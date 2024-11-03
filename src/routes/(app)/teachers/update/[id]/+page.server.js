import { eq, inArray, isNull, or } from 'drizzle-orm';
import { superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import { error } from '@sveltejs/kit';

import { db } from '$lib/server/db';
import {
  classrooms,
  subjects,
  teachers,
  subjectsToTeachers,
} from '$lib/server/db/schema';
import { formSchema } from '../../form-schema';

export const load = async ({ params }) => {
  const result = await db
    .select()
    .from(teachers)
    .where(eq(teachers.id, params.id));

  if (!result[0]) {
    error(404);
  }

  const teacher = result[0];
  const classroomIds = (
    await db
      .select({ id: classrooms.id })
      .from(classrooms)
      .where(eq(classrooms.teacherId, teacher.id))
  ).map(({ id }) => id);
  const subjectIds = (
    await db
      .select({ id: subjectsToTeachers.subjectId })
      .from(subjectsToTeachers)
      .where(eq(subjectsToTeachers.teacherId, teacher.id))
  ).map(({ id }) => id);
  const classroomsResult = await db
    .select()
    .from(classrooms)
    .where(
      or(isNull(classrooms.teacherId), eq(classrooms.teacherId, teacher.id))
    );
  const subjectsResult = await db.select().from(subjects);

  return {
    classrooms: classroomsResult,
    subjects: subjectsResult,
    form: await superValidate(
      {
        ...teacher,
        classroomIds,
        subjectIds,
      },
      zod(formSchema)
    ),
  };
};

export const actions = {
  default: async (event) => {
    const form = await superValidate(event, zod(formSchema));

    if (!form.valid) {
      return fail(400, {
        form,
      });
    }

    const { classroomIds, subjectIds, ...teacherData } = form.data;
    const teacherId = event.params.id;

    await db
      .update(teachers)
      .set(teacherData)
      .where(eq(teachers.id, teacherId));

    await db
      .update(classrooms)
      .set({ teacherId: null })
      .where(eq(classrooms.teacherId, teacherId));

    await db
      .update(classrooms)
      .set({ teacherId: teacherId })
      .where(inArray(classrooms.id, classroomIds));

    await db
      .delete(subjectsToTeachers)
      .where(eq(subjectsToTeachers.teacherId, teacherId));

    if (subjectIds.length) {
      await db.insert(subjectsToTeachers).values(
        subjectIds.map((subjectId) => ({
          teacherId: teacherId,
          subjectId,
        }))
      );
    }

    return {
      form,
    };
  },
};

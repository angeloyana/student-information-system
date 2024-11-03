import { eq, sql } from 'drizzle-orm';
import { superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import { error } from '@sveltejs/kit';

import { db } from '$lib/server/db';
import {
  classrooms,
  subjects,
  teachers,
  subjectsToClassrooms,
  subjectsToTeachers,
} from '$lib/server/db/schema';
import { formSchema } from '../../form-schema';

export const load = async ({ params }) => {
  const result = await db
    .select()
    .from(subjects)
    .where(eq(subjects.id, params.id));

  if (!result[0]) {
    error(404);
  }

  const subject = result[0];
  const classroomIds = (
    await db
      .select({ id: subjectsToClassrooms.classroomId })
      .from(subjectsToClassrooms)
      .where(eq(subjectsToClassrooms.subjectId, subject.id))
  ).map(({ id }) => id);
  const teacherIds = (
    await db
      .select({ id: subjectsToTeachers.teacherId })
      .from(subjectsToTeachers)
      .where(eq(subjectsToTeachers.subjectId, subject.id))
  ).map(({ id }) => id);
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
    form: await superValidate(
      {
        ...subject,
        classroomIds,
        teacherIds,
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

    const { classroomIds, teacherIds, ...subjectData } = form.data;
    const subjectId = event.params.id;

    await db
      .update(subjects)
      .set(subjectData)
      .where(eq(subjects.id, event.params.id));

    await db
      .delete(subjectsToClassrooms)
      .where(eq(subjectsToClassrooms.subjectId, subjectId));

    await db
      .delete(subjectsToTeachers)
      .where(eq(subjectsToTeachers.subjectId, subjectId));

    if (classroomIds.length) {
      await db.insert(subjectsToClassrooms).values(
        classroomIds.map((classroomId) => ({
          classroomId,
          subjectId,
        }))
      );
    }

    if (teacherIds.length) {
      await db.insert(subjectsToTeachers).values(
        teacherIds.map((teacherId) => ({
          teacherId,
          subjectId,
        }))
      );
    }

    return {
      form,
    };
  },
};

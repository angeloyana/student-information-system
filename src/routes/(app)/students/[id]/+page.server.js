import { eq, getTableColumns } from 'drizzle-orm';
import { error, redirect } from '@sveltejs/kit';

import { db } from '$lib/server/db';
import { classrooms, students } from '$lib/server/db/schema';

export const load = async ({ locals, params }) => {
  if (!locals.user) {
    redirect(302, '/auth/login');
  }

  const result = await db
    .select({
      ...getTableColumns(students),
      classroom: getTableColumns(classrooms),
    })
    .from(students)
    .leftJoin(classrooms, eq(students.classroomId, classrooms.id))
    .where(eq(students.id, params.id));

  if (!result[0]) {
    error(404);
  }

  return {
    student: result[0],
  };
};

import { eq, getTableColumns, sql } from 'drizzle-orm';
import { error, redirect } from '@sveltejs/kit';

import { db } from '$lib/server/db';
import { classrooms, teachers } from '$lib/server/db/schema';

export const load = async ({ locals, params }) => {
  if (!locals.user) {
    redirect(302, '/auth/login');
  }

  const result = await db
    .select({
      ...getTableColumns(classrooms),
      teacher: {
        fullName: sql`${teachers.firstName} || ' ' || ${teachers.lastName}`,
      },
    })
    .from(classrooms)
    .leftJoin(teachers, eq(classrooms.teacherId, teachers.id))
    .where(eq(classrooms.id, params.id));

  if (!result[0]) {
    error(404);
  }

  return {
    classroom: result[0],
  };
};

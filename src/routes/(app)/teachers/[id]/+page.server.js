import { eq } from 'drizzle-orm';
import { error, redirect } from '@sveltejs/kit';

import { db } from '$lib/server/db';
import { teachers } from '$lib/server/db/schema';

export const load = async ({ locals, params }) => {
  if (!locals.user) {
    redirect(302, '/auth/login');
  }

  const result = await db
    .select()
    .from(teachers)
    .where(eq(teachers.id, params.id));

  if (!result[0]) {
    error(404);
  }

  return {
    teacher: result[0],
  };
};

import { eq } from 'drizzle-orm';
import { error, redirect } from '@sveltejs/kit';

import { db } from '$lib/server/db';
import { subjects } from '$lib/server/db/schema';

export const load = async ({ locals, params }) => {
  if (!locals.user) {
    redirect(302, '/auth/login');
  }

  const result = await db
    .select()
    .from(subjects)
    .where(eq(subjects.id, params.id));

  if (!result[0]) {
    error(404);
  }

  return {
    subject: result[0],
  };
};

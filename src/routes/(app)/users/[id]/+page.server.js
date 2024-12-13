import { eq } from 'drizzle-orm';
import { error, redirect } from '@sveltejs/kit';

import { db } from '$lib/server/db';
import { users } from '$lib/server/db/schema';

export const load = async ({ locals, params }) => {
  if (!locals.user) {
    redirect(302, '/auth/login');
  }

  if (locals.user.role != 'superuser') {
    error(401, 'Unauthorized');
  }

  const result = await db.select().from(users).where(eq(users.id, params.id));

  if (!result[0]) {
    error(404);
  }

  return {
    user: result[0],
  };
};

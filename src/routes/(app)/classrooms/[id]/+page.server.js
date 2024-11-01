import { eq } from 'drizzle-orm';
import { error } from '@sveltejs/kit';

import { db } from '$lib/server/db';
import { classrooms } from '$lib/server/db/schema';

export const load = async ({ params }) => {
  const result = await db
    .select()
    .from(classrooms)
    .where(eq(classrooms.id, params.id));

  if (!result[0]) {
    error(404);
  }

  return {
    classroom: result[0],
  };
};

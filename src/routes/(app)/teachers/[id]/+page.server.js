import { eq, getTableColumns } from 'drizzle-orm';
import { error } from '@sveltejs/kit';

import { db } from '$lib/server/db';
import { teachers } from '$lib/server/db/schema';

export const load = async ({ params }) => {
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

import { eq, getTableColumns, sql } from 'drizzle-orm';
import { error, redirect } from '@sveltejs/kit';

import { db } from '$lib/server/db';
import { activityLogs, users } from '$lib/server/db/schema';

export const load = async ({ locals, params }) => {
  if (!locals.user) {
    redirect(302, '/auth/login');
  }

  if (locals.user.role != 'superuser') {
    error(401, 'Unauthorized');
  }

  const result = await db
    .select({
      ...getTableColumns(activityLogs),
      user: {
        id: users.id,
        fullName: sql`${users.firstName} || ' ' || ${users.lastName}`,
        role: users.role,
      },
    })
    .from(activityLogs)
    .leftJoin(users, eq(activityLogs.userId, users.id))
    .where(eq(activityLogs.id, params.id));

  if (!result[0]) {
    error(404);
  }

  return {
    activityLog: result[0],
  };
};

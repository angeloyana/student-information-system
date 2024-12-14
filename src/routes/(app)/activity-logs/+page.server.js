import {
  asc,
  count,
  desc,
  eq,
  getTableColumns,
  inArray,
  like,
  or,
  sql,
} from 'drizzle-orm';
import { error, redirect } from '@sveltejs/kit';

import { db } from '$lib/server/db';
import { activityLogs, users } from '$lib/server/db/schema';
import { log } from '$lib/server/utils';

export const load = async ({ locals, url }) => {
  if (!locals.user) {
    redirect(302, '/auth/login');
  }

  if (locals.user.role != 'superuser') {
    error(401, 'Unauthorized');
  }

  const limit = parseInt(url.searchParams.get('limit')) || 5;
  const offset = parseInt(url.searchParams.get('skip')) || 0;
  let sortId = url.searchParams.get('sort');
  let order = url.searchParams.get('order');

  const id = url.searchParams.get('id');
  const action = url.searchParams.get('action');
  const objectType = url.searchParams.get('objectType');
  const objectId = url.searchParams.get('objectId');
  const userId = url.searchParams.get('userId');
  const userRole = url.searchParams.get('userRole');

  const filters = [];
  const columnFilters = []; // to be used in client-side
  let orderBy = null;

  if (id) {
    filters.push(eq(activityLogs.id, id));
    columnFilters.push({ id: 'id', value: id });
  }

  if (action) {
    filters.push(
      like(sql`LOWER(${activityLogs.action})`, `%${action.toLowerCase()}%`)
    );
    columnFilters.push({ id: 'action', value: action });
  }

  if (objectType) {
    filters.push(
      like(
        sql`LOWER(${activityLogs.objectType})`,
        `%${objectType.toLowerCase()}%`
      )
    );
    columnFilters.push({ id: 'objectType', value: objectType });
  }

  if (objectId) {
    filters.push(eq(activityLogs.objectId, objectId));
    columnFilters.push({ id: 'objectId', value: objectId });
  }

  if (userId) {
    filters.push(eq(activityLogs.userId, userId));
    columnFilters.push({ id: 'userId', value: userId });
  }

  if (userRole) {
    filters.push(
      like(sql`LOWER(${users.role})`, `%${userRole.toLowerCase()}%`)
    );
    columnFilters.push({ id: 'userRole', value: userRole });
  }

  if (order && sortId in activityLogs) {
    orderBy =
      order === 'desc' ? desc(activityLogs[sortId]) : asc(activityLogs[sortId]);
  } else {
    sortId = null;
    order = null;
  }

  const [activityLogsResult, activityLogsCount] = await Promise.all([
    db
      .select({
        ...getTableColumns(activityLogs),
        user: {
          fullName: sql`${users.firstName} || ' ' || ${users.lastName}`,
          role: users.role,
        },
      })
      .from(activityLogs)
      .leftJoin(users, eq(activityLogs.userId, users.id))
      .where(or(...filters))
      .orderBy(orderBy)
      .limit(limit)
      .offset(offset),
    db
      .select({ count: count() })
      .from(activityLogs)
      .leftJoin(users, eq(activityLogs.userId, users.id))
      .where(or(...filters)),
  ]);

  return {
    activityLogs: activityLogsResult,
    columnFilters,
    pageCount: Math.ceil(activityLogsCount[0].count / limit),
    pageSize: limit,
    sortId,
    order,
  };
};

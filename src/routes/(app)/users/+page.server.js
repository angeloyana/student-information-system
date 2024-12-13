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
import { users } from '$lib/server/db/schema';

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
  const firstName = url.searchParams.get('firstName');
  const lastName = url.searchParams.get('lastName');
  const role = url.searchParams.get('role');
  const email = url.searchParams.get('email');

  const filters = [];
  const columnFilters = []; // to be used in client-side
  let orderBy = null;

  if (id) {
    filters.push(eq(users.id, id));
    columnFilters.push({ id: 'id', value: id });
  }

  if (firstName) {
    filters.push(
      like(sql`LOWER(${users.firstName})`, `%${firstName.toLowerCase()}%`)
    );
    columnFilters.push({ id: 'firstName', value: firstName });
  }

  if (lastName) {
    filters.push(
      like(sql`LOWER(${users.lastName})`, `%${lastName.toLowerCase()}%`)
    );
    columnFilters.push({ id: 'lastName', value: lastName });
  }

  if (role) {
    filters.push(like(sql`LOWER(${users.role})`, `%${role.toLowerCase()}%`));
    columnFilters.push({ id: 'role', value: role });
  }

  if (email) {
    filters.push(like(sql`LOWER(${users.email})`, `%${email.toLowerCase()}%`));
    columnFilters.push({ id: 'email', value: email });
  }

  if (order && sortId in users) {
    orderBy = order === 'desc' ? desc(users[sortId]) : asc(users[sortId]);
  } else {
    sortId = null;
    order = null;
  }

  const [usersResult, usersCount] = await Promise.all([
    db
      .select(getTableColumns(users))
      .from(users)
      .where(or(...filters))
      .orderBy(orderBy)
      .limit(limit)
      .offset(offset),
    db
      .select({ count: count() })
      .from(users)
      .where(or(...filters)),
  ]);

  return {
    users: usersResult,
    columnFilters,
    pageCount: Math.ceil(usersCount.length / limit),
    pageSize: limit,
    sortId,
    order,
  };
};

export const actions = {
  delete: async ({ locals, request }) => {
    if (!locals.user) {
      redirect(302, '/auth/login');
    }

    if (locals.user.role != 'superuser') {
      error(401, 'Unauthorized');
    }

    const formData = await request.formData();
    const ids = formData.getAll('id');

    await db.delete(users).where(inArray(users.id, ids));

    return { success: true };
  },
};

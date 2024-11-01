import { asc, count, desc, inArray, like, or, sql } from 'drizzle-orm';

import { db } from '$lib/server/db';
import { classrooms } from '$lib/server/db/schema';

export const load = async ({ url }) => {
  const limit = parseInt(url.searchParams.get('limit')) || 5;
  const offset = parseInt(url.searchParams.get('skip')) || 0;
  let sortId = url.searchParams.get('sort');
  let order = url.searchParams.get('order');

  const name = url.searchParams.get('name');

  const filters = [];
  const columnFilters = [];
  let orderBy = null;

  if (name) {
    filters.push(
      like(sql`LOWER(${classrooms.name})`, `%${name.toLowerCase()}%`)
    );
    columnFilters.push({ id: 'name', value: name });
  }

  if (order && sortId in classrooms) {
    orderBy =
      order === 'desc' ? desc(classrooms[sortId]) : asc(classrooms[sortId]);
  } else {
    sortId = null;
    order = null;
  }

  const [classroomsResult, classroomsCount] = await Promise.all([
    db
      .select()
      .from(classrooms)
      .where(or(...filters))
      .orderBy(orderBy)
      .limit(limit)
      .offset(offset),
    db
      .select({ count: count() })
      .from(classrooms)
      .where(or(...filters)),
  ]);

  return {
    classrooms: classroomsResult,
    columnFilters,
    pageCount: Math.floor(classroomsCount[0].count / limit) + 1,
    pageSize: limit,
    sortId,
    order,
  };
};

export const actions = {
  delete: async ({ request }) => {
    const formData = await request.formData();
    const ids = formData.getAll('id');

    await db.delete(classrooms).where(inArray(classrooms.id, ids));

    return { success: true };
  },
};

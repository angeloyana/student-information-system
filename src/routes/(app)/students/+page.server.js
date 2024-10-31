import { asc, count, desc, inArray, like, or, sql } from 'drizzle-orm';

import { db } from '$lib/server/db';
import { students } from '$lib/server/db/schema';

export const load = async ({ url }) => {
  const limit = parseInt(url.searchParams.get('limit')) || 5;
  const offset = parseInt(url.searchParams.get('skip')) || 0;
  const sortId = url.searchParams.get('sort');
  const order = url.searchParams.get('order');
  const filter = url.searchParams.get('q') ?? '';

  const orderBy = [];
  let filterObj;

  if (order && sortId in students) {
    orderBy.push(
      order === 'desc' ? desc(students[sortId]) : asc(students[sortId])
    );
  }

  if (filter) {
    filterObj = or(
      like(sql`LOWER(${students.firstName})`, `%${filter.toLowerCase()}%`),
      like(sql`LOWER(${students.lastName})`, `%${filter.toLowerCase()}%`),
      like(sql`LOWER(${students.email})`, `%${filter.toLowerCase()}%`)
    );
  }

  const [studentsResult, studentsCount] = await Promise.all([
    db.query.students.findMany({ limit, offset, orderBy, where: filterObj }),
    db.select({ count: count() }).from(students).where(filterObj),
  ]);

  return {
    students: studentsResult,
    filter,
    pageCount: Math.floor(studentsCount[0].count / limit) + 1,
    pageSize: limit,
  };
};

export const actions = {
  delete: async ({ request }) => {
    const formData = await request.formData();
    const ids = formData.getAll('id');

    await db.delete(students).where(inArray(students.id, ids));

    return { success: true };
  },
};

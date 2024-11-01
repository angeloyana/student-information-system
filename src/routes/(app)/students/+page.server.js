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

import { db } from '$lib/server/db';
import { classrooms, students } from '$lib/server/db/schema';

export const load = async ({ url }) => {
  const limit = parseInt(url.searchParams.get('limit')) || 5;
  const offset = parseInt(url.searchParams.get('skip')) || 0;
  let sortId = url.searchParams.get('sort');
  let order = url.searchParams.get('order');

  const firstName = url.searchParams.get('firstName');
  const lastName = url.searchParams.get('lastName');
  const sex = url.searchParams.get('sex');
  const email = url.searchParams.get('email');
  const classroomName = url.searchParams.get('classroomName');

  const filters = [];
  const columnFilters = []; // to be used in client-side
  let orderBy = null;

  if (firstName) {
    filters.push(
      like(sql`LOWER(${students.firstName})`, `%${firstName.toLowerCase()}%`)
    );
    columnFilters.push({ id: 'firstName', value: firstName });
  }

  if (lastName) {
    filters.push(
      like(sql`LOWER(${students.lastName})`, `%${lastName.toLowerCase()}%`)
    );
    columnFilters.push({ id: 'lastName', value: lastName });
  }

  if (sex) {
    filters.push(like(sql`LOWER(${students.sex})`, `%${sex.toLowerCase()}%`));
    columnFilters.push({ id: 'sex', value: sex });
  }

  if (email) {
    filters.push(
      like(sql`LOWER(${students.email})`, `%${email.toLowerCase()}%`)
    );
    columnFilters.push({ id: 'email', value: email });
  }

  if (classroomName) {
    filters.push(
      like(sql`LOWER(${classrooms.name})`, `%${classroomName.toLowerCase()}%`)
    );
    columnFilters.push({ id: 'classroomName', value: classroomName });
  }

  if (order && sortId in students) {
    orderBy = order === 'desc' ? desc(students[sortId]) : asc(students[sortId]);
  } else {
    sortId = null;
    order = null;
  }

  const [studentsResult, studentsCount] = await Promise.all([
    db
      .select({
        ...getTableColumns(students),
        classroom: getTableColumns(classrooms),
      })
      .from(students)
      .leftJoin(classrooms, eq(students.classroomId, classrooms.id))
      .where(or(...filters))
      .orderBy(orderBy)
      .limit(limit)
      .offset(offset),
    db
      .select({ count: count() })
      .from(students)
      .leftJoin(classrooms, eq(students.classroomId, classrooms.id))
      .where(or(...filters)),
  ]);

  return {
    students: studentsResult,
    columnFilters,
    pageCount: Math.floor(studentsCount[0].count / limit) + 1,
    pageSize: limit,
    sortId,
    order,
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

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
import { redirect } from '@sveltejs/kit';

import { db } from '$lib/server/db';
import { classrooms, students } from '$lib/server/db/schema';
import { log } from '$lib/server/utils';

export const load = async ({ locals, url }) => {
  if (!locals.user) {
    redirect(302, '/auth/login');
  }

  const limit = parseInt(url.searchParams.get('limit')) || 5;
  const offset = parseInt(url.searchParams.get('skip')) || 0;
  let sortId = url.searchParams.get('sort');
  let order = url.searchParams.get('order');

  const id = url.searchParams.get('id');
  const firstName = url.searchParams.get('firstName');
  const lastName = url.searchParams.get('lastName');
  const sex = url.searchParams.get('sex');
  const email = url.searchParams.get('email');
  const classroomId = url.searchParams.get('classroomId');

  const filters = [];
  const columnFilters = []; // to be used in client-side
  let orderBy = null;

  if (id) {
    filters.push(eq(students.id, id));
    columnFilters.push({ id: 'id', value: id });
  }

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

  if (classroomId) {
    filters.push(eq(students.classroomId, classroomId));
    columnFilters.push({ id: 'classroomId', value: classroomId });
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
    pageCount: Math.ceil(studentsCount[0].count / limit),
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

    const formData = await request.formData();
    const ids = formData.getAll('id');

    await db.delete(students).where(inArray(students.id, ids));
    for (const id of ids) {
      await log(locals.user.id, 'delete', 'student', id);
    }

    return { success: true };
  },
};

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
import {
  classrooms,
  teachers,
  subjectsToTeachers,
} from '$lib/server/db/schema';
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
  const email = url.searchParams.get('email');
  const classroomId = url.searchParams.get('classroomId');
  const subjectId = url.searchParams.get('subjectId');

  const filters = [];
  const columnFilters = []; // to be used in client-side
  let orderBy = null;

  if (id) {
    filters.push(eq(teachers.id, id));
    columnFilters.push({ id: 'id', value: id });
  }

  if (firstName) {
    filters.push(
      like(sql`LOWER(${teachers.firstName})`, `%${firstName.toLowerCase()}%`)
    );
    columnFilters.push({ id: 'firstName', value: firstName });
  }

  if (lastName) {
    filters.push(
      like(sql`LOWER(${teachers.lastName})`, `%${lastName.toLowerCase()}%`)
    );
    columnFilters.push({ id: 'lastName', value: lastName });
  }

  if (email) {
    filters.push(
      like(sql`LOWER(${teachers.email})`, `%${email.toLowerCase()}%`)
    );
    columnFilters.push({ id: 'email', value: email });
  }

  if (classroomId) {
    filters.push(eq(classrooms.id, classroomId));
    columnFilters.push({ id: 'classroomId', value: classroomId });
  }

  if (subjectId) {
    filters.push(eq(subjectsToTeachers.subjectId, subjectId));
    columnFilters.push({ id: 'subjectId', value: subjectId });
  }

  if (order && sortId in teachers) {
    orderBy = order === 'desc' ? desc(teachers[sortId]) : asc(teachers[sortId]);
  } else {
    sortId = null;
    order = null;
  }

  const [teachersResult, teachersCount] = await Promise.all([
    db
      .select(getTableColumns(teachers))
      .from(teachers)
      .leftJoin(classrooms, eq(classrooms.teacherId, teachers.id))
      .leftJoin(
        subjectsToTeachers,
        eq(subjectsToTeachers.teacherId, teachers.id)
      )
      .where(or(...filters))
      .groupBy(teachers.id)
      .orderBy(orderBy)
      .limit(limit)
      .offset(offset),
    db
      .select({ count: count() })
      .from(teachers)
      .leftJoin(classrooms, eq(classrooms.teacherId, teachers.id))
      .leftJoin(
        subjectsToTeachers,
        eq(subjectsToTeachers.teacherId, teachers.id)
      )
      .where(or(...filters))
      .groupBy(teachers.id),
  ]);

  return {
    teachers: teachersResult,
    columnFilters,
    pageCount: Math.ceil(teachersCount.length / limit),
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

    await db.delete(teachers).where(inArray(teachers.id, ids));
    for (const id of ids) {
      await log(locals.user.id, 'delete', 'teacher', id);
    }

    return { success: true };
  },
};

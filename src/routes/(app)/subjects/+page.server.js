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
  subjects,
  subjectsToClassrooms,
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
  const name = url.searchParams.get('name');
  const classroomId = url.searchParams.get('classroomId');
  const teacherId = url.searchParams.get('teacherId');

  const filters = [];
  const columnFilters = [];
  let orderBy = null;

  if (id) {
    filters.push(eq(subjects.id, id));
    columnFilters.push({ id: 'id', value: id });
  }

  if (name) {
    filters.push(like(sql`LOWER(${subjects.name})`, `%${name.toLowerCase()}%`));
    columnFilters.push({ id: 'name', value: name });
  }

  if (classroomId) {
    filters.push(eq(subjectsToClassrooms.classroomId, classroomId));
    columnFilters.push({ id: 'classroomId', value: classroomId });
  }

  if (teacherId) {
    filters.push(eq(subjectsToTeachers.teacherId, teacherId));
    columnFilters.push({ id: 'teacherId', value: teacherId });
  }

  if (order && sortId in subjects) {
    orderBy = order === 'desc' ? desc(subjects[sortId]) : asc(subjects[sortId]);
  } else {
    sortId = null;
    order = null;
  }

  const [subjectsResult, subjectsCount] = await Promise.all([
    db
      .select(getTableColumns(subjects))
      .from(subjects)
      .leftJoin(
        subjectsToClassrooms,
        eq(subjectsToClassrooms.subjectId, subjects.id)
      )
      .leftJoin(
        subjectsToTeachers,
        eq(subjectsToTeachers.subjectId, subjects.id)
      )
      .where(or(...filters))
      .groupBy(subjects.id)
      .orderBy(orderBy)
      .limit(limit)
      .offset(offset),
    db
      .select({ count: count() })
      .from(subjects)
      .leftJoin(
        subjectsToClassrooms,
        eq(subjectsToClassrooms.subjectId, subjects.id)
      )
      .leftJoin(
        subjectsToTeachers,
        eq(subjectsToTeachers.subjectId, subjects.id)
      )
      .where(or(...filters))
      .groupBy(subjects.id),
  ]);

  return {
    subjects: subjectsResult,
    columnFilters,
    pageCount: Math.ceil(subjectsCount.length / limit),
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

    await db.delete(subjects).where(inArray(subjects.id, ids));
    for (const id of ids) {
      await log(locals.user.id, 'delete', 'subject', id);
    }

    return { success: true };
  },
};

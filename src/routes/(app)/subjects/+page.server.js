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
import {
  classrooms,
  subjects,
  subjectsToClassrooms,
  subjectsToTeachers,
} from '$lib/server/db/schema';

export const load = async ({ url }) => {
  const limit = parseInt(url.searchParams.get('limit')) || 5;
  const offset = parseInt(url.searchParams.get('skip')) || 0;
  let sortId = url.searchParams.get('sort');
  let order = url.searchParams.get('order');

  const name = url.searchParams.get('name');
  const classroomName = url.searchParams.get('classroomName');
  const teacherId = parseInt(url.searchParams.get('teacherId'));

  const filters = [];
  const columnFilters = [];
  let orderBy = null;

  if (name) {
    filters.push(like(sql`LOWER(${subjects.name})`, `%${name.toLowerCase()}%`));
    columnFilters.push({ id: 'name', value: name });
  }

  if (classroomName) {
    filters.push(
      like(sql`LOWER(${classrooms.name})`, `%${classroomName.toLowerCase()}%`)
    );
    columnFilters.push({ id: 'classroomName', value: classroomName });
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
      .leftJoin(classrooms, eq(subjectsToClassrooms.classroomId, classrooms.id))
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
      .leftJoin(classrooms, eq(subjectsToClassrooms.classroomId, classrooms.id))
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
  delete: async ({ request }) => {
    const formData = await request.formData();
    const ids = formData.getAll('id');

    await db.delete(subjects).where(inArray(subjects.id, ids));

    return { success: true };
  },
};

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
  students,
  subjects,
  teachers,
  subjectsToClassrooms,
} from '$lib/server/db/schema';

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
  const studentId = url.searchParams.get('studentId');
  const subjectId = url.searchParams.get('subjectId');
  const teacherId = url.searchParams.get('teacherId');

  const filters = [];
  const columnFilters = [];
  let orderBy = null;

  if (id) {
    filters.push(eq(classrooms.id, id));
    columnFilters.push({ id: 'id', value: id });
  }

  if (name) {
    filters.push(
      like(sql`LOWER(${classrooms.name})`, `%${name.toLowerCase()}%`)
    );
    columnFilters.push({ id: 'name', value: name });
  }

  if (studentId) {
    filters.push(eq(students.id, studentId));
    columnFilters.push({ id: 'studentId', value: studentId });
  }

  if (subjectId) {
    filters.push(eq(subjectsToClassrooms.subjectId, subjectId));
    columnFilters.push({ id: 'subjectId', value: subjectId });
  }

  if (teacherId) {
    filters.push(eq(teachers.id, teacherId));
    columnFilters.push({ id: 'teacherId', value: teacherId });
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
      .select({
        ...getTableColumns(classrooms),
        teacher: {
          fullName: sql`${teachers.firstName} || ' ' || ${teachers.lastName}`,
        },
      })
      .from(classrooms)
      .leftJoin(students, eq(classrooms.id, students.classroomId))
      .leftJoin(teachers, eq(classrooms.teacherId, teachers.id))
      .leftJoin(
        subjectsToClassrooms,
        eq(subjectsToClassrooms.classroomId, classrooms.id)
      )
      .where(or(...filters))
      .groupBy(classrooms.id)
      .orderBy(orderBy)
      .limit(limit)
      .offset(offset),
    db
      .select({ count: count() })
      .from(classrooms)
      .leftJoin(students, eq(classrooms.id, students.classroomId))
      .leftJoin(teachers, eq(classrooms.teacherId, teachers.id))
      .leftJoin(
        subjectsToClassrooms,
        eq(subjectsToClassrooms.classroomId, classrooms.id)
      )
      .where(or(...filters))
      .groupBy(classrooms.id),
  ]);

  return {
    classrooms: classroomsResult,
    columnFilters,
    pageCount: Math.ceil(classroomsCount.length / limit),
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

    await db.delete(classrooms).where(inArray(classrooms.id, ids));

    return { success: true };
  },
};

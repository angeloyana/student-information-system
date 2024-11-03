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
  subjects,
  teachers,
  subjectsToTeachers,
} from '$lib/server/db/schema';

export const load = async ({ locals, url }) => {
  if (!locals.user) {
    redirect(302, '/auth/login');
  }

  const limit = parseInt(url.searchParams.get('limit')) || 5;
  const offset = parseInt(url.searchParams.get('skip')) || 0;
  let sortId = url.searchParams.get('sort');
  let order = url.searchParams.get('order');

  const firstName = url.searchParams.get('firstName');
  const lastName = url.searchParams.get('lastName');
  const email = url.searchParams.get('email');
  const classroomName = url.searchParams.get('classroomName');
  const subjectName = url.searchParams.get('subjectName');

  const filters = [];
  const columnFilters = []; // to be used in client-side
  let orderBy = null;

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

  if (classroomName) {
    filters.push(
      like(sql`LOWER(${classrooms.name})`, `%${classroomName.toLowerCase()}%`)
    );
    columnFilters.push({ id: 'classroomName', value: classroomName });
  }

  if (subjectName) {
    filters.push(
      like(sql`LOWER(${subjects.name})`, `%${subjectName.toLowerCase()}%`)
    );
    columnFilters.push({ id: 'subjectName', value: subjectName });
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
      .leftJoin(subjects, eq(subjectsToTeachers.subjectId, subjects.id))
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
      .leftJoin(subjects, eq(subjectsToTeachers.subjectId, subjects.id))
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

    return { success: true };
  },
};

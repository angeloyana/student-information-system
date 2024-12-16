import { count, desc, eq, getTableColumns, sql } from 'drizzle-orm';
import { redirect } from '@sveltejs/kit';

import { db } from '$lib/server/db';
import {
  activityLogs,
  classrooms,
  students,
  teachers,
  users,
} from '$lib/server/db/schema';

export const load = async ({ locals }) => {
  if (!locals.user) {
    redirect(302, '/auth/login');
  }

  const [
    studentsCount,
    maleStudentsCount,
    femaleStudentsCount,
    classroomsCount,
    teachersCount,
  ] = await Promise.all([
    db.select({ count: count() }).from(students),
    db
      .select({ count: count() })
      .from(students)
      .where(eq(students.sex, 'male')),
    db
      .select({ count: count() })
      .from(students)
      .where(eq(students.sex, 'female')),
    db.select({ count: count() }).from(classrooms),
    db.select({ count: count() }).from(teachers),
  ]);
  let totalUsers = null;
  let recentActivities = null;
  if (locals.user.role == 'superuser') {
    totalUsers = (await db.select({ count: count() }).from(users))[0].count;
    recentActivities = await db
      .select({
        ...getTableColumns(activityLogs),
        user: {
          fullName: sql`${users.firstName} || ' ' || ${users.lastName}`,
          role: users.role,
        },
      })
      .from(activityLogs)
      .leftJoin(users, eq(activityLogs.userId, users.id))
      .orderBy(desc(activityLogs.timestamp))
      .limit(5);
  }

  return {
    totalStudents: studentsCount[0].count,
    totalMaleStudents: maleStudentsCount[0].count,
    totalFemaleStudents: femaleStudentsCount[0].count,
    totalClassrooms: classroomsCount[0].count,
    totalTeachers: teachersCount[0].count,
    totalUsers,
    recentActivities,
  };
};

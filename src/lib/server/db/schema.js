import { v4 as uuidv4 } from 'uuid';
import {
  sqliteTable,
  text,
  integer,
  primaryKey,
} from 'drizzle-orm/sqlite-core';

export const students = sqliteTable('students', {
  id: text('id')
    .primaryKey()
    .$defaultFn(() => uuidv4()),
  firstName: text('first_name').notNull(),
  lastName: text('last_name').notNull(),
  sex: text('sex').notNull(),
  birthDate: integer('birth_date', { mode: 'timestamp' }).notNull(),
  email: text('email').notNull().unique(),
  classroomId: text('classroom_id').references(() => classrooms.id, {
    onDelete: 'set null',
  }),
});

export const teachers = sqliteTable('teachers', {
  id: text('id')
    .primaryKey()
    .$defaultFn(() => uuidv4()),
  firstName: text('first_name').notNull(),
  lastName: text('last_name').notNull(),
  email: text('email').notNull().unique(),
});

export const classrooms = sqliteTable('classrooms', {
  id: text('id')
    .primaryKey()
    .$defaultFn(() => uuidv4()),
  name: text('name').notNull().unique(),
  teacherId: text('teacher_id').references(() => teachers.id, {
    onDelete: 'set null',
  }),
});

export const subjects = sqliteTable('subjects', {
  id: text('id')
    .primaryKey()
    .$defaultFn(() => uuidv4()),
  name: text('name').notNull().unique(),
});

export const subjectsToClassrooms = sqliteTable(
  'subjects_to_classrooms',
  {
    classroomId: text('classroom_id')
      .notNull()
      .references(() => classrooms.id, { onDelete: 'cascade' }),
    subjectId: text('subject_id')
      .notNull()
      .references(() => subjects.id, { onDelete: 'cascade' }),
  },
  (table) => ({
    pk: primaryKey(table.classroomId, table.subjectId),
  })
);

export const subjectsToTeachers = sqliteTable(
  'subjects_to_teachers',
  {
    teacherId: text('teacher_id')
      .notNull()
      .references(() => teachers.id, { onDelete: 'cascade' }),
    subjectId: text('subject_id')
      .notNull()
      .references(() => subjects.id, { onDelete: 'cascade' }),
  },
  (table) => ({
    pk: primaryKey(table.teacherId, table.subjectId),
  })
);

export const users = sqliteTable('users', {
  id: text('id')
    .primaryKey()
    .$defaultFn(() => uuidv4()),
  firstName: text('first_name').notNull(),
  lastName: text('last_name').notNull(),
  email: text('email').notNull().unique(),
  password: text('password').notNull(),
});

export const sessions = sqliteTable('sessions', {
  id: text('id')
    .primaryKey()
    .$defaultFn(() => uuidv4()),
  userId: text('user_id')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  expiresAt: integer('expires_at').notNull(),
});

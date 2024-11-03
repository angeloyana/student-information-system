import {
  sqliteTable,
  text,
  integer,
  primaryKey,
} from 'drizzle-orm/sqlite-core';
import { generateId } from 'lucia';

export const students = sqliteTable('students', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  firstName: text('first_name').notNull(),
  lastName: text('last_name').notNull(),
  sex: text('sex').notNull(),
  birthDate: integer('birth_date', { mode: 'timestamp' }).notNull(),
  email: text('email').notNull(),
  classroomId: integer('classroom_id').references(() => classrooms.id, {
    onDelete: 'set null',
  }),
});

export const teachers = sqliteTable('teachers', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  firstName: text('first_name').notNull(),
  lastName: text('last_name').notNull(),
  email: text('email').notNull(),
});

export const classrooms = sqliteTable('classrooms', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  name: text('name').unique().notNull(),
  teacherId: integer('teacher_id').references(() => teachers.id, {
    onDelete: 'set null',
  }),
});

export const subjects = sqliteTable('subjects', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  name: text('name').unique().notNull(),
});

export const subjectsToClassrooms = sqliteTable(
  'subjects_to_classrooms',
  {
    classroomId: integer('classroom_id')
      .references(() => classrooms.id, { onDelete: 'cascade' })
      .notNull(),
    subjectId: integer('subject_id')
      .references(() => subjects.id, { onDelete: 'cascade' })
      .notNull(),
  },
  (table) => ({
    pk: primaryKey(table.classroomId, table.subjectId),
  })
);

export const subjectsToTeachers = sqliteTable(
  'subjects_to_teachers',
  {
    teacherId: integer('teacher_id')
      .references(() => teachers.id, { onDelete: 'cascade' })
      .notNull(),
    subjectId: integer('subject_id')
      .references(() => subjects.id, { onDelete: 'cascade' })
      .notNull(),
  },
  (table) => ({
    pk: primaryKey(table.teacherId, table.subjectId),
  })
);

export const users = sqliteTable('users', {
  id: text('id')
    .primaryKey()
    .$defaultFn(() => generateId(15)),
  firstName: text('first_name').notNull(),
  lastName: text('last_name').notNull(),
  email: text('email').unique().notNull(),
  password: text('password').notNull(),
});

export const sessions = sqliteTable('sessions', {
  id: text('id')
    .primaryKey()
    .$defaultFn(() => generateId(15)),
  userId: text('user_id')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  expiresAt: integer('expires_at').notNull(),
});

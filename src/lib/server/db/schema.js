import {
  sqliteTable,
  text,
  integer,
  primaryKey,
} from 'drizzle-orm/sqlite-core';

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

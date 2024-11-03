import { eq } from 'drizzle-orm';
import { superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import { error, redirect } from '@sveltejs/kit';

import { db } from '$lib/server/db';
import { classrooms, students } from '$lib/server/db/schema';
import { formSchema } from '../../form-schema';

export const load = async ({ locals, params }) => {
  if (!locals.user) {
    redirect(302, '/auth/login');
  }

  const result = await db
    .select()
    .from(students)
    .where(eq(students.id, params.id));

  if (!result[0]) {
    error(404);
  }

  const student = result[0];
  const classroomsResult = await db.select().from(classrooms);

  return {
    classrooms: classroomsResult,
    form: await superValidate(
      {
        ...student,
        birthDate: student.birthDate.toISOString().slice(0, 10),
      },
      zod(formSchema)
    ),
  };
};

export const actions = {
  default: async (event) => {
    if (!event.locals.user) {
      redirect(302, '/auth/login');
    }

    const form = await superValidate(event, zod(formSchema));

    if (!form.valid) {
      return fail(400, {
        form,
      });
    }

    const { data } = form;
    await db
      .update(students)
      .set({
        ...data,
        birthDate: new Date(data.birthDate),
      })
      .where(eq(students.id, event.params.id));

    return {
      form,
    };
  },
};

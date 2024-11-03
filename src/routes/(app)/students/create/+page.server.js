import { superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import { fail, redirect } from '@sveltejs/kit';

import { db } from '$lib/server/db';
import { classrooms, students } from '$lib/server/db/schema';
import { formSchema } from '../form-schema';

export const load = async ({ locals }) => {
  if (!locals.user) {
    redirect(302, '/auth/login');
  }

  const classroomsResult = await db.select().from(classrooms);

  return {
    classrooms: classroomsResult,
    form: await superValidate(zod(formSchema)),
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
    await db.insert(students).values({
      ...data,
      birthDate: new Date(data.birthDate),
    });

    return {
      form,
    };
  },
};

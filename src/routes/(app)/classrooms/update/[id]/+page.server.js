import { eq } from 'drizzle-orm';
import { superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import { error } from '@sveltejs/kit';

import { db } from '$lib/server/db';
import { classrooms } from '$lib/server/db/schema';
import { formSchema } from '../../form-schema';

export const load = async ({ params }) => {
  const result = await db
    .select()
    .from(classrooms)
    .where(eq(classrooms.id, params.id));

  if (!result[0]) {
    error(404);
  }

  const classroom = result[0];
  return {
    form: await superValidate(classroom, zod(formSchema)),
  };
};

export const actions = {
  default: async (event) => {
    const form = await superValidate(event, zod(formSchema));

    if (!form.valid) {
      return fail(400, {
        form,
      });
    }

    const { data } = form;
    await db
      .update(classrooms)
      .set(data)
      .where(eq(classrooms.id, event.params.id));

    return {
      form,
    };
  },
};

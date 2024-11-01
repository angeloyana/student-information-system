import { superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import { fail } from '@sveltejs/kit';

import { db } from '$lib/server/db';
import { classrooms } from '$lib/server/db/schema';
import { formSchema } from '../form-schema';

export const load = async () => {
  return {
    form: await superValidate(zod(formSchema)),
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
    await db.insert(classrooms).values(data);

    return {
      form,
    };
  },
};

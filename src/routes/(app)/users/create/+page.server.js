import bcrypt from 'bcrypt';
import { superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import { error, fail, redirect } from '@sveltejs/kit';

import { db } from '$lib/server/db';
import { users } from '$lib/server/db/schema';
import { formSchema } from '../form-schema';

export const load = async ({ locals }) => {
  if (!locals.user) {
    redirect(302, '/auth/login');
  }
  
  if (locals.user.role != 'superuser') {
    error(401, 'Unauthorized');
  }

  return {
    form: await superValidate(zod(formSchema)),
  };
};

export const actions = {
  default: async (event) => {
    if (!event.locals.user) {
      redirect(302, '/auth/login');
    }
    
    if (event.locals.user.role != 'superuser') {
      error(401, 'Unauthorized');
    }

    const form = await superValidate(event, zod(formSchema));

    if (!form.valid) {
      return fail(400, {
        form,
      });
    }

    const { password, ...userData } = form.data;
    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(password, salt);
    await db.insert(users).values({ ...userData, password: hashedPassword });

    return {
      form,
    };
  },
};

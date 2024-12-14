import bcrypt from 'bcrypt';
import { eq, getTableColumns, inArray, isNull, or } from 'drizzle-orm';
import { superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import { z } from 'zod';
import { error, redirect } from '@sveltejs/kit';

import { db } from '$lib/server/db';
import { users } from '$lib/server/db/schema';
import { log } from '$lib/server/utils';
import { updateFormSchema as formSchema } from '../../form-schema';

export const load = async ({ locals, params }) => {
  if (!locals.user) {
    redirect(302, '/auth/login');
  }

  if (locals.user.role != 'superuser') {
    error(401, 'Unauthorized');
  }

  const { password, ...userColumns } = getTableColumns(users);
  const result = await db
    .select(userColumns)
    .from(users)
    .where(eq(users.id, params.id));

  if (!result[0]) {
    error(404);
  }

  const user = result[0];

  return {
    form: await superValidate(user, zod(formSchema)),
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

    const userId = event.params.id;
    const { password, ...userData } = form.data;
    if (password) {
      console.log('Password changed!');
      const salt = await bcrypt.genSalt();
      const hashedPassword = await bcrypt.hash(password, salt);
      userData.password = hashedPassword;
    }

    await db.update(users).set(userData).where(eq(users.id, userId));
    await log(event.locals.user.id, 'update', 'user', userId);

    return {
      form,
    };
  },
};

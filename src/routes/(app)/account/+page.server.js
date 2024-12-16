import bcrypt from 'bcrypt';
import { eq } from 'drizzle-orm';
import { setError, superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import { fail, redirect } from '@sveltejs/kit';

import { db } from '$lib/server/db';
import { users } from '$lib/server/db/schema';
import { log } from '$lib/server/utils';

import { generalFormSchema, passwordFormSchema } from './formSchema';

export const load = async ({ locals }) => {
  if (!locals.user) {
    redirect(302, '/auth/login');
  }

  const [generalForm, passwordForm] = await Promise.all([
    superValidate(locals.user, zod(generalFormSchema)),
    superValidate(zod(passwordFormSchema)),
  ]);

  return {
    generalForm,
    passwordForm,
  };
};

export const actions = {
  changeGeneral: async (event) => {
    if (!event.locals.user) {
      redirect(302, '/auth/login');
    }

    const user = event.locals.user;
    const form = await superValidate(event, zod(generalFormSchema));

    if (!form.valid) {
      return fail(400, {
        form,
      });
    }

    await db.update(users).set(form.data).where(eq(users.id, user.id));

    await log(user.id, 'update', 'user', user.id);

    return { form };
  },
  changePassword: async (event) => {
    if (!event.locals.user) {
      redirect(302, '/auth/login');
    }

    const form = await superValidate(event, zod(passwordFormSchema));

    if (!form.valid) {
      return fail(400, {
        form,
      });
    }

    const userId = event.locals.user.id;
    const { oldPassword, newPassword } = form.data;
    const result = await db
      .select({ password: users.password })
      .from(users)
      .where(eq(users.id, userId));

    if (!(await bcrypt.compare(oldPassword, result[0].password))) {
      setError(form, 'oldPassword', 'Incorrect password');
      return fail(400, {
        form,
      });
    }

    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(newPassword, salt);
    await db
      .update(users)
      .set({ password: hashedPassword })
      .where(eq(users.id, userId));
    await log(userId, 'update', 'user', userId);

    return { form };
  },
};

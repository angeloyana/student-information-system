import bcrypt from 'bcrypt';
import { eq } from 'drizzle-orm';
import { setError, superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import { fail } from '@sveltejs/kit';

import { lucia } from '$lib/server/auth';
import { db } from '$lib/server/db';
import { users } from '$lib/server/db/schema';
import { formSchema } from './form-schema';

export const load = async () => {
  const form = await superValidate(zod(formSchema));

  return {
    form,
  };
};

export const actions = {
  default: async (event) => {
    const form = await superValidate(event, zod(formSchema));

    if (!form.valid) {
      return fail(400, { form });
    }

    const { email, password } = form.data;
    const user = await db.query.users.findFirst({
      where: eq(users.email, email),
    });

    if (!user) {
      setError(form, 'email', 'Incorrect email or password');
      return setError(form, 'password', 'Incorrect email or password');
    }

    if (!(await bcrypt.compare(password, user.password))) {
      setError(form, 'email', 'Incorrect email or password');
      return setError(form, 'password', 'Incorrect email or password');
    }

    const session = await lucia.createSession(user.id, {});
    const sessionCookie = lucia.createSessionCookie(session.id);

    event.cookies.set(sessionCookie.name, sessionCookie.value, {
      path: '.',
      ...sessionCookie.attributes,
    });

    return { form };
  },
};

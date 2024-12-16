import { fail, redirect } from '@sveltejs/kit';

import { lucia } from '$lib/server/auth';

export const actions = {
  default: async (event) => {
    if (!event.locals.user) {
      return fail(401);
    }

    const sessionId = event.cookies.get(lucia.sessionCookieName);
    await lucia.invalidateSession(sessionId);
    redirect(302, '/auth/login');
  },
};

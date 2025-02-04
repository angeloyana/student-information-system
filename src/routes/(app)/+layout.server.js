import { redirect } from '@sveltejs/kit';

export const load = ({ locals }) => {
  if (!locals.user) {
    redirect(302, '/auth/login');
  }

  return {
    user: locals.user,
  };
};

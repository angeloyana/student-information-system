import { redirect } from '@sveltejs/kit';

export const load = ({ locals }) => {
  if (!locals.user) {
    redirect(302, '/auth/login');
  }

  redirect(302, '/dashboard');
};

'use server';

import { createClient } from '@/utils/supabase/server';
import { redirect } from 'next/navigation';

export const handleGoogleSignIn = async () => {
  const supabase = await createClient();
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: { redirectTo: `/auth/callback` },
  });
  if (data.url) {
    redirect(data.url); // use the redirect API for your server framework
  }
  if (error) {
    console.error(error);
  }
};

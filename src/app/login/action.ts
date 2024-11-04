'use server';

import { createClient } from '@/utils/supabase/server';
import { redirect } from 'next/navigation';

const getURL = () => {
  let url =
    process?.env?.NEXT_PUBLIC_SITE_URL ?? // Set this to your site URL in production env.
    process?.env?.NEXT_PUBLIC_VERCEL_URL ?? // Automatically set by Vercel.
    'http://localhost:3000/';
  // Make sure to include `https://` when not localhost.
  url = url.startsWith('http') ? url : `https://${url}`;
  // Make sure to include a trailing `/`.
  url = url.endsWith('/') ? url : `${url}/`;
  return url;
};

export const handleGoogleSignIn = async () => {
  const supabase = await createClient();
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: { redirectTo: `${getURL()}login/callback` },
  });
  if (data.url) {
    redirect(data.url); // use the redirect API for your server framework
  }
  if (error) {
    console.error(error);
  }
};

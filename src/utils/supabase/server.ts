import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { CookieSerializeOptions } from 'cookie';
import { Database } from '@/utils/database.types';

export async function createClient() {
  const cookieStore = await cookies();

  console.log('creating server client');

  return createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll().map((cookie) => ({
            name: cookie.name,
            value: cookie.value,
          }));
        },
        setAll(
          cookiesToSet: {
            name: string;
            value: string;
            options: Partial<CookieSerializeOptions>;
          }[],
        ) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options),
            );
          } catch {
            // The `setAll` method was called from a Server Component.
            // This can be ignored if you have middleware refreshing
            // user sessions.
          }
        },
      },
    },
  );
}

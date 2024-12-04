'use client';
import { Button, Group, Heading } from '@chakra-ui/react';
import NavLink from '@/app/NavLink';
import { useRouter } from 'next/navigation';
import { createClient } from '@/utils/supabase/client';
import { useEffect, useState } from 'react';
import { User } from '@supabase/auth-js';

export default function NavBar() {
  const router = useRouter();
  const supabase = createClient();
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const checkUser = async () => {
      const { data } = await supabase.auth.getSession();
      if (data?.session?.user) {
        setUser(data.session.user);
      }
    };
    if (!user) {
      void checkUser();
    }
  }, [router, supabase, user]);

  const handleSignOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (!error) {
      setUser(null);
      router.push('/');
    } else console.error(error);
  };

  return (
    <nav className="flex items-center justify-between p-6 bg-secondary shadow-md">
      <div className="text-2xl font-bold text-accent">GreatReads</div>
      <div>
        {user ? (
          <Group>
            <Heading>
              Logged in as {user.user_metadata['name'] ?? user.email}
            </Heading>
            <Button onClick={handleSignOut}>Sign Out</Button>
          </Group>
        ) : (
          <NavLink href="/login">Log In</NavLink>
        )}
      </div>
    </nav>
  );
}

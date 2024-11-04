// app/login/page.tsx
'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Box, Button, VStack } from '@chakra-ui/react';
import { createClient } from '@/utils/supabase/client';
import { handleGoogleSignIn } from '@/app/login/action';

export default function LoginPage() {
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    const checkUser = async () => {
      const { data } = await supabase.auth.getSession();
      if (data.session) {
        router.push('/');
      }
    };
    void checkUser();
  }, [router, supabase]);

  return (
    <Box className="flex justify-center items-center min-h-screen">
      <VStack
        p={4}
        borderWidth={2}
        borderColor={'teal'}
        className={'rounded-xl p-4'}
      >
        <Button onClick={handleGoogleSignIn}>Login with Google</Button>
      </VStack>
    </Box>
  );
}

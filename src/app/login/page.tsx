// app/login/page.tsx
'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Box, Button, VStack } from '@chakra-ui/react';
import { createClient } from '@/utils/supabase/client';
import { handleGoogleSignIn } from '@/app/login/action';
import Image from 'next/image';

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
    <Box className="justify-center items-center min-h-screen bg-background">
      <div className="flex text-primary m-auto w-auto">
        <h3 className="flex m-auto mt-36 mb-16 text-3xl font-bold">
          {' '}
          One Place for All Your Reading Tracking Needs.{' '}
        </h3>
      </div>
      <div className="flex text-secondary m-auto w-auto">
        <h2 className="flex m-auto mb-16 text-xl font-bold">
          {' '}
          Join GreatReads Today.{' '}
        </h2>
      </div>

    <Box className="justify-center items-center min-h-screen bg-background">
      <div className="flex text-primary m-auto w-auto">
        <h3 className="flex m-auto mt-36 mb-16 text-3xl font-bold">
          {' '}
          One Place for All Your Reading Tracking Needs.{' '}
        </h3>
      </div>
      <div className="flex text-secondary m-auto w-auto">
        <h2 className="flex m-auto mb-16 text-xl font-bold">
          {' '}
          Join GreatReads Today.{' '}
        </h2>
      </div>

      <VStack
        p={4}
        borderWidth={2}
        borderColor={'#D4A373'}
        backgroundColor={'#D4A373'}
        className={
          'rounded-xl p-3 w-auto max-w-80 hover:bg-secondary hover:border-secondary color-primary flex m-auto'
        }
        borderColor={'#D4A373'}
        backgroundColor={'#D4A373'}
        className={
          'rounded-xl p-3 w-auto max-w-80 hover:bg-secondary hover:border-secondary color-primary flex m-auto'
        }
      >
        <Button onClick={handleGoogleSignIn} className="flex m-auto">
          <img
            className="w-6 h-6 m-1"
            src="https://www.svgrepo.com/show/475656/google-color.svg"
            loading="lazy"
            alt="google logo"
          />
          <div className="m-auto"> Login or Signup with Google</div>
        </Button>
      </VStack>
    </Box>
  );
}

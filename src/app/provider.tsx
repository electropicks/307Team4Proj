'use client';

import { ChakraProvider } from '@chakra-ui/react';
import { ReactNode } from 'react';
import { ColorModeProvider } from '@/components/ui/color-mode';
import { system } from '@/app/theme';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

export default function RootLayout(props: { children: ReactNode }) {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        refetchOnWindowFocus: false,
        retry: false,
        staleTime: 1000 * 60 * 6,
        refetchInterval: 1000 * 60 * 4,
      },
    },
  });

  return (
    <QueryClientProvider client={queryClient}>
      <ChakraProvider value={system}>
        <ColorModeProvider>{props.children}</ColorModeProvider>
      </ChakraProvider>
    </QueryClientProvider>
  );
}

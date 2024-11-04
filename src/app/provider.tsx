'use client';

import { ChakraProvider } from '@chakra-ui/react';
import { ReactNode } from 'react';
import { ColorModeProvider } from '@/components/ui/color-mode';
import { system } from '@/app/theme';

export default function RootLayout(props: { children: ReactNode }) {
  return (
    <ChakraProvider value={system}>
      <ColorModeProvider>{props.children}</ColorModeProvider>
    </ChakraProvider>
  );
}

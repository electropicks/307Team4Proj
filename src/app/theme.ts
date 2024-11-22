import { createSystem, defineConfig } from '@chakra-ui/react';

const config = defineConfig({
  theme: {
    tokens: {
      colors: {
        primary: { value: '#D4A373' },
        secondary: { value: '#A3B18A' },
        background: { value: '#FAF3E0' },
        foreground: { value: '#3A322D' },
        accent: { value: '#8C7B75' },
        darkPrimary: { value: '#030201' },
      },
      fonts: {
        body: { value: 'system-ui, sans-serif' },
      },
    },
  },
});

export const system = createSystem(config);

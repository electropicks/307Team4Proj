import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      colors: {
        background: '#FAF3E0', // Light beige
        foreground: '#3A322D', // Darker brown
        primary: '#D4A373', // Warm golden brown
        secondary: '#A3B18A', // Soft earthy tone
        accent: '#8C7B75', // Muted olive green
        darkPrimary: '#b38960'
      },
    },
  },
  plugins: [],
};

export default config;

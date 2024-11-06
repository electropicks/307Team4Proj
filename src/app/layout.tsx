import type { Metadata } from 'next';
import './globals.css';
import { ReactNode } from 'react';
import Provider from './provider';
import dotenv from 'dotenv';
import NavBar from '@/components/common/NavBar';
// Load environment variables
dotenv.config();

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <Provider>
          <NavBar />
          {children}
        </Provider>
      </body>
    </html>
  );
}
export const metadata: Metadata = {
  title: 'GreatReads',
  description: 'Your Reading Hub',
};

import type {Metadata} from 'next';
import {Geist, Geist_Mono} from 'next/font/google';

import { Inter } from 'next/font/google';
import './globals.css';
import { AuthProvider } from '@/context/AuthContext';
import { Toaster } from "@/components/ui/toaster";

import './globals.css';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'BasePass NDA',
  description: 'BasePass Visitor Verification and Vehicle Facilitation',
};

const inter = Inter({ subsets: ['latin'] });


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthProvider>
          {children}
          <Toaster /> {/* Add Toaster here if using Shadcn useToast hook */}
        </AuthProvider>
      </body>
    </html>
  );
}

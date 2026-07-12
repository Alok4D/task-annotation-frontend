import type { Metadata } from 'next';
import { DM_Sans } from 'next/font/google';
import './globals.css';
import { ReduxProvider } from '@/store/provider';

const dmSans = DM_Sans({ 
  subsets: ['latin'],
  weight: ['400', '500', '700'],
  variable: '--font-dm-sans',
});

export const metadata: Metadata = {
  title: 'TaskCanvas',
  description: 'TaskCanvas – Task Management & Image Annotation Platform',
  icons: {
    icon: '/fav-logo.png',
    shortcut: '/fav-logo.png',
    apple: '/fav-logo.png',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${dmSans.variable} font-sans bg-gray-50 text-gray-900`}>
        <ReduxProvider>
          {children}
        </ReduxProvider>
      </body>
    </html>
  );
}

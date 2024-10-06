import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { SITE_DESCRIPTION, SITE_TITLE } from '@/utils/constants/generals';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: SITE_TITLE,
  description: SITE_DESCRIPTION,
  openGraph: { images: '/social/social.webp' },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  );
}

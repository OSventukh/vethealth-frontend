import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { SITE_DESCRIPTION, SITE_TITLE } from '@/utils/constants/generals';
import './globals.css';
import Analytics from '@/components/google/Analytics';
import AdSense from '@/components/google/AdSense';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: SITE_TITLE,
  description: SITE_DESCRIPTION,
  metadataBase: new URL(process.env.CLIENT_URL!),
  openGraph: { images: '/social/social.jpg' },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <Analytics />
      <AdSense />
      <body className={inter.className}>{children}</body>
    </html>
  );
}

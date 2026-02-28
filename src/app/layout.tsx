import type { Metadata } from 'next';
import { SITE_DESCRIPTION, SITE_TITLE } from '@/utils/constants/generals';
import './globals.css';
import Analytics from '@/components/google/Analytics';
import AdSense from '@/components/google/AdSense';
import { inter } from '@/lib/fonts';

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
      <body className={inter.className} suppressHydrationWarning>
        {children}
      </body>
    </html>
  );
}

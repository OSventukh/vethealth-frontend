import { SITE_DESCRIPTION, SITE_TITLE } from '@/utils/constants/generals';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: SITE_TITLE,
  description: SITE_DESCRIPTION,
};

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div className="min-h-screen bg-[#ebf6f7]">{children}</div>;
}

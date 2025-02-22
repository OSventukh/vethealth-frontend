import { redirect } from 'next/navigation';
import Header from '@/app/(dashboard)/admin/components/layout/Header';
import Sidebar from '@/app/(dashboard)/admin/components/layout/Sidebar';
import { Toaster } from '@/components/ui/toaster';
import { auth } from '@/lib/next-auth/auth';

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  if (!session) {
    await fetch('http://localhost:3000/api/auth/signout', {
      method: 'POST',
    });
    redirect('http://localhost:3000/api/auth/signin');
  }
  return (
    <div className="bg-background fixed grid max-h-dvh w-screen grid-cols-1 grid-rows-[4rem_1fr_4rem] px-2 md:grid-cols-[4rem_1fr] md:grid-rows-[5rem_1fr] md:pl-0">
      <Header className="col-span-2 col-start-1 row-start-1 row-end-2 flex h-full w-full items-center p-3" />

      <Sidebar className="relative z-50 col-span-2 col-start-1 row-start-3 row-end-4 h-full w-full md:col-start-1 md:col-end-2 md:row-start-2" />
      <main className="border-border col-start-1 col-end-2 row-start-2 row-end-3 flex h-[calc(100dvh-8rem)] w-full flex-col items-center overflow-hidden overflow-y-auto rounded-t-3xl border-[1px] bg-blue-50 px-2 py-2 shadow-inner md:col-span-1 md:col-start-2 md:row-start-2 md:row-end-3 md:h-[calc(100dvh-5rem)] md:w-[calc(100vw-5rem)] md:px-10 md:py-5">
        {children}
      </main>
      <Toaster />
    </div>
  );
}

import { redirect } from 'next/navigation';
import Header from '@/components/dashboard/Header';
import Sidebar from '@/components/dashboard/Sidebar';
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
    <div className="fixed grid grid-cols-1 grid-rows-[3rem_1fr_4rem] md:grid-cols-[4rem_1fr] md:grid-rows-[5rem_1fr] max-h-screen w-screen px-2 md:pl-0 bg-background">
      <Header className=" flex items-center h-full w-full col-start-1 col-span-2 row-start-1 row-end-2 p-3" />

      <Sidebar className="w-full h-full relative z-50 row-start-3 row-end-4 col-start-1 col-span-2 md:col-start-1 md:col-end-2 md:row-start-2" />
      <main className="col-start-1 col-end-2 row-start-2 row-end-3 md:col-start-2 md:col-span-1 md:row-start-2 md:row-end-3 overflow-hidden overflow-y-auto flex flex-col items-center h-[calc(100dvh-7rem)] md:h-[calc(100dvh-5rem)] w-full md:w-[calc(100vw-5rem)] px-2 md:px-10 py-2 md:py-5 rounded-t-3xl border-[1px] border-border bg-blue-50 shadow-inner">
        {children}
      </main>
      <Toaster />
    </div>
  );
}

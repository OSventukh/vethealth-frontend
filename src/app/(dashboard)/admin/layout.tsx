import Header from '@/components/dashboard/Header';
import Sidebar from '@/components/dashboard/Sidebar';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="h-screen bg-background grid grid-cols-[5rem_1fr_0.5rem] md:grid-cols-[5rem_1fr_1rem] grid-rows-[5rem_1fr] bg-slate-100">
      <Header />
      <Sidebar />
      <main className="py-6 px-20 col-start-2 col-span-1 row-span-1 rounded-t-3xl border-[1px] border-border bg-gray-50 shadow-inner">
        {children}
      </main>
    </div>
  );
}

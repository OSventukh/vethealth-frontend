import { Suspense } from 'react';
import VisitorsByDate from './components/visitors/VisitorsByDate';
import VisitorsByCountry from './components/visitors/VisitorsByCountry';

export default async function DashboardPage() {
  return (
    <div className="mt-5 grid w-full grid-cols-6 gap-5 rounded-2xl md:p-10">
      <Suspense fallback={null}>
        <VisitorsByDate className="col-span-6 md:col-span-4 row-span-2" />
      </Suspense>
      <Suspense fallback={null}>
        <VisitorsByCountry className="col-span-6 md:col-span-2 row-span-2" />
      </Suspense>
    </div>
  );
}

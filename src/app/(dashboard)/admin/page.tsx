import { Suspense } from 'react';
import VisitorsByDate from './components/visitors/VisitorsByDate';
import VisitorsByCountry from './components/visitors/VisitorsByCountry';
import VisitorsRealtime from './components/visitors/VisitorsRealtime';

export default async function DashboardPage() {
  return (
    <div className="grid w-full grid-cols-6 gap-5 rounded-2xl">
      <Suspense fallback={null}>
        <VisitorsRealtime className="col-span-6 row-span-1 md:col-span-2 md:row-start-1 md:row-end-2" />
      </Suspense>
      <Suspense fallback={null}>
        <VisitorsByCountry className="col-span-6 row-span-1 md:col-span-2 md:row-start-2 md:row-end-3" />
      </Suspense>
      <Suspense fallback={null}>
        <VisitorsByDate className="col-span-6 row-span-1 md:col-span-4 md:row-start-1 md:row-end-3" />
      </Suspense>
    </div>
  );
}

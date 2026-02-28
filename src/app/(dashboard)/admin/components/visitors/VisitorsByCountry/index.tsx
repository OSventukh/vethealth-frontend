import dynamic from 'next/dynamic';
import type { ChartConfig } from '@/components/ui/chart';
import { dataClientReport } from '@/lib/ga/dataclientreport';

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

const HorizontalBarChart = dynamic(
  () =>
    import('../../charts/horizontal-bar-chart').then(
      (module) => module.HorizontalBarChart
    ),
  {
    loading: () => <div className="h-[220px] w-full animate-pulse rounded-md bg-slate-100" />,
  }
);

type Props = {
  className?: string;
};

export default async function VisitorsByDate({ ...props }: Props) {
  const [error, data] = await dataClientReport({
    dimensions: [{ name: 'country' }],
    metrics: [{ name: 'activeUsers' }],
    startDate: '7daysAgo',
    endDate: 'yesterday',
  });
  if (error || !data || !data.rows || data.rows.length === 0) {
    return (
      <Card {...props}>
        <CardHeader>
          <CardTitle>Виникла помилка</CardTitle>
        </CardHeader>
        {error && <CardContent>{error.message}</CardContent>}
      </Card>
    );
  }

  const chartData = data?.rows.map((row) => {
    return {
      country: row?.dimensionValues?.[0].value,
      visitors: parseInt(row?.metricValues?.[0].value || '0'),
    };
  });

  const chartConfig = {
    country: {
      label: 'Країна',
      color: 'var(--chart-1)',
    },
    visitors: {
      label: 'Користувачі',
      color: 'var(--chart-2)',
    },
  } satisfies ChartConfig;

  return (
    <Card {...props}>
      <CardHeader>
        <CardTitle>Відвідування за країнами</CardTitle>
        <CardDescription>
          Показано відвідування за останні 7 днів
        </CardDescription>
      </CardHeader>
      <CardContent>
        <HorizontalBarChart chartData={chartData} chartConfig={chartConfig} />
      </CardContent>
      <CardFooter>
        <div className="flex w-full items-start gap-2 text-sm"></div>
      </CardFooter>
    </Card>
  );
}

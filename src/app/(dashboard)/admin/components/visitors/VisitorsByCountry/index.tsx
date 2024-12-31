import { format, parse } from 'date-fns';
import { uk } from 'date-fns/locale';
import { ChartConfig } from '@/components/ui/chart';
import { dataClientReport } from '@/lib/ga/dataclientreport';

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { HorizontalBarChart } from '../../charts/horizontal-bar-chart';

type Props = {
  className?: string;
};

export default async function VisitorsByDate({ ...props }: Props) {
  const data = await dataClientReport({
    dimensions: [{ name: 'country' }],
    metrics: [{ name: 'activeUsers' }],
    startDate: '7daysAgo',
    endDate: 'yesterday',
    
  });
  if (!data || !data.rows || data.rows.length === 0) {
    return <div>No data available</div>;
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
      color: 'hsl(var(--chart-1))',
    },
    visitors: {
      label: 'Користувачі',
      color: 'hsl(var(--chart-2))',
    },
  } satisfies ChartConfig;

   const totalVisitors = data.rows[data.rows.length - 1]?.metricValues?.[1]?.value;
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

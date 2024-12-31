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
import LinearLineChart from '../../charts/linear-line-chart';

type Props = {
  className?: string;
};
export default async function VisitorsByDate({ ...props }: Props) {
  const data = await dataClientReport({
    dimensions: [{ name: 'date' }],
    metrics: [
      { name: 'activeUsers' },
      {
        name: 'active7DayUsers',
      },
    ],
    startDate: '7daysAgo',
    endDate: 'yesterday',
    orderBys: [
      {
        dimension: {
          dimensionName: 'date',
          orderType: 'ALPHANUMERIC',
        },
      },
    ],
  });
  if (!data || !data.rows || data.rows.length === 0) {
    return <div>No data available</div>;
  }

  const chartData = data?.rows.map((row) => {
    const date = parse(
      row?.dimensionValues?.[0]?.value || '',
      'yyyyMMdd',
      new Date()
    );
    const formattedDate = format(date, 'dd MMMM', { locale: uk });
    return {
      date: formattedDate,
      visitors: parseInt(row?.metricValues?.[0].value || '0'),
    };
  });

  const chartConfig = {
    date: {
      label: 'Дата',
      color: 'hsl(var(--chart-1))',
    },
    visitors: {
      label: 'Користувачі',
      color: 'hsl(var(--chart-2))',
    },
  } satisfies ChartConfig;

  const totalVisitors =
    data.rows[data.rows.length - 1]?.metricValues?.[1]?.value;
  return (
    <Card {...props}>
      <CardHeader>
        <CardTitle>Відвідування</CardTitle>
        <CardDescription>
          Показано відвідування за останні 7 днів
          <div className="mt-2 flex gap-2">
            <div className="rounded border p-2">
              <div>Всього користувачів</div>
              <div className="text-center font-bold">
                {totalVisitors || '0'}
              </div>
            </div>
          </div>
        </CardDescription>
      </CardHeader>
      <CardContent>
        <LinearLineChart chartData={chartData} chartConfig={chartConfig} />
      </CardContent>
      <CardFooter>
        <div className="flex w-full items-start gap-2 text-sm"></div>
      </CardFooter>
    </Card>
  );
}

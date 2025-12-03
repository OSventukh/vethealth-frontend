import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { dataRealtimeReport } from '@/lib/ga/dataclientreport';

type Props = {
  className?: string;
};

export default async function VisitorsRealtime({ ...props }: Props) {
  const [error, realtime] = await dataRealtimeReport({
    dimensions: [{ name: 'country' }],
    metrics: [{ name: 'activeUsers' }],
  });
  const currentOnline =
    realtime?.rows?.[0]?.metricValues?.[0]?.value ??
    realtime?.totals?.[0]?.metricValues?.[0]?.value ??
    '0';
  return (
    <Card {...props}>
      <CardHeader>
        <CardTitle>Активні користувачі</CardTitle>
        <CardDescription>
          Кількість активних користувачів на сайті
        </CardDescription>
      </CardHeader>
      <CardContent>{currentOnline}</CardContent>
    </Card>
  );
}

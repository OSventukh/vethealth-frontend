import { connection } from "next/server";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { dataRealtimeReport } from "@/lib/ga/dataclientreport";

type Props = {
	className?: string;
};

export default async function VisitorsRealtime({ ...props }: Props) {
	// Live analytics for the signed-in admin: marks this card request-time so the
	// report — and the chart it renders — is never pulled into the prerendered shell.
	await connection();

	const [error, realtime] = await dataRealtimeReport({
		dimensions: [{ name: "country" }],
		metrics: [{ name: "activeUsers" }],
	});
	if (error) {
		return (
			<Card {...props}>
				<CardHeader>
					<CardTitle>Виникла помилка</CardTitle>
				</CardHeader>
				<CardContent>{error.message}</CardContent>
			</Card>
		);
	}
	const currentOnline =
		realtime?.rows?.[0]?.metricValues?.[0]?.value ??
		realtime?.totals?.[0]?.metricValues?.[0]?.value ??
		"0";
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

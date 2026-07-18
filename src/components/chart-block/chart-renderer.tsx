"use client";

import {
	Area,
	AreaChart,
	Bar,
	BarChart,
	CartesianGrid,
	LabelList,
	Line,
	LineChart,
	Pie,
	PieChart,
	XAxis,
	YAxis,
} from "recharts";
import {
	type ChartConfig,
	ChartContainer,
	ChartLegend,
	ChartLegendContent,
	ChartTooltip,
	ChartTooltipContent,
} from "@/components/ui/chart";
import { cn } from "@/lib/utils";
import {
	CHART_PALETTE,
	type ChartBlockData,
	type ChartRow,
	type ChartSeries,
} from "./types";

export function toRechartsRows(
	rows: ChartRow[],
	series: ChartSeries[],
): Record<string, string | number>[] {
	return rows.map((row) => ({
		category: row.category,
		...Object.fromEntries(series.map((s) => [s.key, row.values[s.key] ?? 0])),
	}));
}

export function toChartConfig(series: ChartSeries[]): ChartConfig {
	return Object.fromEntries(
		series.map((s) => [s.key, { label: s.label, color: s.color }]),
	);
}

// Pie: одна серія, колір на категорію. Ключі категорій ("c1".."cN") —
// згенеровані, як і ключі серій: вони стають CSS-змінними ChartStyle.
export function toPieData(
	rows: ChartRow[],
	seriesKey: string,
): { name: string; value: number; fill: string }[] {
	return rows.map((row, i) => ({
		name: `c${i + 1}`,
		value: row.values[seriesKey] ?? 0,
		fill: `var(--color-c${i + 1})`,
	}));
}

export function toPieConfig(
	rows: ChartRow[],
	seriesLabel: string,
): ChartConfig {
	return {
		value: { label: seriesLabel },
		...Object.fromEntries(
			rows.map((row, i) => [
				`c${i + 1}`,
				{
					label: row.category,
					color: CHART_PALETTE[i % CHART_PALETTE.length],
				},
			]),
		),
	};
}

// Кастомний formatter підміняє весь рядок тултіпа (разом з індикатором),
// тому відтворюємо стандартну розмітку ChartTooltipContent, лише додаючи
// суфікс до значення. name — згенерований ключ ("s1"/"c1"), для якого
// ChartStyle визначає --color-<name>, а config — підпис.
function makeTooltipFormatter(config: ChartConfig, suffix: string) {
	return function formatTooltipRow(
		value: number | string,
		name: string | number,
	) {
		return (
			<>
				<div
					className="h-2.5 w-2.5 shrink-0 rounded-[2px]"
					style={{ background: `var(--color-${name})` }}
				/>
				{config[name as string]?.label || name}
				<div className="text-foreground ml-auto font-mono font-medium tabular-nums">
					{value}
					{suffix}
				</div>
			</>
		);
	};
}

// Recharts за замовчуванням (interval="preserveEnd") ховає підписи осі X,
// які не вміщаються — довгі українські категорії просто зникають. Натомість
// показуємо всі підписи завжди (interval={0}) і переносимо довгі на кілька
// рядків, як у "паперових" діаграмах.
const MAX_TICK_LINE_CHARS = 12;

export function wrapTickLabel(value: string): string[] {
	const words = String(value).trim().split(/\s+/);
	const lines: string[] = [];
	let current = "";
	for (const word of words) {
		const candidate = current ? `${current} ${word}` : word;
		if (candidate.length > MAX_TICK_LINE_CHARS && current) {
			lines.push(current);
			current = word;
		} else {
			current = candidate;
		}
	}
	if (current) {
		lines.push(current);
	}
	return lines;
}

// Проп tick у recharts приймає елемент і сам передає йому x/y/payload.
function WrappedAxisTick({
	x,
	y,
	payload,
}: {
	x?: number;
	y?: number;
	payload?: { value?: string | number };
}) {
	const lines = wrapTickLabel(String(payload?.value ?? ""));
	return (
		<text x={x} y={y} dy={12} textAnchor="middle" fontSize={12}>
			{lines.map((line, i) => (
				<tspan key={`${line}-${i}`} x={x} dy={i === 0 ? 0 : 14}>
					{line}
				</tspan>
			))}
		</text>
	);
}

export function ChartRenderer({
	data,
	className,
}: {
	data: ChartBlockData;
	className?: string;
}) {
	const { chartType, series, rows, donut, showValues } = data;
	const suffix = data.valueSuffix || "";

	// Захист від зіпсованих даних (наприклад, вручну відредагований JSON).
	if (rows.length === 0 || series.length === 0) {
		return null;
	}

	// ChartContainer форсує aspect-video — виклики перекривають його через
	// className ("aspect-auto h-[…]"), cn ставить клас викликача останнім.
	const containerClassName = cn("w-full", className);
	const formatValue = (value: number | string) => `${value}${suffix}`;

	if (chartType === "pie") {
		const pieSeries = series[0];
		const pieConfig = toPieConfig(rows, pieSeries.label);
		return (
			<ChartContainer config={pieConfig} className={containerClassName}>
				<PieChart accessibilityLayer>
					<ChartTooltip
						content={
							<ChartTooltipContent
								hideLabel
								formatter={
									suffix ? makeTooltipFormatter(pieConfig, suffix) : undefined
								}
							/>
						}
					/>
					<Pie
						data={toPieData(rows, pieSeries.key)}
						dataKey="value"
						nameKey="name"
						innerRadius={donut ? 60 : 0}
						label={
							showValues
								? ({ value }: { value?: number }) => formatValue(value ?? 0)
								: undefined
						}
					/>
					<ChartLegend content={<ChartLegendContent nameKey="name" />} />
				</PieChart>
			</ChartContainer>
		);
	}

	const chartRows = toRechartsRows(rows, series);
	const config = toChartConfig(series);
	const showLegend = series.length > 1;
	// Підписи над точками/стовпцями впираються у верхній край без запасу.
	const margin = { top: showValues ? 24 : 4, left: 12, right: 12 };

	// Висота осі X залежить від найдовшого (у рядках) підпису категорії.
	const maxTickLines = Math.max(
		1,
		...rows.map((row) => wrapTickLabel(row.category).length),
	);
	// САМЕ масив, не фрагмент: recharts не розгортає React.Fragment серед
	// children і мовчки викидає загорнуті в нього осі/сітку.
	const axes = [
		<CartesianGrid key="grid" vertical={false} />,
		<XAxis
			key="x"
			dataKey="category"
			tickLine={false}
			axisLine={false}
			tickMargin={4}
			interval={0}
			height={maxTickLines * 14 + 16}
			tick={<WrappedAxisTick />}
		/>,
		<YAxis
			key="y"
			tickLine={false}
			axisLine={false}
			tickMargin={8}
			width={48}
			tickFormatter={formatValue}
		/>,
	];
	const tooltip = (
		<ChartTooltip
			cursor={false}
			content={
				<ChartTooltipContent
					formatter={suffix ? makeTooltipFormatter(config, suffix) : undefined}
				/>
			}
		/>
	);
	const valueLabels = showValues ? (
		<LabelList
			position="top"
			offset={8}
			className="fill-foreground"
			fontSize={12}
			formatter={formatValue}
		/>
	) : null;

	return (
		<ChartContainer config={config} className={containerClassName}>
			{chartType === "bar" ? (
				<BarChart accessibilityLayer data={chartRows} margin={margin}>
					{axes}
					{tooltip}
					{showLegend && <ChartLegend content={<ChartLegendContent />} />}
					{series.map((s) => (
						<Bar
							key={s.key}
							dataKey={s.key}
							fill={`var(--color-${s.key})`}
							radius={4}
						>
							{valueLabels}
						</Bar>
					))}
				</BarChart>
			) : chartType === "line" ? (
				<LineChart accessibilityLayer data={chartRows} margin={margin}>
					{axes}
					{tooltip}
					{showLegend && <ChartLegend content={<ChartLegendContent />} />}
					{series.map((s) => (
						<Line
							key={s.key}
							dataKey={s.key}
							type="linear"
							stroke={`var(--color-${s.key})`}
							strokeWidth={2}
							dot={false}
						>
							{valueLabels}
						</Line>
					))}
				</LineChart>
			) : (
				<AreaChart accessibilityLayer data={chartRows} margin={margin}>
					{axes}
					{tooltip}
					{showLegend && <ChartLegend content={<ChartLegendContent />} />}
					{series.map((s) => (
						<Area
							key={s.key}
							dataKey={s.key}
							type="natural"
							fill={`var(--color-${s.key})`}
							fillOpacity={0.4}
							stroke={`var(--color-${s.key})`}
						>
							{valueLabels}
						</Area>
					))}
				</AreaChart>
			)}
		</ChartContainer>
	);
}

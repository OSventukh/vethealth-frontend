"use client";

import { useCallback, useRef, useState } from "react";
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

// Підписи (категорії під віссю X і значення при showValues) на вузьких
// екранах налазять один на одного — горизонтального місця на категорію
// замало. Ширину контейнера відстежуємо через ResizeObserver і, коли
// найдовший підпис не вміщається у свій слот, повертаємо всі підписи цієї
// групи вертикально (читаються знизу вгору).
const VALUE_LABEL_FONT_SIZE = 12;
// Консервативна оцінка ширини символа при fontSize 12 — точність тут не
// потрібна, важливо не лишити підписи горизонтальними, коли вже тісно.
const LABEL_CHAR_PX = 7;
const VALUE_LABEL_OFFSET = 8;
const X_MARGIN = 12;
const Y_AXIS_WIDTH = 48;

function useContainerWidth(): [(el: HTMLDivElement | null) => void, number] {
	const [width, setWidth] = useState(0);
	const observerRef = useRef<ResizeObserver | null>(null);
	// Callback-ref замість useEffect: переживає перемонтування контейнера
	// (наприклад, зміну типу діаграми в редакторі).
	const ref = useCallback((el: HTMLDivElement | null) => {
		observerRef.current?.disconnect();
		observerRef.current = null;
		if (!el) {
			return;
		}
		const observer = new ResizeObserver((entries) => {
			const next = entries[0]?.contentRect.width;
			if (next !== undefined) {
				setWidth(next);
			}
		});
		observer.observe(el);
		observerRef.current = observer;
	}, []);
	return [ref, width];
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
	// Зсув першого рядка — на tspan, не на <text>: у SVG dy найглибшого
	// елемента перекриває батьківський, тож dy на <text> просто ігнорувався б.
	return (
		<text x={x} y={y} textAnchor="middle" fontSize={12}>
			{lines.map((line, i) => (
				<tspan key={`${line}-${i}`} x={x} dy={i === 0 ? 12 : 14}>
					{line}
				</tspan>
			))}
		</text>
	);
}

// Вертикальний варіант тика осі X: категорія одним рядком, повернута на
// -90° навколо точки тика (textAnchor="end" → текст звисає під вісь і
// читається знизу вгору).
function VerticalAxisTick({
	x,
	y,
	payload,
}: {
	x?: number;
	y?: number;
	payload?: { value?: string | number };
}) {
	const cx = x ?? 0;
	const cy = (y ?? 0) + 4;
	return (
		<text
			x={cx}
			y={cy}
			transform={`rotate(-90, ${cx}, ${cy})`}
			textAnchor="end"
			dominantBaseline="central"
			fontSize={12}
		>
			{String(payload?.value ?? "")}
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
	const [containerRef, containerWidth] = useContainerWidth();

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
			<ChartContainer
				ref={containerRef}
				config={pieConfig}
				className={containerClassName}
			>
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

	// Найдовший підпис значення (у пікселях) проти слота, який припадає на
	// один підпис по горизонталі (для групованих стовпців слот ділять серії).
	const maxValueLabelPx = showValues
		? Math.max(
				...rows.flatMap((row) =>
					series.map((s) => formatValue(row.values[s.key] ?? 0).length),
				),
			) * LABEL_CHAR_PX
		: 0;
	const innerWidth = containerWidth - 2 * X_MARGIN - Y_AXIS_WIDTH;
	const labelSlot =
		innerWidth /
		(chartType === "bar" ? rows.length * series.length : rows.length);
	const verticalValueLabels =
		showValues && containerWidth > 0 && maxValueLabelPx > labelSlot - 4;

	// Підписи над точками/стовпцями впираються у верхній край без запасу;
	// вертикальним потрібен запас на всю довжину тексту.
	const margin = {
		top: verticalValueLabels
			? maxValueLabelPx + VALUE_LABEL_OFFSET + 4
			: showValues
				? 24
				: 4,
		left: X_MARGIN,
		right: X_MARGIN,
	};

	// Те саме для категорій під віссю X: якщо навіть найдовший уже
	// перенесений рядок не вміщається у слот категорії — тики стають
	// вертикальними (назва цілком, без переносів), а висота осі росте під
	// найдовшу назву. Інакше висота залежить від кількості рядків переносу.
	const tickLines = rows.map((row) => wrapTickLabel(row.category));
	const maxTickLines = Math.max(1, ...tickLines.map((lines) => lines.length));
	const maxTickLinePx =
		Math.max(0, ...tickLines.flat().map((line) => line.length)) *
		LABEL_CHAR_PX;
	const verticalTicks =
		containerWidth > 0 && maxTickLinePx > innerWidth / rows.length - 4;
	const maxCategoryPx =
		Math.max(0, ...rows.map((row) => row.category.length)) * LABEL_CHAR_PX;
	// САМЕ масив, не фрагмент: recharts не розгортає React.Fragment серед
	// children і мовчки викидає загорнуті в нього осі/сітку.
	const axes = [
		<CartesianGrid key="grid" vertical={false} />,
		<XAxis
			key="x"
			dataKey="category"
			tickLine={false}
			axisLine={false}
			// Горизонтальним підписам — більший відступ від діаграми (вертикальні
			// й так звисають нижче осі); висота осі росте на ту саму величину.
			tickMargin={verticalTicks ? 4 : 12}
			interval={0}
			height={verticalTicks ? maxCategoryPx + 12 : maxTickLines * 14 + 24}
			tick={verticalTicks ? <VerticalAxisTick /> : <WrappedAxisTick />}
		/>,
		<YAxis
			key="y"
			tickLine={false}
			axisLine={false}
			tickMargin={8}
			width={Y_AXIS_WIDTH}
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
	// Кастомний content для вертикальних підписів: <text>, повернутий на -90°
	// навколо точки над стовпцем/точкою (textAnchor="start" → текст росте
	// вгору). Для Bar приходить x лівого краю + width, для Line/Area — x
	// самої точки без width.
	const renderVerticalValueLabel = (props: unknown) => {
		const { x, y, width, value } = props as {
			x?: number | string;
			y?: number | string;
			width?: number | string;
			value?: number | string;
		};
		const cx = Number(x ?? 0) + Number(width ?? 0) / 2;
		const cy = Number(y ?? 0) - VALUE_LABEL_OFFSET;
		return (
			<text
				x={cx}
				y={cy}
				transform={`rotate(-90 ${cx} ${cy})`}
				textAnchor="start"
				dominantBaseline="central"
				className="fill-foreground"
				fontSize={VALUE_LABEL_FONT_SIZE}
			>
				{formatValue(value ?? 0)}
			</text>
		);
	};

	const valueLabels = showValues ? (
		verticalValueLabels ? (
			<LabelList content={renderVerticalValueLabel} />
		) : (
			<LabelList
				position="top"
				offset={VALUE_LABEL_OFFSET}
				className="fill-foreground"
				fontSize={VALUE_LABEL_FONT_SIZE}
				formatter={formatValue}
			/>
		)
	) : null;

	return (
		<ChartContainer
			ref={containerRef}
			config={config}
			className={containerClassName}
		>
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

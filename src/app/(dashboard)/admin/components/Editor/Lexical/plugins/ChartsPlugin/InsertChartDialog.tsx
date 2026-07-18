import {
	ChartArea,
	ChartColumn,
	ChartLine,
	ChartPie,
	Plus,
	Trash2,
	X,
} from "lucide-react";
import type * as React from "react";
import { useMemo, useState } from "react";
import { ChartRenderer } from "@/components/chart-block/chart-renderer";
import {
	CHART_PALETTE,
	type ChartBlockData,
	type ChartType,
	MAX_SERIES,
} from "@/components/chart-block/types";
import { Button } from "@/components/ui/button";
import { DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";

const CHART_TYPE_TABS: {
	value: ChartType;
	label: string;
	icon: React.ComponentType<{ className?: string }>;
}[] = [
	{ value: "bar", label: "Стовпчикова", icon: ChartColumn },
	{ value: "line", label: "Лінійна", icon: ChartLine },
	{ value: "area", label: "Площинна", icon: ChartArea },
	{ value: "pie", label: "Кругова", icon: ChartPie },
];

// Чернетка тримає значення строками: користувач може набирати "12," або "-"
// посеред вводу; в числа конвертуємо тільки для прев'ю та збереження.
interface DraftRow {
	category: string;
	values: string[];
}

interface Draft {
	chartType: ChartType;
	title: string;
	categoryLabel: string;
	donut: boolean;
	valueSuffix: string;
	showValues: boolean;
	seriesNames: string[];
	rows: DraftRow[];
}

function createEmptyDraft(): Draft {
	return {
		chartType: "bar",
		title: "",
		categoryLabel: "Категорія",
		donut: false,
		valueSuffix: "",
		showValues: false,
		seriesNames: ["Ряд 1"],
		rows: [
			{ category: "", values: [""] },
			{ category: "", values: [""] },
			{ category: "", values: [""] },
		],
	};
}

function draftFromData(data: ChartBlockData): Draft {
	return {
		chartType: data.chartType,
		title: data.title || "",
		categoryLabel: data.categoryLabel || "Категорія",
		donut: data.donut || false,
		valueSuffix: data.valueSuffix || "",
		showValues: data.showValues || false,
		seriesNames: data.series.map((s) => s.label),
		rows: data.rows.map((row) => ({
			category: row.category,
			values: data.series.map((s) => {
				const value = row.values[s.key];
				return value === undefined ? "" : String(value);
			}),
		})),
	};
}

// Українська десяткова кома → крапка; порожнє значення → 0.
export function parseCellNumber(raw: string): number {
	const trimmed = raw.trim();
	if (trimmed === "") {
		return 0;
	}
	return Number(trimmed.replace(",", "."));
}

function activeSeriesCount(draft: Draft): number {
	// Кругова діаграма показує лише перший ряд даних; решта колонок
	// лишається в чернетці (щоб не губити дані при перемиканні типу),
	// але не валідується і не зберігається.
	return draft.chartType === "pie" ? 1 : draft.seriesNames.length;
}

function dataFromDraft(draft: Draft): ChartBlockData {
	const count = activeSeriesCount(draft);
	const series = draft.seriesNames.slice(0, count).map((label, i) => ({
		key: `s${i + 1}`,
		label: label.trim() || `Ряд ${i + 1}`,
		color: CHART_PALETTE[i % CHART_PALETTE.length],
	}));
	const title = draft.title.trim();
	const valueSuffix = draft.valueSuffix.trim();
	return {
		chartType: draft.chartType,
		...(title ? { title } : {}),
		categoryLabel: draft.categoryLabel.trim() || "Категорія",
		...(draft.chartType === "pie" && draft.donut ? { donut: true } : {}),
		...(valueSuffix ? { valueSuffix } : {}),
		...(draft.showValues ? { showValues: true } : {}),
		series,
		rows: draft.rows.map((row) => ({
			category: row.category.trim(),
			values: Object.fromEntries(
				series.map((s, i) => {
					const parsed = parseCellNumber(row.values[i] ?? "");
					return [s.key, Number.isNaN(parsed) ? 0 : parsed];
				}),
			),
		})),
	};
}

function validateDraft(draft: Draft): string | null {
	if (draft.rows.length === 0) {
		return "Додайте хоча б один рядок даних";
	}
	if (draft.seriesNames.length === 0) {
		return "Додайте хоча б один ряд даних";
	}
	if (draft.rows.some((row) => row.category.trim() === "")) {
		return "Заповніть назви всіх категорій";
	}
	const count = activeSeriesCount(draft);
	const hasInvalidNumber = draft.rows.some((row) =>
		row.values
			.slice(0, count)
			.some((value) => Number.isNaN(parseCellNumber(value))),
	);
	if (hasInvalidNumber) {
		return "Виправте некоректні числові значення";
	}
	return null;
}

export default function InsertChartDialog({
	onSubmit,
	onClose,
	initialData,
}: {
	onSubmit: (data: ChartBlockData) => void;
	onClose: () => void;
	initialData?: ChartBlockData;
}): React.ReactElement {
	const [draft, setDraft] = useState<Draft>(() =>
		initialData ? draftFromData(initialData) : createEmptyDraft(),
	);

	const isPie = draft.chartType === "pie";
	const visibleSeriesCount = activeSeriesCount(draft);
	const validationError = validateDraft(draft);
	const previewData = useMemo(() => dataFromDraft(draft), [draft]);
	const showPreview =
		draft.rows.some((row) => row.category.trim() !== "") && !validationError;

	const setSeriesName = (seriesIndex: number, name: string) =>
		setDraft((d) => ({
			...d,
			seriesNames: d.seriesNames.map((n, i) =>
				i === seriesIndex ? name : n,
			),
		}));

	const addSeries = () =>
		setDraft((d) =>
			d.seriesNames.length >= MAX_SERIES
				? d
				: {
						...d,
						seriesNames: [...d.seriesNames, `Ряд ${d.seriesNames.length + 1}`],
						rows: d.rows.map((row) => ({
							...row,
							values: [...row.values, ""],
						})),
					},
		);

	const removeSeries = (seriesIndex: number) =>
		setDraft((d) =>
			d.seriesNames.length <= 1
				? d
				: {
						...d,
						seriesNames: d.seriesNames.filter((_, i) => i !== seriesIndex),
						rows: d.rows.map((row) => ({
							...row,
							values: row.values.filter((_, i) => i !== seriesIndex),
						})),
					},
		);

	const setRowCategory = (rowIndex: number, category: string) =>
		setDraft((d) => ({
			...d,
			rows: d.rows.map((row, i) =>
				i === rowIndex ? { ...row, category } : row,
			),
		}));

	const setCellValue = (rowIndex: number, seriesIndex: number, value: string) =>
		setDraft((d) => ({
			...d,
			rows: d.rows.map((row, i) =>
				i === rowIndex
					? {
							...row,
							values: row.values.map((v, j) =>
								j === seriesIndex ? value : v,
							),
						}
					: row,
			),
		}));

	const addRow = () =>
		setDraft((d) => ({
			...d,
			rows: [
				...d.rows,
				{ category: "", values: d.seriesNames.map(() => "") },
			],
		}));

	const removeRow = (rowIndex: number) =>
		setDraft((d) =>
			d.rows.length <= 1
				? d
				: { ...d, rows: d.rows.filter((_, i) => i !== rowIndex) },
		);

	return (
		<>
			<div className="grid max-h-[65dvh] gap-4 overflow-y-auto py-2 pr-1">
				<div className="grid gap-2">
					<Label>Тип діаграми</Label>
					<Tabs
						value={draft.chartType}
						onValueChange={(value) =>
							setDraft((d) => ({ ...d, chartType: value as ChartType }))
						}
					>
						<TabsList className="grid h-auto w-full grid-cols-2 sm:grid-cols-4">
							{CHART_TYPE_TABS.map(({ value, label, icon: Icon }) => (
								<TabsTrigger
									key={value}
									value={value}
									data-test-id={`chart-modal-type-${value}`}
								>
									<Icon className="mr-1.5 size-4" />
									{label}
								</TabsTrigger>
							))}
						</TabsList>
					</Tabs>
				</div>

				<div className="grid gap-4 sm:grid-cols-[1fr_auto_auto] sm:items-end">
					<div className="grid gap-2">
						<Label htmlFor="chart-title">
							Назва діаграми (необов'язково)
						</Label>
						<Input
							id="chart-title"
							placeholder="Підпис під діаграмою"
							value={draft.title}
							onChange={(e) =>
								setDraft((d) => ({ ...d, title: e.target.value }))
							}
							data-test-id="chart-modal-title-input"
						/>
					</div>
					<div className="grid gap-2">
						<Label htmlFor="chart-suffix">Одиниця</Label>
						<Input
							id="chart-suffix"
							className="w-20"
							placeholder="%"
							maxLength={8}
							value={draft.valueSuffix}
							onChange={(e) =>
								setDraft((d) => ({ ...d, valueSuffix: e.target.value }))
							}
							data-test-id="chart-modal-suffix-input"
						/>
					</div>
					<label className="flex h-10 items-center gap-2 text-sm">
						Показувати значення
						<Switch
							checked={draft.showValues}
							onCheckedChange={(checked) =>
								setDraft((d) => ({ ...d, showValues: checked }))
							}
							data-test-id="chart-modal-show-values-switch"
						/>
					</label>
				</div>

				{isPie && (
					<div className="flex items-center justify-between gap-4">
						<p className="text-muted-foreground text-sm">
							Кругова діаграма використовує перший ряд даних.
						</p>
						<label className="flex shrink-0 items-center gap-2 text-sm">
							Кільцева
							<Switch
								checked={draft.donut}
								onCheckedChange={(checked) =>
									setDraft((d) => ({ ...d, donut: checked }))
								}
								data-test-id="chart-modal-donut-switch"
							/>
						</label>
					</div>
				)}

				<div className="grid gap-2">
					<Label>Дані</Label>
					<Table>
						<TableHeader>
							<TableRow>
								<TableHead className="min-w-32 px-1">
									<Input
										value={draft.categoryLabel}
										onChange={(e) =>
											setDraft((d) => ({
												...d,
												categoryLabel: e.target.value,
											}))
										}
										data-test-id="chart-modal-category-label"
									/>
								</TableHead>
								{draft.seriesNames
									.slice(0, visibleSeriesCount)
									.map((name, seriesIndex) => (
										// Колонки ідентифікуються позицією, стабільного id немає.
										// eslint-disable-next-line react/no-array-index-key
										<TableHead key={seriesIndex} className="min-w-24 px-1">
											<div className="flex items-center gap-1">
												<Input
													value={name}
													placeholder={`Ряд ${seriesIndex + 1}`}
													onChange={(e) =>
														setSeriesName(seriesIndex, e.target.value)
													}
													data-test-id={`chart-modal-series-name-${seriesIndex}`}
												/>
												{!isPie && draft.seriesNames.length > 1 && (
													<Button
														variant="ghost"
														size="icon"
														className="size-8 shrink-0"
														title="Видалити ряд"
														onClick={() => removeSeries(seriesIndex)}
													>
														<X className="size-4" />
													</Button>
												)}
											</div>
										</TableHead>
									))}
								<TableHead className="w-10 px-1">
									{!isPie && (
										<Button
											variant="ghost"
											size="icon"
											className="size-8"
											title="Додати ряд даних"
											disabled={draft.seriesNames.length >= MAX_SERIES}
											onClick={addSeries}
											data-test-id="chart-modal-add-series"
										>
											<Plus className="size-4" />
										</Button>
									)}
								</TableHead>
							</TableRow>
						</TableHeader>
						<TableBody>
							{draft.rows.map((row, rowIndex) => (
								// eslint-disable-next-line react/no-array-index-key
								<TableRow key={rowIndex}>
									<TableCell className="px-1 py-1">
										<Input
											value={row.category}
											placeholder="Назва категорії"
											onChange={(e) =>
												setRowCategory(rowIndex, e.target.value)
											}
											data-test-id={`chart-modal-category-${rowIndex}`}
										/>
									</TableCell>
									{row.values
										.slice(0, visibleSeriesCount)
										.map((value, seriesIndex) => (
											// eslint-disable-next-line react/no-array-index-key
											<TableCell key={seriesIndex} className="px-1 py-1">
												<Input
													inputMode="decimal"
													value={value}
													placeholder="0"
													className={cn(
														Number.isNaN(parseCellNumber(value)) &&
															"border-red-500 focus-visible:ring-red-500",
													)}
													onChange={(e) =>
														setCellValue(
															rowIndex,
															seriesIndex,
															e.target.value,
														)
													}
													data-test-id={`chart-modal-value-${rowIndex}-${seriesIndex}`}
												/>
											</TableCell>
										))}
									<TableCell className="px-1 py-1">
										<Button
											variant="ghost"
											size="icon"
											className="size-8"
											title="Видалити рядок"
											disabled={draft.rows.length <= 1}
											onClick={() => removeRow(rowIndex)}
										>
											<Trash2 className="size-4" />
										</Button>
									</TableCell>
								</TableRow>
							))}
						</TableBody>
					</Table>
					<Button
						variant="outline"
						size="sm"
						className="justify-self-start"
						onClick={addRow}
						data-test-id="chart-modal-add-row"
					>
						<Plus className="mr-1 size-4" />
						Додати рядок
					</Button>
				</div>

				{showPreview && (
					<div className="grid gap-2">
						<Label>Попередній перегляд</Label>
						<div className="border-border rounded-md border p-2">
							{/* Явна висота обов'язкова: ResponsiveContainer не може
							    виміряти себе всередині грід-розкладки діалогу. */}
							<ChartRenderer
								data={previewData}
								className="aspect-auto h-[220px]"
							/>
						</div>
					</div>
				)}
			</div>
			<DialogFooter className="items-center gap-2">
				{validationError && (
					<p className="text-sm text-red-500">{validationError}</p>
				)}
				<Button variant="outline" onClick={onClose}>
					Скасувати
				</Button>
				<Button
					disabled={validationError !== null}
					onClick={() => {
						onSubmit(dataFromDraft(draft));
						onClose();
					}}
					data-test-id="chart-modal-confirm-btn"
				>
					Зберегти
				</Button>
			</DialogFooter>
		</>
	);
}

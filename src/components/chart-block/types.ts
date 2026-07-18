// Спільні типи для діаграм у контенті (Lexical ChartNode + публічний рендеринг).
// Без імпортів lexical — цей модуль тягнеться і в публічний бандл.

export type ChartType = "bar" | "line" | "area" | "pie";

export interface ChartSeries {
	/**
	 * Згенерований ASCII-ключ ("s1".."s5") — dataKey для recharts і ключ
	 * ChartConfig. ChartStyle емить CSS-змінні `--color-<key>`, тому сюди
	 * не можна класти користувацький текст (кирилиця — тільки в label).
	 */
	key: string;
	label: string;
	/** "var(--chart-1)".."var(--chart-5)", призначається round-robin. */
	color: string;
}

export interface ChartRow {
	category: string;
	/** Ключ серії -> значення. */
	values: Record<string, number>;
}

export interface ChartBlockData {
	chartType: ChartType;
	/** Підпис під діаграмою (figcaption). */
	title?: string;
	/** Заголовок колонки категорій у редакторі даних. */
	categoryLabel: string;
	/** Тільки для pie: кільцева діаграма (innerRadius > 0). */
	donut?: boolean;
	/** Одиниця виміру ("%", "кг", …) — додається до значень на осі, у тултіпах і підписах. */
	valueSuffix?: string;
	/** Показувати значення прямо на діаграмі, а не лише при наведенні. */
	showValues?: boolean;
	/** Pie використовує лише series[0]. */
	series: ChartSeries[];
	rows: ChartRow[];
}

export const CHART_PALETTE = [
	"var(--chart-1)",
	"var(--chart-2)",
	"var(--chart-3)",
	"var(--chart-4)",
	"var(--chart-5)",
] as const;

export const MAX_SERIES = 5;

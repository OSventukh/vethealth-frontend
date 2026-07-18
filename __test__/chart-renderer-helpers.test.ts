/**
 * Чисті хелпери рендерера діаграм: мапінг збережених даних ChartNode у
 * формат recharts/ChartConfig і коерція чисел з українською комою.
 */
import { parseCellNumber } from "@/app/(dashboard)/admin/components/Editor/Lexical/plugins/ChartsPlugin/InsertChartDialog";
import {
	toChartConfig,
	toPieConfig,
	toPieData,
	toRechartsRows,
} from "@/components/chart-block/chart-renderer";
import {
	CHART_PALETTE,
	type ChartRow,
	type ChartSeries,
} from "@/components/chart-block/types";

const SERIES: ChartSeries[] = [
	{ key: "s1", label: "Собаки", color: "var(--chart-1)" },
	{ key: "s2", label: "Коти", color: "var(--chart-2)" },
];

const ROWS: ChartRow[] = [
	{ category: "Січень", values: { s1: 12.5, s2: 7 } },
	{ category: "Лютий", values: { s1: 14 } }, // s2 відсутній
];

describe("toRechartsRows", () => {
	it("розгортає рядки у плоскі об'єкти, відсутні значення → 0", () => {
		expect(toRechartsRows(ROWS, SERIES)).toEqual([
			{ category: "Січень", s1: 12.5, s2: 7 },
			{ category: "Лютий", s1: 14, s2: 0 },
		]);
	});
});

describe("toChartConfig", () => {
	it("мапить серії у ChartConfig з label і color", () => {
		expect(toChartConfig(SERIES)).toEqual({
			s1: { label: "Собаки", color: "var(--chart-1)" },
			s2: { label: "Коти", color: "var(--chart-2)" },
		});
	});
});

describe("toPieData / toPieConfig", () => {
	it("генерує ASCII-ключі категорій і посилання на CSS-змінні", () => {
		expect(toPieData(ROWS, "s1")).toEqual([
			{ name: "c1", value: 12.5, fill: "var(--color-c1)" },
			{ name: "c2", value: 14, fill: "var(--color-c2)" },
		]);
	});

	it("конфіг містить підпис серії та категорії з палітри по колу", () => {
		const manyRows: ChartRow[] = Array.from({ length: 7 }, (_, i) => ({
			category: `Кат ${i + 1}`,
			values: { s1: i },
		}));
		const config = toPieConfig(manyRows, "Собаки");
		expect(config.value).toEqual({ label: "Собаки" });
		expect(config.c1).toEqual({ label: "Кат 1", color: CHART_PALETTE[0] });
		// Шоста категорія знову бере перший колір палітри.
		expect(config.c6).toEqual({ label: "Кат 6", color: CHART_PALETTE[0] });
		expect(config.c7).toEqual({ label: "Кат 7", color: CHART_PALETTE[1] });
	});
});

describe("parseCellNumber", () => {
	it("розуміє українську десяткову кому", () => {
		expect(parseCellNumber("12,5")).toBe(12.5);
	});

	it("порожній рядок → 0, сміття → NaN", () => {
		expect(parseCellNumber("")).toBe(0);
		expect(parseCellNumber("  ")).toBe(0);
		expect(parseCellNumber("abc")).toBeNaN();
	});

	it("звичайні числа і від'ємні значення проходять як є", () => {
		expect(parseCellNumber("42")).toBe(42);
		expect(parseCellNumber("-3.5")).toBe(-3.5);
	});
});

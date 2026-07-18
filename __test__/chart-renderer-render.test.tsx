/**
 * Регресія: recharts за замовчуванням ховає підписи осі X, які не вміщаються
 * (interval="preserveEnd") — довгі українські категорії зникали з діаграми.
 * ChartRenderer має показувати всі категорії завжди, переносячи довгі назви
 * на кілька рядків.
 */
import { render } from "@testing-library/react";
import { ChartRenderer } from "@/components/chart-block/chart-renderer";
import type { ChartBlockData } from "@/components/chart-block/types";
import "@testing-library/jest-dom";

// ResponsiveContainer підписується на ResizeObserver, якого нема в jsdom.
class ResizeObserverStub {
	observe() {}
	unobserve() {}
	disconnect() {}
}
window.ResizeObserver = window.ResizeObserver || ResizeObserverStub;

// ResponsiveContainer міряє батьківський елемент, а в jsdom розміри нульові —
// фіксуємо розмір, щоб recharts відрендерив SVG синхронно.
jest.mock("recharts", () => {
	const actual = jest.requireActual("recharts");
	return {
		...actual,
		ResponsiveContainer: (props: Record<string, unknown>) => (
			<actual.ResponsiveContainer {...props} width={600} height={300} />
		),
	};
});

// Дані з реальної статті: 8 категорій, «Молочні продукти» довша за слот осі.
const FIXTURE: ChartBlockData = {
	chartType: "bar",
	categoryLabel: "Категорія",
	valueSuffix: "%",
	showValues: true,
	series: [{ key: "s1", label: "Частка", color: "var(--chart-1)" }],
	rows: [
		{ category: "Яловичина", values: { s1: 34 } },
		{ category: "Молочні продукти", values: { s1: 17 } },
		{ category: "Курятина", values: { s1: 15 } },
		{ category: "Пшениця", values: { s1: 13 } },
		{ category: "Ягнятина", values: { s1: 5 } },
		{ category: "Яйця", values: { s1: 4 } },
		{ category: "Кукурудза", values: { s1: 4 } },
		{ category: "Рис", values: { s1: 2 } },
	],
};

describe("ChartRenderer (вісь X)", () => {
	it("рендерить усі підписи категорій, довгі — переносить на рядки", () => {
		const { container } = render(<ChartRenderer data={FIXTURE} />);
		const axisText = Array.from(
			container.querySelectorAll(".recharts-cartesian-axis-tick text"),
		)
			.map((el) => el.textContent)
			.join("|");

		for (const word of [
			"Яловичина",
			// «Молочні продукти» переноситься на два рядки-tspan.
			"Молочні",
			"продукти",
			"Курятина",
			"Пшениця",
			"Ягнятина",
			"Яйця",
			"Кукурудза",
			"Рис",
		]) {
			expect(axisText).toContain(word);
		}

		// Вісь Y підписана з одиницею виміру.
		expect(axisText).toContain("0%");
	});
});

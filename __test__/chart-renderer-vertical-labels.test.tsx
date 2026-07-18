/**
 * Регресія: підписи на вузьких екранах налазили один на одного — і назви
 * категорій під віссю X, і підписи значень (showValues). Коли найдовший
 * підпис не вміщається у свій горизонтальний слот, ChartRenderer має
 * повернути всі підписи цієї групи вертикально (rotate(-90)), а на широких
 * контейнерах — лишити горизонтальними.
 */
import { render } from "@testing-library/react";
import { ChartRenderer } from "@/components/chart-block/chart-renderer";
import type { ChartBlockData } from "@/components/chart-block/types";
import "@testing-library/jest-dom";

// На відміну від no-op стаба в chart-renderer-render.test.tsx, цей одразу
// повідомляє задану ширину контейнера — нею керує кожен тест.
let containerWidth = 0;
class FiringResizeObserver implements ResizeObserver {
	private readonly callback: ResizeObserverCallback;
	constructor(callback: ResizeObserverCallback) {
		this.callback = callback;
	}
	observe() {
		this.callback(
			[{ contentRect: { width: containerWidth } } as ResizeObserverEntry],
			this,
		);
	}
	unobserve() {}
	disconnect() {}
}
window.ResizeObserver = FiringResizeObserver;

// ResponsiveContainer міряє батьківський елемент, а в jsdom розміри нульові —
// фіксуємо розмір, щоб recharts відрендерив SVG синхронно. Global.isSsr треба
// виставити ДО завантаження індексу recharts: воно вимикає анімацію Bar через
// defaultProps (інакше LabelList не рендериться, доки анімація не завершиться,
// а в jsdom вона не завершується ніколи).
jest.mock("recharts", () => {
	const { Global } = jest.requireActual("recharts/lib/util/Global");
	Global.set("isSsr", true);
	const actual = jest.requireActual("recharts");
	return {
		...actual,
		ResponsiveContainer: (props: Record<string, unknown>) => (
			<actual.ResponsiveContainer {...props} width={600} height={300} />
		),
	};
});

const FIXTURE: ChartBlockData = {
	chartType: "bar",
	categoryLabel: "Категорія",
	valueSuffix: " грн",
	showValues: true,
	series: [{ key: "s1", label: "Ціна", color: "var(--chart-1)" }],
	rows: [
		{ category: "Сухий корм", values: { s1: 1250 } },
		{ category: "Вологий корм", values: { s1: 890 } },
		{ category: "Ласощі", values: { s1: 340 } },
		{ category: "Вітаміни", values: { s1: 560 } },
		{ category: "Іграшки", values: { s1: 210 } },
		{ category: "Амуніція", values: { s1: 430 } },
	],
};

function valueLabels(container: HTMLElement) {
	return Array.from(container.querySelectorAll(".recharts-label-list text"));
}

function axisTicks(container: HTMLElement) {
	return Array.from(
		container.querySelectorAll(".recharts-cartesian-axis-tick text"),
		// Вісь Y теж має тики — відсіюємо її за формою значень ("N грн").
	).filter((el) => !/грн/.test(el.textContent ?? ""));
}

describe("ChartRenderer (підписи значень)", () => {
	it("на вузькому контейнері повертає підписи вертикально", () => {
		containerWidth = 320;
		const { container } = render(<ChartRenderer data={FIXTURE} />);

		const labels = valueLabels(container);
		expect(labels).toHaveLength(FIXTURE.rows.length);
		expect(labels.map((el) => el.textContent)).toContain("1250 грн");
		for (const label of labels) {
			expect(label.getAttribute("transform")).toMatch(/rotate\(-90/);
		}
	});

	it("на широкому контейнері лишає підписи горизонтальними", () => {
		containerWidth = 1000;
		const { container } = render(<ChartRenderer data={FIXTURE} />);

		const labels = valueLabels(container);
		expect(labels).toHaveLength(FIXTURE.rows.length);
		expect(labels.map((el) => el.textContent)).toContain("1250 грн");
		for (const label of labels) {
			expect(label.getAttribute("transform") ?? "").not.toMatch(/rotate\(-90/);
		}
	});
});

describe("ChartRenderer (категорії осі X)", () => {
	it("на вузькому контейнері повертає категорії вертикально, без переносів", () => {
		containerWidth = 320;
		const { container } = render(<ChartRenderer data={FIXTURE} />);

		const ticks = axisTicks(container);
		expect(ticks).toHaveLength(FIXTURE.rows.length);
		// Назва цілком одним рядком (горизонтальний варіант ріже на tspan).
		expect(ticks.map((el) => el.textContent)).toContain("Вологий корм");
		for (const tick of ticks) {
			expect(tick.getAttribute("transform")).toMatch(/rotate\(-90/);
		}
	});

	it("на широкому контейнері лишає категорії горизонтальними", () => {
		containerWidth = 1000;
		const { container } = render(<ChartRenderer data={FIXTURE} />);

		const ticks = axisTicks(container);
		expect(ticks).toHaveLength(FIXTURE.rows.length);
		for (const tick of ticks) {
			expect(tick.getAttribute("transform") ?? "").not.toMatch(/rotate\(-90/);
		}
	});
});

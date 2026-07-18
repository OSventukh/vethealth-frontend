/**
 * Wiring-тест діалогу «Вставити діаграму»: таблиця-редактор має зібрати
 * ChartBlockData зі згенерованими ключами серій (s1..sN), кольорами з
 * палітри та числами, розпарсеними з української коми.
 */
import { fireEvent, render } from "@testing-library/react";
import InsertChartDialog from "@/app/(dashboard)/admin/components/Editor/Lexical/plugins/ChartsPlugin/InsertChartDialog";
import type { ChartBlockData } from "@/components/chart-block/types";
import "@testing-library/jest-dom";

// Прев'ю тягне recharts, чий ResponsiveContainer сипле warning-ами про
// нульовий розмір у jsdom — рендерер у цьому тесті не потрібен.
jest.mock("../src/components/chart-block/chart-renderer", () => ({
	ChartRenderer: () => null,
}));

// Base UI Switch конструює PointerEvent у клік-хендлері, а jsdom його не
// реалізує — вистачає поліфіла поверх MouseEvent.
if (!window.PointerEvent) {
	class PointerEventPolyfill extends MouseEvent {}
	// @ts-expect-error jsdom не має PointerEvent
	window.PointerEvent = PointerEventPolyfill;
}

// Вендорений код використовує data-test-id (з дефісом), а не data-testid.
const byTestId = (id: string): HTMLElement => {
	const element = document.querySelector(`[data-test-id="${id}"]`);
	if (!element) throw new Error(`No element with data-test-id="${id}"`);
	return element as HTMLElement;
};

describe("InsertChartDialog", () => {
	it("блокує збереження, поки категорії порожні", () => {
		render(
			<InsertChartDialog onSubmit={jest.fn()} onClose={jest.fn()} />,
		);
		expect(byTestId("chart-modal-confirm-btn")).toBeDisabled();
	});

	it("збирає payload зі згенерованими ключами серій і числами з комою", () => {
		const onSubmit = jest.fn();
		const onClose = jest.fn();
		render(<InsertChartDialog onSubmit={onSubmit} onClose={onClose} />);

		fireEvent.change(byTestId("chart-modal-title-input"), {
			target: { value: "Вага тварин" },
		});
		fireEvent.change(byTestId("chart-modal-suffix-input"), {
			target: { value: "%" },
		});
		fireEvent.click(byTestId("chart-modal-show-values-switch"));
		fireEvent.change(byTestId("chart-modal-category-label"), {
			target: { value: "Місяць" },
		});
		for (const [rowIndex, category] of [
			"Січень",
			"Лютий",
			"Березень",
		].entries()) {
			fireEvent.change(byTestId(`chart-modal-category-${rowIndex}`), {
				target: { value: category },
			});
		}

		fireEvent.change(byTestId("chart-modal-series-name-0"), {
			target: { value: "Собаки" },
		});
		fireEvent.click(byTestId("chart-modal-add-series"));
		fireEvent.change(byTestId("chart-modal-series-name-1"), {
			target: { value: "Коти" },
		});

		// Українська десяткова кома має перетворитись на крапку.
		fireEvent.change(byTestId("chart-modal-value-0-0"), {
			target: { value: "12,5" },
		});
		fireEvent.change(byTestId("chart-modal-value-0-1"), {
			target: { value: "7" },
		});

		const confirm = byTestId("chart-modal-confirm-btn");
		expect(confirm).not.toBeDisabled();
		fireEvent.click(confirm);

		expect(onSubmit).toHaveBeenCalledTimes(1);
		const payload = onSubmit.mock.calls[0][0] as ChartBlockData;
		expect(payload.chartType).toBe("bar");
		expect(payload.title).toBe("Вага тварин");
		expect(payload.categoryLabel).toBe("Місяць");
		expect(payload.valueSuffix).toBe("%");
		expect(payload.showValues).toBe(true);
		expect(payload.series).toEqual([
			{ key: "s1", label: "Собаки", color: "var(--chart-1)" },
			{ key: "s2", label: "Коти", color: "var(--chart-2)" },
		]);
		expect(payload.rows).toEqual([
			{ category: "Січень", values: { s1: 12.5, s2: 7 } },
			{ category: "Лютий", values: { s1: 0, s2: 0 } },
			{ category: "Березень", values: { s1: 0, s2: 0 } },
		]);
		expect(onClose).toHaveBeenCalledTimes(1);
	});

	it("некоректне число блокує збереження", () => {
		const onSubmit = jest.fn();
		render(<InsertChartDialog onSubmit={onSubmit} onClose={jest.fn()} />);

		for (const rowIndex of [0, 1, 2]) {
			fireEvent.change(byTestId(`chart-modal-category-${rowIndex}`), {
				target: { value: `Кат ${rowIndex}` },
			});
		}
		fireEvent.change(byTestId("chart-modal-value-0-0"), {
			target: { value: "не число" },
		});

		expect(byTestId("chart-modal-confirm-btn")).toBeDisabled();
	});

	it("префілиться з initialData у режимі редагування", () => {
		const initialData: ChartBlockData = {
			chartType: "line",
			title: "Динаміка",
			categoryLabel: "Рік",
			series: [{ key: "s1", label: "Візити", color: "var(--chart-1)" }],
			rows: [
				{ category: "2024", values: { s1: 10 } },
				{ category: "2025", values: { s1: 20 } },
			],
		};
		render(
			<InsertChartDialog
				onSubmit={jest.fn()}
				onClose={jest.fn()}
				initialData={initialData}
			/>,
		);

		expect(byTestId("chart-modal-title-input")).toHaveValue("Динаміка");
		expect(byTestId("chart-modal-category-label")).toHaveValue("Рік");
		expect(byTestId("chart-modal-series-name-0")).toHaveValue("Візити");
		expect(byTestId("chart-modal-category-0")).toHaveValue("2024");
		expect(byTestId("chart-modal-value-1-0")).toHaveValue("20");
		expect(byTestId("chart-modal-confirm-btn")).not.toBeDisabled();
	});
});

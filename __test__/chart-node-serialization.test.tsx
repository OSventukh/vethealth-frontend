/**
 * Roundtrip серіалізації ChartNode: exportJSON → parseEditorState → getData
 * мусить зберегти всі дані діаграми (контент постів живе саме в цьому JSON).
 * Гола нода без editor-контексту не працює ($applyNodeReplacement), тому
 * використовуємо LexicalComposer-харнес, як editor-image-render.test.tsx.
 */
import { LexicalComposer } from "@lexical/react/LexicalComposer";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { render } from "@testing-library/react";
import { $getRoot, type LexicalEditor } from "lexical";
import {
	$createChartNode,
	$isChartNode,
	ChartNode,
} from "@/app/(dashboard)/admin/components/Editor/Lexical/nodes/ChartNode";
import type { ChartBlockData } from "@/components/chart-block/types";

let capturedEditor: LexicalEditor | null = null;

function CaptureEditor() {
	const [editor] = useLexicalComposerContext();
	capturedEditor = editor;
	return null;
}

function createEditor(): LexicalEditor {
	capturedEditor = null;
	render(
		<LexicalComposer
			initialConfig={{
				namespace: "test",
				nodes: [ChartNode],
				onError: (error) => {
					throw error;
				},
			}}
		>
			<CaptureEditor />
		</LexicalComposer>,
	);
	if (!capturedEditor) throw new Error("Editor not captured");
	return capturedEditor;
}

const FIXTURE: ChartBlockData = {
	chartType: "bar",
	title: "Вага за місяцями",
	categoryLabel: "Місяць",
	valueSuffix: "%",
	showValues: true,
	series: [
		{ key: "s1", label: "Собаки", color: "var(--chart-1)" },
		{ key: "s2", label: "Коти", color: "var(--chart-2)" },
	],
	rows: [
		{ category: "Січень", values: { s1: 12.5, s2: 7 } },
		{ category: "Лютий", values: { s1: 14, s2: 8.2 } },
	],
};

describe("ChartNode", () => {
	it("exportJSON → importJSON зберігає всі дані діаграми", () => {
		const editor = createEditor();

		editor.update(
			() => {
				// Композер стартує з порожнім параграфом — прибираємо його,
				// щоб діаграма була першим нащадком root.
				const root = $getRoot();
				root.clear();
				root.append($createChartNode(FIXTURE));
			},
			{ discrete: true },
		);

		const json = editor.getEditorState().toJSON();
		const serialized = (json.root.children as Record<string, unknown>[])[0];
		expect(serialized.type).toBe("chart");
		expect(serialized.version).toBe(1);
		expect(serialized.chartType).toBe("bar");
		expect(serialized.title).toBe("Вага за місяцями");
		expect(serialized.categoryLabel).toBe("Місяць");
		expect(serialized.valueSuffix).toBe("%");
		expect(serialized.showValues).toBe(true);
		expect(serialized.series).toEqual(FIXTURE.series);
		expect(serialized.rows).toEqual(FIXTURE.rows);

		// Роздрук і повторний парс — саме так контент живе у БД.
		const reparsed = editor.parseEditorState(JSON.stringify(json));
		let roundtripped: ChartBlockData | null = null;
		reparsed.read(() => {
			const node = $getRoot().getFirstChild();
			if ($isChartNode(node)) {
				roundtripped = node.getData();
			}
		});
		expect(roundtripped).toEqual({ ...FIXTURE, donut: false });
	});

	it("getData повертає копії — мутація результату не чіпає ноду", () => {
		const editor = createEditor();
		editor.update(
			() => {
				// Композер стартує з порожнім параграфом — прибираємо його,
				// щоб діаграма була першим нащадком root.
				const root = $getRoot();
				root.clear();
				root.append($createChartNode(FIXTURE));
			},
			{ discrete: true },
		);

		editor.getEditorState().read(() => {
			const node = $getRoot().getFirstChild();
			if (!$isChartNode(node)) throw new Error("ChartNode expected");
			const first = node.getData();
			first.rows[0].values.s1 = 999;
			first.series[0].label = "Змінено";
			const second = node.getData();
			expect(second.rows[0].values.s1).toBe(12.5);
			expect(second.series[0].label).toBe("Собаки");
		});
	});

	it("exportDOM віддає таблицю даних із data-lexical-chart", () => {
		const editor = createEditor();
		editor.update(
			() => {
				// Композер стартує з порожнім параграфом — прибираємо його,
				// щоб діаграма була першим нащадком root.
				const root = $getRoot();
				root.clear();
				root.append($createChartNode(FIXTURE));
			},
			{ discrete: true },
		);

		editor.getEditorState().read(() => {
			const node = $getRoot().getFirstChild();
			if (!$isChartNode(node)) throw new Error("ChartNode expected");
			const { element } = node.exportDOM();
			if (!(element instanceof HTMLTableElement)) {
				throw new Error("Expected <table> export");
			}
			expect(element.getAttribute("data-lexical-chart")).toContain(
				'"chartType":"bar"',
			);
			const headers = Array.from(element.querySelectorAll("th")).map(
				(th) => th.textContent,
			);
			expect(headers).toEqual(["Місяць", "Собаки", "Коти"]);
			// valueSuffix додається до значень у клітинках.
			const firstRowCells = Array.from(
				element.querySelectorAll("tbody tr")[0].querySelectorAll("td"),
			).map((td) => td.textContent);
			expect(firstRowCells).toEqual(["Січень", "12.5%", "7%"]);
		});
	});
});

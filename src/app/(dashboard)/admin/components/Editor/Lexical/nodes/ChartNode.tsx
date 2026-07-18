import type {
	DOMExportOutput,
	EditorConfig,
	LexicalNode,
	NodeKey,
	SerializedLexicalNode,
	Spread,
} from "lexical";

import { $applyNodeReplacement, DecoratorNode } from "lexical";
import * as React from "react";
import { Suspense } from "react";
import type {
	ChartBlockData,
	ChartRow,
	ChartSeries,
	ChartType,
} from "@/components/chart-block/types";

const ChartComponent = React.lazy(() => import("./ChartComponent"));

export type ChartPayload = ChartBlockData & { key?: NodeKey };

// Поля продубльовані інлайном (а не через ChartBlockData): інтерфейс не має
// implicit index signature, тож Spread<interface, …> не задовольняє
// Record<string, unknown> у сигнатурі importJSON (SerializedImageNode
// написаний так само).
export type SerializedChartNode = Spread<
	{
		chartType: ChartType;
		title?: string;
		categoryLabel: string;
		donut?: boolean;
		valueSuffix?: string;
		showValues?: boolean;
		series: ChartSeries[];
		rows: ChartRow[];
	},
	SerializedLexicalNode
>;

// Копіюємо масиви/об'єкти цілком: Lexical у dev заморожує стан, а clone /
// setData не мають ділити посилання на rows/series із зовнішніми об'єктами.
function cloneData(data: ChartBlockData): ChartBlockData {
	return {
		chartType: data.chartType,
		title: data.title,
		categoryLabel: data.categoryLabel,
		donut: data.donut,
		valueSuffix: data.valueSuffix,
		showValues: data.showValues,
		series: (data.series || []).map((s) => ({ ...s })),
		rows: (data.rows || []).map((row) => ({
			category: row.category,
			values: { ...row.values },
		})),
	};
}

export class ChartNode extends DecoratorNode<React.ReactElement> {
	__chartType: ChartBlockData["chartType"];
	__title: string | undefined;
	__categoryLabel: string;
	__donut: boolean;
	__valueSuffix: string | undefined;
	__showValues: boolean;
	__series: ChartBlockData["series"];
	__rows: ChartBlockData["rows"];

	static getType(): string {
		return "chart";
	}

	static clone(node: ChartNode): ChartNode {
		return new ChartNode(
			{
				chartType: node.__chartType,
				title: node.__title,
				categoryLabel: node.__categoryLabel,
				donut: node.__donut,
				valueSuffix: node.__valueSuffix,
				showValues: node.__showValues,
				series: node.__series,
				rows: node.__rows,
			},
			node.__key,
		);
	}

	static importJSON(serializedNode: SerializedChartNode): ChartNode {
		const {
			chartType,
			title,
			categoryLabel,
			donut,
			valueSuffix,
			showValues,
			series,
			rows,
		} = serializedNode;
		return $createChartNode({
			chartType,
			title,
			categoryLabel,
			donut,
			valueSuffix,
			showValues,
			series: series || [],
			rows: rows || [],
		});
	}

	constructor(data: ChartBlockData, key?: NodeKey) {
		super(key);
		const copy = cloneData(data);
		this.__chartType = copy.chartType;
		this.__title = copy.title;
		this.__categoryLabel = copy.categoryLabel || "Категорія";
		this.__donut = copy.donut || false;
		this.__valueSuffix = copy.valueSuffix;
		this.__showValues = copy.showValues || false;
		this.__series = copy.series;
		this.__rows = copy.rows;
	}

	exportJSON(): SerializedChartNode {
		return {
			...this.getData(),
			type: "chart",
			version: 1,
		};
	}

	// Для зовнішнього clipboard (Word/Gmail тощо) діаграма має сенс лише як
	// таблиця даних. Вставка всередині Lexical іде через JSON-формат буфера,
	// тож сюди потрапляє тільки зовнішній експорт.
	exportDOM(): DOMExportOutput {
		const data = this.getData();
		const table = document.createElement("table");
		table.setAttribute("data-lexical-chart", JSON.stringify(data));

		const thead = document.createElement("thead");
		const headRow = document.createElement("tr");
		for (const text of [
			data.categoryLabel,
			...data.series.map((s) => s.label),
		]) {
			const th = document.createElement("th");
			th.textContent = text;
			headRow.appendChild(th);
		}
		thead.appendChild(headRow);
		table.appendChild(thead);

		const tbody = document.createElement("tbody");
		for (const row of data.rows) {
			const tr = document.createElement("tr");
			const categoryCell = document.createElement("td");
			categoryCell.textContent = row.category;
			tr.appendChild(categoryCell);
			for (const s of data.series) {
				const td = document.createElement("td");
				td.textContent = `${row.values[s.key] ?? 0}${data.valueSuffix || ""}`;
				tr.appendChild(td);
			}
			tbody.appendChild(tr);
		}
		table.appendChild(tbody);

		return { element: table };
	}

	getData(): ChartBlockData {
		return cloneData({
			chartType: this.__chartType,
			title: this.__title,
			categoryLabel: this.__categoryLabel,
			donut: this.__donut,
			valueSuffix: this.__valueSuffix,
			showValues: this.__showValues,
			series: this.__series,
			rows: this.__rows,
		});
	}

	setData(data: ChartBlockData): void {
		const writable = this.getWritable();
		const copy = cloneData(data);
		writable.__chartType = copy.chartType;
		writable.__title = copy.title;
		writable.__categoryLabel = copy.categoryLabel || "Категорія";
		writable.__donut = copy.donut || false;
		writable.__valueSuffix = copy.valueSuffix;
		writable.__showValues = copy.showValues || false;
		writable.__series = copy.series;
		writable.__rows = copy.rows;
	}

	// View

	createDOM(config: EditorConfig): HTMLElement {
		const div = document.createElement("div");
		const className = config.theme.chart;
		if (className !== undefined) {
			div.className = className;
		}
		return div;
	}

	updateDOM(): false {
		return false;
	}

	isInline(): false {
		return false;
	}

	decorate(): React.ReactElement {
		return (
			<Suspense fallback={null}>
				<ChartComponent nodeKey={this.getKey()} data={this.getData()} />
			</Suspense>
		);
	}
}

export function $createChartNode(payload: ChartPayload): ChartNode {
	const { key, ...data } = payload;
	return $applyNodeReplacement(new ChartNode(data, key));
}

export function $isChartNode(
	node: LexicalNode | null | undefined,
): node is ChartNode {
	return node instanceof ChartNode;
}

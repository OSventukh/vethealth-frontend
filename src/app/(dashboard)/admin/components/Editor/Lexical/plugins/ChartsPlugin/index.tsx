import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { $insertNodeToNearestRoot } from "@lexical/utils";
import {
	$createParagraphNode,
	COMMAND_PRIORITY_EDITOR,
	createCommand,
	type LexicalCommand,
} from "lexical";
import { useEffect } from "react";
import type { ChartBlockData } from "@/components/chart-block/types";
import { $createChartNode, ChartNode } from "../../nodes/ChartNode";

export const INSERT_CHART_COMMAND: LexicalCommand<ChartBlockData> =
	createCommand("INSERT_CHART_COMMAND");

export default function ChartsPlugin(): null {
	const [editor] = useLexicalComposerContext();

	useEffect(() => {
		if (!editor.hasNodes([ChartNode])) {
			throw new Error("ChartsPlugin: ChartNode not registered on editor");
		}

		// Стрілочна навігація навколо декоратора працює з коробки через
		// NodeSelection ($onEscapeDown/Up з LayoutPlugin тут не потрібні —
		// вони для ElementNode, всередині якого може стояти каретка).
		return editor.registerCommand<ChartBlockData>(
			INSERT_CHART_COMMAND,
			(payload) => {
				const chartNode = $createChartNode(payload);
				$insertNodeToNearestRoot(chartNode);
				// Діаграма останнім блоком лишає курсор у пастці —
				// додаємо порожній параграф слідом.
				if (chartNode.getNextSibling() === null) {
					chartNode.insertAfter($createParagraphNode());
				}
				return true;
			},
			COMMAND_PRIORITY_EDITOR,
		);
	}, [editor]);

	return null;
}

import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { useLexicalNodeSelection } from "@lexical/react/useLexicalNodeSelection";
import { mergeRegister } from "@lexical/utils";
import clsx from "clsx";
import {
	$getNodeByKey,
	$getSelection,
	$isNodeSelection,
	CLICK_COMMAND,
	COMMAND_PRIORITY_LOW,
	KEY_BACKSPACE_COMMAND,
	KEY_DELETE_COMMAND,
	type NodeKey,
} from "lexical";
import { PencilLine } from "lucide-react";
import type * as React from "react";
import { useCallback, useEffect, useRef } from "react";
import { ChartBlock } from "@/components/chart-block";
import type { ChartBlockData } from "@/components/chart-block/types";
import useModal from "../hooks/useModal";
import InsertChartDialog from "../plugins/ChartsPlugin/InsertChartDialog";
import { $isChartNode } from "./ChartNode";

export default function ChartComponent({
	data,
	nodeKey,
}: {
	data: ChartBlockData;
	nodeKey: NodeKey;
}): React.ReactElement {
	const [editor] = useLexicalComposerContext();
	const [isSelected, setSelected, clearSelection] =
		useLexicalNodeSelection(nodeKey);
	const wrapperRef = useRef<HTMLDivElement | null>(null);
	const [modal, showModal] = useModal();

	const onDelete = useCallback(
		(payload: KeyboardEvent) => {
			if (isSelected && $isNodeSelection($getSelection())) {
				payload.preventDefault();
				const node = $getNodeByKey(nodeKey);
				if ($isChartNode(node)) {
					node.remove();
				}
			}
			return false;
		},
		[isSelected, nodeKey],
	);

	const onClick = useCallback(
		(event: MouseEvent) => {
			const wrapper = wrapperRef.current;
			if (
				wrapper !== null &&
				event.target instanceof Node &&
				wrapper.contains(event.target)
			) {
				if (event.shiftKey) {
					setSelected(!isSelected);
				} else {
					clearSelection();
					setSelected(true);
				}
				return true;
			}
			return false;
		},
		[isSelected, setSelected, clearSelection],
	);

	useEffect(() => {
		return mergeRegister(
			editor.registerCommand<MouseEvent>(
				CLICK_COMMAND,
				onClick,
				COMMAND_PRIORITY_LOW,
			),
			editor.registerCommand(
				KEY_DELETE_COMMAND,
				onDelete,
				COMMAND_PRIORITY_LOW,
			),
			editor.registerCommand(
				KEY_BACKSPACE_COMMAND,
				onDelete,
				COMMAND_PRIORITY_LOW,
			),
		);
	}, [editor, onClick, onDelete]);

	const saveData = (next: ChartBlockData) => {
		editor.update(() => {
			const node = $getNodeByKey(nodeKey);
			if ($isChartNode(node)) {
				node.setData(next);
			}
		});
	};

	const openEditDialog = () => {
		showModal(
			"Редагувати діаграму",
			(onModalClose) => (
				<InsertChartDialog
					initialData={data}
					onSubmit={saveData}
					onClose={onModalClose}
				/>
			),
			"max-w-3xl",
		);
	};

	return (
		<>
			<div
				ref={wrapperRef}
				className={clsx(
					"relative",
					isSelected && "outline outline-2 outline-blue-700",
				)}
			>
				<ChartBlock data={data} />
				{!isSelected && (
					// Перший клік має виділити ноду, а не потрапити у власні
					// mouse-хендлери Recharts; після виділення оверлей зникає,
					// тож тултіпи діаграми працюють і в редакторі.
					<div className="absolute inset-0 z-10" aria-hidden="true" />
				)}
				{isSelected && (
					<button
						type="button"
						// Інакше mousedown у редакторі знімає виділення з ноди
						// і кнопка зникає раніше, ніж настане click.
						onMouseDown={(event) => event.preventDefault()}
						onClick={openEditDialog}
						className="bg-background/90 text-foreground hover:bg-background absolute top-2 right-2 z-10 inline-flex items-center gap-1.5 rounded-md px-2 py-1 text-xs font-semibold shadow-sm transition-colors"
						data-test-id="chart-edit-btn"
					>
						<PencilLine size={13} />
						Редагувати
					</button>
				)}
			</div>
			{modal}
		</>
	);
}

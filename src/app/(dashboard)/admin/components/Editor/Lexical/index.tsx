"use client";
import { ContentEditable } from "@lexical/react/LexicalContentEditable";
import { LexicalExtensionComposer } from "@lexical/react/LexicalExtensionComposer";
import { OnChangePlugin } from "@lexical/react/LexicalOnChangePlugin";
import {
	$getRoot,
	defineExtension,
	type InitialEditorStateType,
} from "lexical";
import { useMemo, useState } from "react";
import { cn } from "@/lib/utils";
import { editorExtension } from "./config";
import ChartsPlugin from "./plugins/ChartsPlugin";
import DraggableBlockPlugin from "./plugins/DraggableBlockPlugin";
import FloatingLinkEditorPlugin from "./plugins/FloatingLinkEditorPlugin";
import FloatingTextFormatToolbarPlugin from "./plugins/FloatingTextFormatToolbarPlugin";
import ImagesPlugin from "./plugins/ImagesPlugin";
import { LayoutPlugin } from "./plugins/LayoutPlugin/LayoutPlugin";
import ToolbarPlugin from "./plugins/ToolbarPlugin";
import TooltipPlugin from "./plugins/TooltipPlugin";

type Props = {
	onChangeTitle?: (title: string) => void;
	onChangeContent?: (content: string) => void;
	onChangeText?: (text: string) => void;
	initialTitle?: string | undefined;
	initialContent?: InitialEditorStateType | undefined;
	className?: string;
	hideTitle?: boolean;
	toolbarWrapperClassName?: string;
	contentClassName?: string;
	footer?: React.ReactNode;
};

export default function Lexical({
	onChangeTitle,
	onChangeContent,
	onChangeText,
	initialContent,
	initialTitle,
	className,
	hideTitle,
	toolbarWrapperClassName,
	contentClassName,
	footer,
}: Props) {
	const [floatingAnchorElem, setFloatingAnchorElem] =
		useState<HTMLDivElement | null>(null);
	const [isLinkEditMode, setIsLinkEditMode] = useState<boolean>(false);

	// Freeze the initial content at mount (LexicalComposer's initialConfig had
	// the same read-once semantics) so a re-render never recreates the editor.
	const [initialEditorState] = useState(() => initialContent);
	const extension = useMemo(
		() =>
			defineExtension({
				dependencies: [editorExtension],
				name: "[root]",
				// Omit the field when there is no content: an explicit `null`
				// disables InitialStateExtension's default initializer, leaving
				// the root without the empty paragraph on first load (the caret
				// then sits above the placeholder until the first keystroke).
				...(initialEditorState != null
					? { $initialEditorState: initialEditorState }
					: {}),
			}),
		[initialEditorState],
	);

	const onRef = (_floatingAnchorElem: HTMLDivElement) => {
		if (_floatingAnchorElem !== null) {
			setFloatingAnchorElem(_floatingAnchorElem);
		}
	};

	return (
		<div
			className={cn(
				"relative flex h-[calc(100dvh-10rem)] w-full max-w-(--breakpoint-lg) flex-col gap-2 overflow-auto md:h-[calc(100dvh-8rem)]",
				className,
			)}
		>
			<LexicalExtensionComposer extension={extension} contentEditable={null}>
				{!hideTitle && (
					<input
						type="text"
						placeholder="Заголовок"
						className="border-border bg-background w-full rounded-2xl border-[1px] px-5 py-2 text-2xl outline-0 placeholder:text-slate-500 md:px-10 md:py-4"
						onChange={(event) =>
							onChangeTitle && onChangeTitle(event.target.value)
						}
						value={initialTitle}
					/>
				)}
				{toolbarWrapperClassName ? (
					<div className={toolbarWrapperClassName}>
						<ToolbarPlugin setIsLinkEditMode={setIsLinkEditMode} />
					</div>
				) : (
					<ToolbarPlugin setIsLinkEditMode={setIsLinkEditMode} />
				)}

				{floatingAnchorElem && (
					<>
						<DraggableBlockPlugin anchorElem={floatingAnchorElem} />
						<FloatingLinkEditorPlugin
							anchorElem={floatingAnchorElem}
							isLinkEditMode={isLinkEditMode}
							setIsLinkEditMode={setIsLinkEditMode}
						/>
					</>
				)}

				<ImagesPlugin />

				<div
					className={cn(
						"prose border-border bg-background relative mt-2 h-full max-w-none resize-y gap-1 overflow-hidden rounded-2xl border-[1px] text-slate-900 md:h-[calc(100%_-_75px)]",
						contentClassName,
					)}
					ref={onRef}
				>
					{/* flex-1 інертний у дефолтному блоковому контейнері; працює лише
					    коли contentClassName робить контейнер flex-col (редактор
					    постів) — тоді зона редагування розтягується, а footer
					    притискається до низу картки. */}
					<div className="relative h-full flex-1 overflow-auto">
						<ContentEditable
							aria-placeholder="Введіть текст..."
							placeholder={
								<div className="pointer-events-none absolute top-4 left-10 inline-block text-lg text-slate-500">
									<p>Введіть текст...</p>
								</div>
							}
						/>
					</div>
					{footer}
				</div>

				<FloatingTextFormatToolbarPlugin />
				<LayoutPlugin />
				<TooltipPlugin />
				<ChartsPlugin />
				<OnChangePlugin
					onChange={(state) => {
						const stringifiedContent = JSON.stringify(state);
						onChangeContent && onChangeContent(stringifiedContent);
						if (onChangeText) {
							onChangeText(state.read(() => $getRoot().getTextContent()));
						}
					}}
				/>
			</LexicalExtensionComposer>
		</div>
	);
}

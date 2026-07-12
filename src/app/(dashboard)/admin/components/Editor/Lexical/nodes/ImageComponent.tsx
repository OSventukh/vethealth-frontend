import type {
	BaseSelection,
	LexicalCommand,
	LexicalEditor,
	NodeKey,
	NodeSelection,
	RangeSelection,
} from "lexical";

import "./ImageNode.css";

import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { useLexicalNodeSelection } from "@lexical/react/useLexicalNodeSelection";
import { mergeRegister } from "@lexical/utils";
import clsx from "clsx";
import {
	$getNodeByKey,
	$getSelection,
	$isNodeSelection,
	$isRangeSelection,
	$setSelection,
	CLICK_COMMAND,
	COMMAND_PRIORITY_LOW,
	createCommand,
	DRAGSTART_COMMAND,
	KEY_BACKSPACE_COMMAND,
	KEY_DELETE_COMMAND,
	KEY_ENTER_COMMAND,
	KEY_ESCAPE_COMMAND,
	SELECTION_CHANGE_COMMAND,
} from "lexical";
import { PencilLine } from "lucide-react";
import type * as React from "react";
import { useCallback, useEffect, useRef, useState } from "react";
import useModal from "../hooks/useModal";
import ImageResizer from "../ui/ImageResizer";
import EditAltTextDialog from "./EditAltTextDialog";
import { $isImageNode } from "./ImageNode";

export const RIGHT_CLICK_IMAGE_COMMAND: LexicalCommand<MouseEvent> =
	createCommand("RIGHT_CLICK_IMAGE_COMMAND");

/**
 * Рендерить <img> напряму, без suspense-прелоада з playground-версії.
 * Той прелоад створював `new Image()` поза DOM і «підвішував» компонент до
 * onload: Firefox скасовує такі осиротілі запити (NS_BINDING_ABORTED), onload
 * не настає — і картинка назавжди лишалася в Suspense-фолбеку (тобто невидимою).
 * Браузер сам завантажує <img> у DOM; скасовувати нема чого.
 */
function EditorImage({
	altText,
	className,
	imageRef,
	src,
	width,
	height,
	maxWidth,
}: {
	altText: string;
	className: string | null;
	height: "inherit" | number;
	imageRef: { current: null | HTMLImageElement };
	maxWidth: number;
	src: string;
	width: "inherit" | number;
}): React.ReactElement {
	return (
		// eslint-disable-next-line @next/next/no-img-element
		<img
			className={className || undefined}
			src={src}
			alt={altText}
			ref={imageRef}
			style={{
				height,
				maxWidth,
				width,
			}}
			draggable="false"
		/>
	);
}

export default function ImageComponent({
	src,
	altText,
	nodeKey,
	width,
	height,
	maxWidth,
	resizable,
	showCaption,
	caption,
	captionsEnabled,
}: {
	altText: string;
	caption?: string;
	height: "inherit" | number;
	maxWidth: number;
	nodeKey: NodeKey;
	resizable: boolean;
	showCaption: boolean;
	src: string;
	width: "inherit" | number;
	captionsEnabled: boolean;
}): React.ReactElement {
	const imageRef = useRef<null | HTMLImageElement>(null);
	const buttonRef = useRef<HTMLButtonElement | null>(null);
	const [isSelected, setSelected, clearSelection] =
		useLexicalNodeSelection(nodeKey);
	const [isResizing, setIsResizing] = useState<boolean>(false);
	const [editor] = useLexicalComposerContext();
	const [selection, setSelection] = useState<
		RangeSelection | NodeSelection | BaseSelection | null
	>(null);
	const [modal, showModal] = useModal();
	const activeEditorRef = useRef<LexicalEditor | null>(null);
	const captionRef = useRef<HTMLInputElement>(null);
	const onDelete = useCallback(
		(payload: KeyboardEvent) => {
			if (isSelected && $isNodeSelection($getSelection())) {
				const event: KeyboardEvent = payload;
				event.preventDefault();
				const node = $getNodeByKey(nodeKey);
				if ($isImageNode(node)) {
					node.remove();
				}
			}
			return false;
		},
		[isSelected, nodeKey],
	);

	const onEnter = useCallback(
		(event: KeyboardEvent) => {
			const latestSelection = $getSelection();
			const buttonElem = buttonRef.current;
			if (
				isSelected &&
				$isNodeSelection(latestSelection) &&
				latestSelection.getNodes().length === 1
			) {
				if (showCaption) {
					// Move focus into nested editor
					$setSelection(null);
					event.preventDefault();
					captionRef?.current && captionRef.current.focus();
					return true;
				} else if (
					buttonElem !== null &&
					buttonElem !== document.activeElement
				) {
					event.preventDefault();
					buttonElem.focus();
					return true;
				}
			}
			return false;
		},
		[isSelected, showCaption],
	);

	const onEscape = useCallback(
		(event: KeyboardEvent) => {
			if (buttonRef.current === event.target) {
				$setSelection(null);
				editor.update(() => {
					setSelected(true);
					const parentRootElement = editor.getRootElement();
					if (parentRootElement !== null) {
						parentRootElement.focus();
					}
				});
				return true;
			}
			return false;
		},
		[editor, setSelected],
	);

	const onClick = useCallback(
		(payload: MouseEvent) => {
			const event = payload;

			if (isResizing) {
				return true;
			}
			if (event.target === imageRef.current) {
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
		[isResizing, isSelected, setSelected, clearSelection],
	);

	const onRightClick = useCallback(
		(event: MouseEvent): void => {
			editor.getEditorState().read(() => {
				const latestSelection = $getSelection();
				const domElement = event.target as HTMLElement;
				if (
					domElement.tagName === "IMG" &&
					$isRangeSelection(latestSelection) &&
					latestSelection.getNodes().length === 1
				) {
					editor.dispatchCommand(
						RIGHT_CLICK_IMAGE_COMMAND,
						event as MouseEvent,
					);
				}
			});
		},
		[editor],
	);

	useEffect(() => {
		let isMounted = true;
		const rootElement = editor.getRootElement();
		const unregister = mergeRegister(
			editor.registerUpdateListener(({ editorState }) => {
				if (isMounted) {
					setSelection(editorState.read(() => $getSelection()));
				}
			}),
			editor.registerCommand(
				SELECTION_CHANGE_COMMAND,
				(_, activeEditor) => {
					activeEditorRef.current = activeEditor;
					return false;
				},
				COMMAND_PRIORITY_LOW,
			),
			editor.registerCommand<MouseEvent>(
				CLICK_COMMAND,
				onClick,
				COMMAND_PRIORITY_LOW,
			),
			editor.registerCommand<MouseEvent>(
				RIGHT_CLICK_IMAGE_COMMAND,
				onClick,
				COMMAND_PRIORITY_LOW,
			),
			editor.registerCommand(
				DRAGSTART_COMMAND,
				(event) => {
					if (event.target === imageRef.current) {
						// TODO This is just a temporary workaround for FF to behave like other browsers.
						// Ideally, this handles drag & drop too (and all browsers).
						event.preventDefault();
						return true;
					}
					return false;
				},
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
			editor.registerCommand(KEY_ENTER_COMMAND, onEnter, COMMAND_PRIORITY_LOW),
			editor.registerCommand(
				KEY_ESCAPE_COMMAND,
				onEscape,
				COMMAND_PRIORITY_LOW,
			),
		);

		rootElement?.addEventListener("contextmenu", onRightClick);

		return () => {
			isMounted = false;
			unregister();
			rootElement?.removeEventListener("contextmenu", onRightClick);
		};
	}, [
		clearSelection,
		editor,
		isResizing,
		isSelected,
		nodeKey,
		onDelete,
		onEnter,
		onEscape,
		onClick,
		onRightClick,
		setSelected,
	]);

	const setShowCaption = () => {
		editor.update(() => {
			const node = $getNodeByKey(nodeKey);
			if ($isImageNode(node)) {
				node.setShowCaption(true);
			}
		});
	};

	const onCaptionChange = () => {
		editor.update(() => {
			const node = $getNodeByKey(nodeKey);
			if ($isImageNode(node) && captionRef?.current?.value) {
				node.setCaption(captionRef?.current?.value);
			}
		});
	};

	const onResizeEnd = (
		nextWidth: "inherit" | number,
		nextHeight: "inherit" | number,
	) => {
		// Delay hiding the resize bars for click case
		setTimeout(() => {
			setIsResizing(false);
		}, 200);

		editor.update(() => {
			const node = $getNodeByKey(nodeKey);
			if ($isImageNode(node)) {
				node.setWidthAndHeight(nextWidth, nextHeight);
			}
		});
	};

	const onResizeStart = () => {
		setIsResizing(true);
	};

	const setAltTextOnNode = (nextAltText: string) => {
		editor.update(() => {
			const node = $getNodeByKey(nodeKey);
			if ($isImageNode(node)) {
				node.setAltText(nextAltText);
			}
		});
	};

	const openAltTextDialog = () => {
		showModal("Альтернативний текст", (onModalClose) => (
			<EditAltTextDialog
				initialAltText={altText}
				onSave={setAltTextOnNode}
				onClose={onModalClose}
			/>
		));
	};

	const draggable = isSelected && $isNodeSelection(selection) && !isResizing;
	const isFocused = isSelected || isResizing;
	return (
		<>
			<div className="relative inline-block" draggable={draggable}>
				<EditorImage
					className={clsx("h-auto w-auto", {
						"outline outline-2 outline-blue-700": isFocused,
						"cursor-grab": $isNodeSelection(selection),
					})}
					src={src}
					altText={altText}
					imageRef={imageRef}
					width={width}
					height={height}
					maxWidth={maxWidth}
				/>
				{isFocused && (
					<button
						type="button"
						// Інакше mousedown у редакторі знімає виділення з картинки
						// і кнопка зникає раніше, ніж настане click.
						onMouseDown={(event) => event.preventDefault()}
						onClick={openAltTextDialog}
						title={
							altText
								? `Alt-текст: ${altText}`
								: "Додати альтернативний текст"
						}
						className={clsx(
							"absolute top-2 left-2 z-10 inline-flex items-center gap-1.5 rounded-md px-2 py-1 text-xs font-semibold shadow-sm transition-colors",
							altText
								? "bg-background/90 text-foreground hover:bg-background"
								: // Порожній alt — проблема для SEO та доступності,
									// тож підсвічуємо як попередження.
									"bg-amber-500/95 text-white hover:bg-amber-500",
						)}
					>
						<PencilLine size={13} />
						{altText ? "Alt-текст" : "Додати alt-текст"}
					</button>
				)}
			</div>
			{modal}
				{showCaption && (
				<input
					className="bg-card absolute bottom-0 left-0 w-full text-center text-gray-800 opacity-70 placeholder:text-gray-700"
					ref={captionRef}
					type="text"
					placeholder="Введіть підпис"
					defaultValue={caption}
					onChange={onCaptionChange}
				/>
			)}
			{resizable && $isNodeSelection(selection) && isFocused && (
				<ImageResizer
					showCaption={showCaption}
					setShowCaption={setShowCaption}
					editor={editor}
					buttonRef={buttonRef}
					imageRef={imageRef}
					maxWidth={maxWidth}
					onResizeStart={onResizeStart}
					onResizeEnd={onResizeEnd}
					captionsEnabled={captionsEnabled}
				/>
			)}
		</>
	);
}

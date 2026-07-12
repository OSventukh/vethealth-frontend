import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { $wrapNodeInElement, mergeRegister } from "@lexical/utils";
import {
	$createParagraphNode,
	$createRangeSelection,
	$getSelection,
	$insertNodes,
	$isNodeSelection,
	$isRootOrShadowRoot,
	$setSelection,
	COMMAND_PRIORITY_EDITOR,
	COMMAND_PRIORITY_HIGH,
	COMMAND_PRIORITY_LOW,
	createCommand,
	DRAGOVER_COMMAND,
	DRAGSTART_COMMAND,
	DROP_COMMAND,
	type LexicalCommand,
	type LexicalEditor,
} from "lexical";
import type * as React from "react";
import { useEffect, useRef, useState, useTransition } from "react";
import { imageUploadAction } from "@/actions/image-upload.action";
import { Button } from "@/components/ui/button";
import { DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/components/ui/use-toast";
import {
	$createImageNode,
	$isImageNode,
	ImageNode,
	type ImagePayload,
} from "../../nodes/ImageNode";
import { CAN_USE_DOM } from "../../utils/canUseDOM";

export type InsertImagePayload = Readonly<ImagePayload>;

const getDOMSelection = (targetWindow: Window | null): Selection | null =>
	CAN_USE_DOM ? (targetWindow || window).getSelection() : null;

export const INSERT_IMAGE_COMMAND: LexicalCommand<InsertImagePayload> =
	createCommand("INSERT_IMAGE_COMMAND");

export function InsertImageUriDialogBody({
	onClick,
}: {
	onClick: (payload: InsertImagePayload) => void;
}) {
	const [src, setSrc] = useState("");
	const [altText, setAltText] = useState("");

	const isDisabled = src === "";

	return (
		<>
			<div className="grid gap-4 py-2">
				<div className="grid gap-2">
					<Label htmlFor="image-url">URL картинки</Label>
					<Input
						id="image-url"
						autoFocus
						placeholder="https://…"
						value={src}
						onChange={(e) => setSrc(e.target.value)}
						data-test-id="image-modal-url-input"
					/>
				</div>
				<div className="grid gap-2">
					<Label htmlFor="image-alt">Альтернативний текст</Label>
					<Input
						id="image-alt"
						placeholder="Опис зображення"
						value={altText}
						onChange={(e) => setAltText(e.target.value)}
						data-test-id="image-modal-alt-text-input"
					/>
				</div>
			</div>
			<DialogFooter>
				<Button
					data-test-id="image-modal-confirm-btn"
					disabled={isDisabled}
					onClick={() => onClick({ altText, src })}
				>
					Підтвердити
				</Button>
			</DialogFooter>
		</>
	);
}

export function InsertImageUploadedDialogBody({
	onClick,
}: {
	onClick: (payload: InsertImagePayload) => void;
}) {
	const [src, setSrc] = useState("");
	const [altText, setAltText] = useState("");
	const [isPending, startTransition] = useTransition();
	const isDisabled = src === "";

	const loadImage = (files: FileList | null) => {
		startTransition(async () => {
			if (!files || files.length === 0) {
				return;
			}
			const formData = new FormData();
			formData.append("post", files[0]);
			try {
				const result = await imageUploadAction(formData, "post");
				if (result.error || !result.image) {
					toast({
						variant: "destructive",
						description:
							result.message || "Не вдалося завантажити картинку",
					});
					return;
				}
				// path — завжди публічний URL (local → backendDomain/…,
				// R2 → CDN). relativePath у R2-режимі — голий ключ бакета
				// ("uploads/…"), який браузер резолвить відносно сторінки
				// адмінки → 404, картинка «невидима».
				setSrc(result.image.path);
			} catch {
				// Server action міг упасти ще до виконання (наприклад,
				// перевищено bodySizeLimit) — тоді проміс реджектиться.
				toast({
					variant: "destructive",
					description:
						"Не вдалося завантажити картинку (можливо, файл завеликий)",
				});
			}
		});
	};
	return (
		<>
			<div className="grid gap-4 py-2">
				<div className="grid gap-2">
					<Label htmlFor="image-file">Картинка</Label>
					<Input
						id="image-file"
						type="file"
						accept="image/*"
						onChange={(e) => loadImage(e.target.files)}
						data-test-id="image-modal-file-upload"
					/>
				</div>
				<div className="grid gap-2">
					<Label htmlFor="image-file-alt">Альтернативний текст</Label>
					<Input
						id="image-file-alt"
						placeholder="Опис зображення"
						value={altText}
						onChange={(e) => setAltText(e.target.value)}
						data-test-id="image-modal-alt-text-input"
					/>
				</div>
			</div>
			<DialogFooter>
				<Button
					data-test-id="image-modal-file-upload-btn"
					disabled={isDisabled}
					onClick={() => onClick({ altText, src })}
				>
					{isPending ? "Завантаження…" : "Підтвердити"}
				</Button>
			</DialogFooter>
		</>
	);
}

export function InsertImageDialog({
	activeEditor,
	onClose,
}: {
	activeEditor: LexicalEditor;
	onClose: () => void;
}): React.ReactElement {
	const [mode, setMode] = useState<null | "url" | "file">(null);
	const hasModifier = useRef(false);

	useEffect(() => {
		hasModifier.current = false;
		const handler = (e: KeyboardEvent) => {
			hasModifier.current = e.altKey;
		};
		document.addEventListener("keydown", handler);
		return () => {
			document.removeEventListener("keydown", handler);
		};
	}, [activeEditor]);

	const onClick = (payload: InsertImagePayload) => {
		activeEditor.dispatchCommand(INSERT_IMAGE_COMMAND, payload);
		onClose();
	};

	return (
		<>
			{!mode && (
				<div className="grid grid-cols-2 gap-2 py-2">
					<Button
						variant="outline"
						data-test-id="image-modal-option-url"
						onClick={() => setMode("url")}
					>
						URL-адреса
					</Button>
					<Button
						variant="outline"
						data-test-id="image-modal-option-file"
						onClick={() => setMode("file")}
					>
						Завантажити файл
					</Button>
				</div>
			)}
			{mode === "url" && <InsertImageUriDialogBody onClick={onClick} />}
			{mode === "file" && <InsertImageUploadedDialogBody onClick={onClick} />}
		</>
	);
}

export default function ImagesPlugin({
	captionsEnabled,
}: {
	captionsEnabled?: boolean;
}): React.ReactElement | null {
	const [editor] = useLexicalComposerContext();

	useEffect(() => {
		if (!editor.hasNodes([ImageNode])) {
			throw new Error("ImagesPlugin: ImageNode not registered on editor");
		}

		return mergeRegister(
			editor.registerCommand<InsertImagePayload>(
				INSERT_IMAGE_COMMAND,
				(payload) => {
					const imageNode = $createImageNode(payload);
					$insertNodes([imageNode]);
					if ($isRootOrShadowRoot(imageNode.getParentOrThrow())) {
						$wrapNodeInElement(imageNode, $createParagraphNode).selectEnd();
					}

					return true;
				},
				COMMAND_PRIORITY_EDITOR,
			),
			editor.registerCommand<DragEvent>(
				DRAGSTART_COMMAND,
				(event) => {
					return onDragStart(event);
				},
				COMMAND_PRIORITY_HIGH,
			),
			editor.registerCommand<DragEvent>(
				DRAGOVER_COMMAND,
				(event) => {
					return onDragover(event);
				},
				COMMAND_PRIORITY_LOW,
			),
			editor.registerCommand<DragEvent>(
				DROP_COMMAND,
				(event) => {
					return onDrop(event, editor);
				},
				COMMAND_PRIORITY_HIGH,
			),
		);
	}, [captionsEnabled, editor]);

	return null;
}

const TRANSPARENT_IMAGE =
	"data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7";
const img = document.createElement("img");
img.src = TRANSPARENT_IMAGE;

function onDragStart(event: DragEvent): boolean {
	const node = getImageNodeInSelection();

	if (!node) {
		return false;
	}
	const dataTransfer = event.dataTransfer;
	if (!dataTransfer) {
		return false;
	}
	dataTransfer.setData("text/plain", "_");
	dataTransfer.setDragImage(img, 0, 0);
	dataTransfer.setData(
		"application/x-lexical-drag",
		JSON.stringify({
			data: {
				altText: node.__altText,
				caption: node.__caption,
				height: node.__height,
				key: node.getKey(),
				maxWidth: node.__maxWidth,
				showCaption: node.__showCaption,
				src: node.__src,
				width: node.__width,
			},
			type: "image",
		}),
	);

	return true;
}

function onDragover(event: DragEvent): boolean {
	const node = getImageNodeInSelection();
	if (!node) {
		return false;
	}
	if (!canDropImage(event)) {
		event.preventDefault();
	}
	return true;
}

function onDrop(event: DragEvent, editor: LexicalEditor): boolean {
	const node = getImageNodeInSelection();
	if (!node) {
		return false;
	}
	const data = getDragImageData(event);
	if (!data) {
		return false;
	}
	event.preventDefault();
	if (canDropImage(event)) {
		const range = getDragSelection(event);
		node.remove();
		const rangeSelection = $createRangeSelection();
		if (range !== null && range !== undefined) {
			rangeSelection.applyDOMRange(range);
		}
		$setSelection(rangeSelection);
		editor.dispatchCommand(INSERT_IMAGE_COMMAND, data);
	}
	return true;
}

function getImageNodeInSelection(): ImageNode | null {
	const selection = $getSelection();
	if (!$isNodeSelection(selection)) {
		return null;
	}
	const nodes = selection.getNodes();
	const node = nodes[0];
	return $isImageNode(node) ? node : null;
}

function getDragImageData(event: DragEvent): null | InsertImagePayload {
	const dragData = event.dataTransfer?.getData("application/x-lexical-drag");
	if (!dragData) {
		return null;
	}
	const { type, data } = JSON.parse(dragData);
	if (type !== "image") {
		return null;
	}

	return data;
}

declare global {
	interface DragEvent {
		rangeOffset?: number;
		rangeParent?: Node;
	}
}

function canDropImage(event: DragEvent): boolean {
	const target = event.target;
	return !!(
		target &&
		target instanceof HTMLElement &&
		!target.closest("code, span.editor-image") &&
		target.parentElement &&
		// The playground matches its own `div.ContentEditable__root` class here;
		// our editor root doesn't have it, so match Lexical's own root attribute.
		target.parentElement.closest('[data-lexical-editor="true"]')
	);
}

function getDragSelection(event: DragEvent): Range | null | undefined {
	let range;
	const target = event.target as null | Element | Document;
	const targetWindow =
		target == null
			? null
			: target.nodeType === 9
				? (target as Document).defaultView
				: (target as Element).ownerDocument.defaultView;
	const domSelection = getDOMSelection(targetWindow);
	if (document.caretRangeFromPoint) {
		range = document.caretRangeFromPoint(event.clientX, event.clientY);
	} else if (event.rangeParent && domSelection !== null) {
		domSelection.collapse(event.rangeParent, event.rangeOffset || 0);
		range = domSelection.getRangeAt(0);
	} else {
		throw Error(`Cannot get the selection when dragging`);
	}

	return range;
}

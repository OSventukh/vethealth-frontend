/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import {
	$isAutoLinkNode,
	$isLinkNode,
	TOGGLE_LINK_COMMAND,
} from "@lexical/link";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { $findMatchingParent, mergeRegister } from "@lexical/utils";
import {
	$getSelection,
	$isRangeSelection,
	type BaseSelection,
	CLICK_COMMAND,
	COMMAND_PRIORITY_CRITICAL,
	COMMAND_PRIORITY_HIGH,
	COMMAND_PRIORITY_LOW,
	KEY_ESCAPE_COMMAND,
	type LexicalEditor,
	type NodeSelection,
	type RangeSelection,
	SELECTION_CHANGE_COMMAND,
} from "lexical";
import { Check, SquarePen, Trash, X } from "lucide-react";
import type * as React from "react";
import { type Dispatch, useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { getSelectedNode } from "../../utils/getSelectedNode";
import { setFloatingElemPositionForLinkEditor } from "../../utils/setFloatingElemPositionForLinkEditor";
import { sanitizeUrl } from "../../utils/url";

// `not-prose` — панель портується всередину контейнера з класом `prose`, інакше
// типографіка Tailwind перебиває стилі посилання й кнопок.
const panelClassName =
	"not-prose bg-popover text-popover-foreground flex w-full items-center gap-1 rounded-md border p-1 shadow-md";

function FloatingLinkEditor({
	editor,
	isLink,
	setIsLink,
	anchorElem,
	isLinkEditMode,
	setIsLinkEditMode,
}: {
	editor: LexicalEditor;
	isLink: boolean;
	setIsLink: Dispatch<boolean>;
	anchorElem: HTMLElement;
	isLinkEditMode: boolean;
	setIsLinkEditMode: Dispatch<boolean>;
}): React.ReactElement {
	const editorRef = useRef<HTMLDivElement | null>(null);
	const inputRef = useRef<HTMLInputElement>(null);
	const [linkUrl, setLinkUrl] = useState("");
	const [editedLinkUrl, setEditedLinkUrl] = useState("https://");
	const [lastSelection, setLastSelection] = useState<
		RangeSelection | BaseSelection | NodeSelection | null
	>(null);

	const updateLinkEditor = useCallback(() => {
		const selection = $getSelection();
		if ($isRangeSelection(selection)) {
			const node = getSelectedNode(selection);
			const linkParent = $findMatchingParent(node, $isLinkNode);

			if (linkParent) {
				setLinkUrl(linkParent.getURL());
			} else if ($isLinkNode(node)) {
				setLinkUrl(node.getURL());
			} else {
				setLinkUrl("");
			}
		}
		const editorElem = editorRef.current;
		const nativeSelection = window.getSelection();
		const activeElement = document.activeElement as HTMLElement;

		if (editorElem === null) {
			return;
		}

		const rootElement = editor.getRootElement();

		if (
			selection !== null &&
			nativeSelection !== null &&
			rootElement !== null &&
			rootElement.contains(nativeSelection.anchorNode) &&
			editor.isEditable()
		) {
			const domRect: DOMRect | undefined =
				nativeSelection.focusNode?.parentElement?.getBoundingClientRect();
			if (domRect) {
				domRect.y += 40;
				setFloatingElemPositionForLinkEditor(domRect, editorElem, anchorElem);
			}
			setLastSelection(selection);
		} else if (!activeElement || !activeElement.dataset.linkView) {
			if (rootElement !== null) {
				setFloatingElemPositionForLinkEditor(null, editorElem, anchorElem);
			}
			setLastSelection(null);
			setIsLinkEditMode(false);
			setLinkUrl("");
		}

		return true;
	}, [anchorElem, editor, setIsLinkEditMode]);

	useEffect(() => {
		const scrollerElem = anchorElem.parentElement;

		const update = () => {
			editor.getEditorState().read(() => {
				updateLinkEditor();
			});
		};

		window.addEventListener("resize", update);

		if (scrollerElem) {
			scrollerElem.addEventListener("scroll", update);
		}

		return () => {
			window.removeEventListener("resize", update);

			if (scrollerElem) {
				scrollerElem.removeEventListener("scroll", update);
			}
		};
	}, [anchorElem.parentElement, editor, updateLinkEditor]);

	useEffect(() => {
		return mergeRegister(
			editor.registerUpdateListener(({ editorState }) => {
				editorState.read(() => {
					updateLinkEditor();
				});
			}),

			editor.registerCommand(
				SELECTION_CHANGE_COMMAND,
				() => {
					updateLinkEditor();
					return true;
				},
				COMMAND_PRIORITY_LOW,
			),
			editor.registerCommand(
				KEY_ESCAPE_COMMAND,
				() => {
					if (isLink) {
						setIsLink(false);
						return true;
					}
					return false;
				},
				COMMAND_PRIORITY_HIGH,
			),
		);
	}, [editor, updateLinkEditor, setIsLink, isLink]);

	useEffect(() => {
		editor.getEditorState().read(() => {
			updateLinkEditor();
		});
	}, [editor, updateLinkEditor]);

	useEffect(() => {
		if (isLinkEditMode && inputRef.current) {
			inputRef.current.focus();
		}
	}, [isLinkEditMode, isLink]);

	const monitorInputInteraction = (
		event: React.KeyboardEvent<HTMLInputElement>,
	) => {
		if (event.key === "Enter") {
			event.preventDefault();
			handleLinkSubmission();
		} else if (event.key === "Escape") {
			event.preventDefault();
			setIsLinkEditMode(false);
		}
	};

	const handleLinkSubmission = () => {
		if (lastSelection !== null) {
			if (linkUrl !== "") {
				editor.dispatchCommand(TOGGLE_LINK_COMMAND, sanitizeUrl(editedLinkUrl));
			}
			setEditedLinkUrl("https://");
			setIsLinkEditMode(false);
		}
	};

	return (
		<div
			ref={editorRef}
			// top/left мають лишатись нульові: позицію задає лише transform із
			// setFloatingElemPositionForLinkEditor (він рахує зсув відносно
			// посилання), а будь-який top-* додається до неї зверху.
			className="absolute top-0 left-0 z-10 flex w-full max-w-[400px] opacity-0 transition-opacity duration-500 will-change-transform"
		>
			{!isLink ? null : isLinkEditMode ? (
				<div className={panelClassName}>
					<Input
						ref={inputRef}
						className="h-8 flex-1 border-0 px-2 shadow-none focus-visible:ring-0 focus-visible:ring-offset-0"
						data-view="linkView"
						value={editedLinkUrl}
						onChange={(event) => {
							setEditedLinkUrl(event.target.value);
						}}
						onKeyDown={(event) => {
							monitorInputInteraction(event);
						}}
					/>
					<Button
						type="button"
						variant="ghost"
						size="icon"
						className="size-8 shrink-0"
						aria-label="Скасувати"
						onClick={() => {
							setIsLinkEditMode(false);
						}}
					>
						<X className="size-4" />
					</Button>
					<Button
						type="button"
						variant="ghost"
						size="icon"
						className="size-8 shrink-0"
						aria-label="Зберегти посилання"
						onClick={handleLinkSubmission}
					>
						<Check className="size-4" />
					</Button>
				</div>
			) : (
				<div className={panelClassName}>
					{/* Довгі URL (напр. посилання на PDF у джерелах) інакше
					    переносяться на кілька рядків і роздувають панель. */}
					<a
						className="text-primary min-w-0 flex-1 truncate px-2 text-sm underline-offset-4 hover:underline"
						href={sanitizeUrl(linkUrl)}
						target="_blank"
						title={linkUrl}
						data-view="linkView"
						rel="noopener noreferrer"
					>
						{linkUrl}
					</a>
					<Button
						type="button"
						variant="ghost"
						size="icon"
						className="size-8 shrink-0"
						aria-label="Редагувати посилання"
						onClick={() => {
							setEditedLinkUrl(linkUrl);
							setIsLinkEditMode(true);
						}}
					>
						<SquarePen className="size-4" />
					</Button>
					<Button
						type="button"
						variant="ghost"
						size="icon"
						className="size-8 shrink-0"
						aria-label="Видалити посилання"
						onClick={() => {
							editor.dispatchCommand(TOGGLE_LINK_COMMAND, null);
						}}
					>
						<Trash className="size-4" />
					</Button>
				</div>
			)}
		</div>
	);
}

function useFloatingLinkEditorToolbar(
	editor: LexicalEditor,
	anchorElem: HTMLElement,
	isLinkEditMode: boolean,
	setIsLinkEditMode: Dispatch<boolean>,
): React.ReactElement | null {
	const [activeEditor, setActiveEditor] = useState(editor);
	const [isLink, setIsLink] = useState(false);
	// AutoFocusExtension при монтуванні ставить курсор у кінець документа. Якщо
	// пост закінчується посиланням (список джерел), селекція одразу опиняється
	// всередині LinkNode і панель відкривається сама собою. Тому селекцію
	// враховуємо лише після першої дії користувача в області редагування.
	const hasUserInteracted = useRef(false);

	useEffect(() => {
		const markInteracted = () => {
			hasUserInteracted.current = true;
		};

		function updateToolbar() {
			if (!hasUserInteracted.current) {
				return;
			}
			const selection = $getSelection();
			if ($isRangeSelection(selection)) {
				const node = getSelectedNode(selection);
				const linkParent = $findMatchingParent(node, $isLinkNode);
				const autoLinkParent = $findMatchingParent(node, $isAutoLinkNode);
				// We don't want this menu to open for auto links.
				if (linkParent !== null && autoLinkParent === null) {
					setIsLink(true);
				} else {
					setIsLink(false);
				}
			}
		}
		return mergeRegister(
			editor.registerRootListener((rootElement, prevRootElement) => {
				prevRootElement?.removeEventListener("pointerdown", markInteracted);
				prevRootElement?.removeEventListener("keydown", markInteracted);
				rootElement?.addEventListener("pointerdown", markInteracted);
				rootElement?.addEventListener("keydown", markInteracted);
			}),
			editor.registerUpdateListener(({ editorState }) => {
				editorState.read(() => {
					updateToolbar();
				});
			}),
			editor.registerCommand(
				SELECTION_CHANGE_COMMAND,
				(_payload, newEditor) => {
					updateToolbar();
					setActiveEditor(newEditor);
					return false;
				},
				COMMAND_PRIORITY_CRITICAL,
			),
			editor.registerCommand(
				CLICK_COMMAND,
				(payload) => {
					const selection = $getSelection();
					if ($isRangeSelection(selection)) {
						const node = getSelectedNode(selection);
						const linkNode = $findMatchingParent(node, $isLinkNode);
						if ($isLinkNode(linkNode) && (payload.metaKey || payload.ctrlKey)) {
							window.open(linkNode.getURL(), "_blank");
							return true;
						}
					}
					return false;
				},
				COMMAND_PRIORITY_LOW,
			),
		);
	}, [editor]);

	return createPortal(
		<FloatingLinkEditor
			editor={activeEditor}
			isLink={isLink}
			anchorElem={anchorElem}
			setIsLink={setIsLink}
			isLinkEditMode={isLinkEditMode}
			setIsLinkEditMode={setIsLinkEditMode}
		/>,
		anchorElem,
	);
}

export default function FloatingLinkEditorPlugin({
	anchorElem = document.body,
	isLinkEditMode,
	setIsLinkEditMode,
}: {
	anchorElem?: HTMLElement;
	isLinkEditMode: boolean;
	setIsLinkEditMode: Dispatch<boolean>;
}): React.ReactElement | null {
	const [editor] = useLexicalComposerContext();
	return useFloatingLinkEditorToolbar(
		editor,
		anchorElem,
		isLinkEditMode,
		setIsLinkEditMode,
	);
}

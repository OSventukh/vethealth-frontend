/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { DraggableBlockPlugin_EXPERIMENTAL } from "@lexical/react/LexicalDraggableBlockPlugin";
import type { JSX } from "react";
import { useRef } from "react";
import styles from "./index.module.css";

const DRAGGABLE_BLOCK_MENU_CLASSNAME = styles["draggable-block-menu"];

function isOnMenu(element: HTMLElement): boolean {
	return !!element.closest(`.${DRAGGABLE_BLOCK_MENU_CLASSNAME}`);
}

export default function DraggableBlockPlugin({
	anchorElem = document.body,
}: {
	anchorElem?: HTMLElement;
}): JSX.Element {
	const menuRef = useRef<HTMLDivElement>(null);
	const targetLineRef = useRef<HTMLDivElement>(null);

	return (
		<DraggableBlockPlugin_EXPERIMENTAL
			anchorElem={anchorElem}
			menuRef={menuRef}
			targetLineRef={targetLineRef}
			menuComponent={
				<div
					ref={menuRef}
					className={`${styles["icon"]} ${DRAGGABLE_BLOCK_MENU_CLASSNAME}`}
				/>
			}
			targetLineComponent={
				<div
					ref={targetLineRef}
					className={styles["draggable-block-target-line"]}
				/>
			}
			isOnMenu={isOnMenu}
		/>
	);
}

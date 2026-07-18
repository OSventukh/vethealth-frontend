/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import type React from "react";
import { useCallback, useMemo, useState } from "react";

import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";

export default function useModal(): [
	React.ReactElement | null,
	(
		title: string,
		showModal: (onClose: () => void) => React.ReactElement,
		contentClassName?: string,
	) => void,
] {
	const [modalContent, setModalContent] = useState<null | {
		content: React.ReactElement;
		title: string;
		contentClassName?: string;
	}>(null);

	const onClose = useCallback(() => {
		setModalContent(null);
	}, []);

	const modal = useMemo(() => {
		if (modalContent === null) {
			return null;
		}
		const { title, content, contentClassName } = modalContent;
		return (
			<Dialog
				open
				onOpenChange={(open) => {
					if (!open) {
						onClose();
					}
				}}
			>
				<DialogContent className={contentClassName}>
					<DialogHeader>
						<DialogTitle>{title}</DialogTitle>
					</DialogHeader>
					{content}
				</DialogContent>
			</Dialog>
		);
	}, [modalContent, onClose]);

	const showModal = useCallback(
		(
			title: string,
			// eslint-disable-next-line no-shadow
			getContent: (onClose: () => void) => React.ReactElement,
			contentClassName?: string,
		) => {
			setModalContent({
				content: getContent(onClose),
				title,
				contentClassName,
			});
		},
		[onClose],
	);

	return [modal, showModal];
}

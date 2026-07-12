/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import type { LexicalEditor } from "lexical";
import type React from "react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
	Select,
	SelectContent,
	SelectGroup,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { INSERT_LAYOUT_COMMAND } from "./LayoutPlugin";

const LAYOUTS = [
	{ label: "2 колонки (однакова ширина)", value: "1fr 1fr" },
	{ label: "2 колонки (25% — 75%)", value: "1fr 3fr" },
	{ label: "3 колонки (однакова ширина)", value: "1fr 1fr 1fr" },
	{ label: "3 колонки (25% — 50% — 25%)", value: "1fr 2fr 1fr" },
	{ label: "4 колонки (однакова ширина)", value: "1fr 1fr 1fr 1fr" },
];

export default function InsertLayoutDialog({
	activeEditor,
	onClose,
}: {
	activeEditor: LexicalEditor;
	onClose: () => void;
}): React.ReactElement {
	const [layout, setLayout] = useState(LAYOUTS[0].value);

	const onClick = () => {
		activeEditor.dispatchCommand(INSERT_LAYOUT_COMMAND, layout);
		onClose();
	};

	return (
		<>
			<div className="grid gap-2 py-2">
				<Label htmlFor="layout-select">Розкладка</Label>
				<Select
					value={layout}
					onValueChange={(value) => setLayout(value ?? LAYOUTS[0].value)}
				>
					<SelectTrigger id="layout-select">
						<SelectValue placeholder="Виберіть розкладку" />
					</SelectTrigger>
					<SelectContent>
						<SelectGroup>
							{LAYOUTS.map(({ label, value }) => (
								<SelectItem key={value} value={value}>
									{label}
								</SelectItem>
							))}
						</SelectGroup>
					</SelectContent>
				</Select>
			</div>
			<DialogFooter>
				<Button type="button" onClick={onClick}>
					Вставити
				</Button>
			</DialogFooter>
		</>
	);
}

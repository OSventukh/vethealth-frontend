"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type Props = {
	initialAltText: string;
	onSave: (altText: string) => void;
	onClose: () => void;
};

export default function EditAltTextDialog({
	initialAltText,
	onSave,
	onClose,
}: Props) {
	const [altText, setAltText] = useState(initialAltText);

	const submit = () => {
		onSave(altText.trim());
		onClose();
	};

	return (
		<>
			<div className="grid gap-2 py-2">
				<Label htmlFor="edit-alt-text">Альтернативний текст</Label>
				<Input
					id="edit-alt-text"
					autoFocus
					value={altText}
					placeholder="Опишіть, що зображено на картинці"
					onChange={(event) => setAltText(event.target.value)}
					onKeyDown={(event) => {
						if (event.key === "Enter") {
							event.preventDefault();
							submit();
						}
					}}
				/>
				<p className="text-muted-foreground text-xs">
					Показується, якщо картинка не завантажилась, і читається
					скрінрідерами — важливо для SEO та доступності.
				</p>
			</div>
			<DialogFooter>
				<Button type="button" variant="outline" onClick={onClose}>
					Скасувати
				</Button>
				<Button type="button" onClick={submit}>
					Зберегти
				</Button>
			</DialogFooter>
		</>
	);
}

"use client";
import { Loader2, Upload } from "lucide-react";
import { useRef, useState } from "react";
import { imageUploadAction } from "@/actions/image-upload.action";
import type { MediaItem } from "@/api/types/media.type";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";

/** Поле multipart-завантаження — визначає теку у сховищі (див. backend `Fields`). */
export type UploadField = "media" | "post" | "post-featured" | "topic";

interface MediaUploadButtonProps {
	onUploaded: (item: MediaItem) => void;
	field?: UploadField;
	multiple?: boolean;
	label?: string;
	size?: "default" | "sm";
}

export function MediaUploadButton({
	onUploaded,
	field = "media",
	multiple = false,
	label = "Завантажити",
	size = "default",
}: MediaUploadButtonProps) {
	const inputRef = useRef<HTMLInputElement>(null);
	const [progress, setProgress] = useState<{ done: number; total: number }>();

	const upload = async (files: File[]) => {
		let failed = 0;
		// По одному: бекенд приймає один файл на поле, а server action має
		// ліміт розміру тіла (bodySizeLimit) на кожен виклик.
		for (const [index, file] of files.entries()) {
			setProgress({ done: index, total: files.length });
			const formData = new FormData();
			formData.append(field, file);
			try {
				// oxlint-disable-next-line no-await-in-loop -- навмисно послідовно (див. вище)
				const result = await imageUploadAction(formData, field);
				if (result.error || !result.image) {
					failed++;
					toast({
						variant: "destructive",
						description: `${file.name}: ${result.message || "не вдалося завантажити"}`,
					});
					continue;
				}
				onUploaded(result.image as unknown as MediaItem);
			} catch {
				// Server action міг упасти ще до виконання (перевищено bodySizeLimit).
				failed++;
				toast({
					variant: "destructive",
					description: `${file.name}: не вдалося завантажити (можливо, файл завеликий)`,
				});
			}
		}
		setProgress(undefined);
		if (files.length > 1 && failed < files.length) {
			toast({
				variant: "success",
				description: `Завантажено ${files.length - failed} з ${files.length}`,
			});
		}
	};

	return (
		<>
			<Button
				type="button"
				size={size}
				className="gap-2"
				disabled={Boolean(progress)}
				onClick={() => inputRef.current?.click()}
			>
				{progress ? (
					<Loader2 size={16} className="animate-spin" />
				) : (
					<Upload size={16} />
				)}
				{progress && progress.total > 1
					? `${progress.done + 1} / ${progress.total}`
					: label}
			</Button>
			<input
				ref={inputRef}
				type="file"
				accept="image/*"
				multiple={multiple}
				className="hidden"
				onChange={(event) => {
					const files = Array.from(event.target.files ?? []);
					event.target.value = "";
					if (files.length) upload(files);
				}}
			/>
		</>
	);
}

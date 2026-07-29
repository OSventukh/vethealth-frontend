"use client";
import { Trash2, Upload } from "lucide-react";
import { useRef, useState } from "react";
import { imageUploadAction } from "@/actions/image-upload.action";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { useToast } from "@/components/ui/use-toast";

interface Props {
	value: string;
	onChange: (url: string) => void;
	label?: string;
}

export function ImageField({ value, onChange, label }: Props) {
	const inputRef = useRef<HTMLInputElement>(null);
	const [uploading, setUploading] = useState(false);
	const { toast } = useToast();

	const uploadHandler = async (file: File) => {
		setUploading(true);
		const formData = new FormData();
		formData.append("post", file);
		const result = await imageUploadAction(formData);
		setUploading(false);
		if (result.error || !result.image?.path) {
			toast({
				variant: "destructive",
				description: result.message || "Не вдалося завантажити зображення",
			});
			return;
		}
		onChange(result.image.path);
	};

	return (
		<div className="flex flex-col gap-2">
			{value ? (
				// eslint-disable-next-line @next/next/no-img-element
				<img
					src={value}
					alt={label || ""}
					className="border-border h-28 w-full rounded-lg border object-cover"
				/>
			) : (
				<div className="border-border text-muted-foreground flex h-20 w-full items-center justify-center rounded-lg border border-dashed text-xs">
					Немає зображення
				</div>
			)}
			<div className="flex gap-2">
				<Button
					type="button"
					variant="outline"
					size="sm"
					className="flex-1 gap-2"
					disabled={uploading}
					onClick={() => inputRef.current?.click()}
				>
					{uploading ? <Spinner /> : <Upload className="h-4 w-4" />}
					{value ? "Замінити" : "Завантажити"}
				</Button>
				{value && (
					<Button
						type="button"
						variant="outline"
						size="sm"
						onClick={() => onChange("")}
					>
						<Trash2 className="text-destructive h-4 w-4" />
					</Button>
				)}
			</div>
			<input
				ref={inputRef}
				type="file"
				accept="image/*"
				className="hidden"
				onChange={(event) => {
					const file = event.target.files?.[0];
					if (file) uploadHandler(file);
					event.target.value = "";
				}}
			/>
		</div>
	);
}

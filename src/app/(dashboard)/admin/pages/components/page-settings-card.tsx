"use client";
import { Input } from "@/components/ui/input";
import { Field } from "./fields";

interface Props {
	title: string;
	slug: string;
	onTitleChange: (title: string) => void;
	onSlugChange: (slug: string) => void;
}

export function PageSettingsCard({
	title,
	slug,
	onTitleChange,
	onSlugChange,
}: Props) {
	return (
		<div className="border-border flex flex-col gap-3.5 rounded-xl border bg-white p-4 shadow-sm">
			<div className="text-sm font-bold">Сторінка</div>
			<Field label="Назва сторінки">
				<Input
					value={title}
					onChange={(event) => onTitleChange(event.target.value)}
				/>
			</Field>
			<Field label="URL-адреса">
				<div className="border-input flex items-stretch overflow-hidden rounded-md border">
					<span className="bg-muted text-muted-foreground flex items-center px-3 font-mono text-xs">
						/
					</span>
					<Input
						value={slug}
						onChange={(event) => onSlugChange(event.target.value)}
						className="rounded-none border-0 font-mono text-sm focus-visible:ring-0"
					/>
				</div>
			</Field>
		</div>
	);
}

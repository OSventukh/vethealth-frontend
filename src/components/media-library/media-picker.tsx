"use client";
import { ImagePlus, Library, Loader2, Search } from "lucide-react";
import { useState } from "react";
import { updateMediaAltAction } from "@/actions/media.action";
import type { MediaItem, PickedMedia } from "@/api/types/media.type";
import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { toast } from "@/components/ui/use-toast";
import { AltTextEditor } from "./alt-text-editor";
import { formatDimensions, MediaGrid, MediaThumb } from "./media-grid";
import { MediaUploadButton, type UploadField } from "./media-upload-button";
import { useCanManageMedia } from "./media-permissions";
import { useMediaList } from "./use-media-list";

interface MediaPickerPanelProps {
	onPick: (media: PickedMedia) => void;
	/** Куди класти нові файли, завантажені з пікера (як у звичайного поля форми). */
	uploadField?: UploadField;
	confirmLabel?: string;
	/** Перевірка перед вставкою: повертає причину відмови або null. */
	validatePick?: (media: MediaItem) => Promise<string | null>;
}

/**
 * Вибір зображення з медіатеки (+ завантаження нового). Alt, змінений тут,
 * зберігається і в медіатеці — щоб наступного разу підставився сам.
 */
export function MediaPickerPanel({
	onPick,
	uploadField = "media",
	confirmLabel = "Обрати",
	validatePick,
}: MediaPickerPanelProps) {
	const list = useMediaList();
	const canManage = useCanManageMedia();
	const [selected, setSelected] = useState<MediaItem | null>(null);
	const [alt, setAlt] = useState("");
	const [saving, setSaving] = useState(false);

	const select = (item: MediaItem) => {
		setSelected(item);
		setAlt(item.alt ?? "");
	};

	const confirm = async () => {
		if (!selected) return;
		if (validatePick) {
			setSaving(true);
			const problem = await validatePick(selected);
			setSaving(false);
			if (problem) {
				toast({ variant: "destructive", description: problem });
				return;
			}
		}
		const trimmed = alt.trim();
		// Не-адмін міняє alt лише для цього матеріалу — медіатеку правлять Admin+.
		if (canManage && trimmed !== (selected.alt ?? "")) {
			setSaving(true);
			const result = await updateMediaAltAction(selected.id, trimmed);
			setSaving(false);
			if (result.success) {
				list.replace(result.data);
			} else {
				// Вставку не блокуємо — alt піде у форму, лише не в медіатеку.
				toast({
					variant: "destructive",
					description: `${result.message} у медіатеці`,
				});
			}
		}
		onPick({ id: selected.id, path: selected.path, alt: trimmed });
	};

	return (
		<div className="flex min-h-0 flex-col gap-3">
			<div className="flex flex-wrap items-center gap-2">
				<div className="relative min-w-48 flex-1">
					<Search
						size={15}
						className="text-muted-foreground absolute top-1/2 left-3 -translate-y-1/2"
					/>
					<Input
						value={list.filters.search}
						placeholder="Пошук за назвою або alt"
						className="pl-9"
						onChange={(event) => list.setSearch(event.target.value)}
					/>
				</div>
				<MediaUploadButton
					field={uploadField}
					label="Завантажити нове"
					onUploaded={(item) => {
						list.prepend(item);
						select(item);
					}}
				/>
			</div>

			<div className="max-h-[45vh] min-h-40 overflow-y-auto pr-1">
				{list.error && (
					<p className="text-destructive py-6 text-center text-sm">
						{list.error}
					</p>
				)}
				{!list.error && !list.loading && list.items.length === 0 && (
					<p className="text-muted-foreground py-10 text-center text-sm">
						{list.filters.search
							? "Нічого не знайдено"
							: "Медіатека порожня — завантажте перше зображення"}
					</p>
				)}
				<MediaGrid
					items={list.items}
					selectedId={selected?.id}
					onSelect={select}
				/>
				{(list.hasMore || list.loading) && (
					<div className="flex justify-center py-3">
						<Button
							type="button"
							variant="outline"
							size="sm"
							disabled={list.loading}
							onClick={list.loadMore}
						>
							{list.loading ? (
								<Loader2 size={14} className="animate-spin" />
							) : (
								"Показати ще"
							)}
						</Button>
					</div>
				)}
			</div>

			{selected && (
				<div className="grid gap-3 border-t pt-3 sm:grid-cols-[7rem_1fr]">
					<div className="hidden flex-col gap-1 sm:flex">
						<div className="bg-muted/40 aspect-square overflow-hidden rounded-lg border">
							<MediaThumb item={selected} />
						</div>
						{formatDimensions(selected) && (
							<span className="text-muted-foreground text-center text-xs">
								{formatDimensions(selected)}
							</span>
						)}
					</div>
					<div className="flex flex-col gap-3">
						<AltTextEditor
							mediaId={selected.id}
							value={alt}
							onChange={setAlt}
							disabled={saving}
						/>
						<Button
							type="button"
							className="gap-2 self-end"
							disabled={saving}
							onClick={confirm}
						>
							{saving ? (
								<Loader2 size={16} className="animate-spin" />
							) : (
								<ImagePlus size={16} />
							)}
							{confirmLabel}
						</Button>
					</div>
				</div>
			)}
		</div>
	);
}

interface MediaPickerButtonProps extends Omit<MediaPickerPanelProps, "onPick"> {
	onPick: (media: PickedMedia) => void;
	/** Текст кнопки-тригера. */
	triggerLabel?: string;
	triggerClassName?: string;
	size?: "default" | "sm";
}

/** Кнопка «З медіатеки» + діалог із пікером. */
export function MediaPickerButton({
	onPick,
	triggerLabel = "З медіатеки",
	triggerClassName,
	size = "sm",
	...panelProps
}: MediaPickerButtonProps) {
	const [open, setOpen] = useState(false);
	return (
		<>
			<Button
				type="button"
				variant="outline"
				size={size}
				className={triggerClassName ?? "gap-2"}
				onClick={() => setOpen(true)}
			>
				<Library size={15} />
				{triggerLabel}
			</Button>
			<Dialog open={open} onOpenChange={setOpen}>
				<DialogContent className="flex max-h-[90dvh] w-[min(56rem,calc(100vw-2rem))] max-w-none flex-col">
					<DialogHeader>
						<DialogTitle>Медіатека</DialogTitle>
						<DialogDescription>
							Оберіть зображення або завантажте нове
						</DialogDescription>
					</DialogHeader>
					{/* Монтуємо лише відкритим — список вантажиться при кожному відкритті. */}
					{open && (
						<MediaPickerPanel
							{...panelProps}
							onPick={(media) => {
								setOpen(false);
								onPick(media);
							}}
						/>
					)}
				</DialogContent>
			</Dialog>
		</>
	);
}

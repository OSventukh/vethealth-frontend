"use client";
import { useState } from "react";
import {
	type BulkDeleteMediaResult,
	bulkDeleteMediaAction,
} from "@/actions/media.action";
import type { MediaItem } from "@/api/types/media.type";
import { fileNameOf } from "@/components/media-library/media-grid";
import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogClose,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { toast } from "@/components/ui/use-toast";
import { UsageList } from "./media-details-sheet";

interface BulkDeleteDialogProps {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	items: MediaItem[];
	onDeleted: (ids: string[]) => void;
}

/**
 * Видаляє вибрані файли. Ті, що використовуються, бекенд без `force` пропускає —
 * тоді діалог показує, де саме, і пропонує видалити й їх свідомо.
 */
export function BulkDeleteDialog({
	open,
	onOpenChange,
	items,
	onDeleted,
}: BulkDeleteDialogProps) {
	const [deleting, setDeleting] = useState(false);
	const [inUse, setInUse] = useState<BulkDeleteMediaResult["inUse"]>([]);
	const names = new Map(
		items.map((item) => [item.id, item.originalName || fileNameOf(item.path)]),
	);

	const remove = async (ids: string[], force: boolean) => {
		setDeleting(true);
		const result = await bulkDeleteMediaAction(ids, force);
		setDeleting(false);
		if (!result.success) {
			toast({ variant: "destructive", description: result.message });
			return;
		}
		const { deleted, inUse: skipped } = result.data;
		if (deleted.length) {
			onDeleted(deleted);
			toast({
				variant: "success",
				description: `Видалено файлів: ${deleted.length}`,
			});
		}
		setInUse(skipped);
		if (!skipped.length) onOpenChange(false);
	};

	return (
		<Dialog
			open={open}
			onOpenChange={(next) => {
				if (!next) setInUse([]);
				onOpenChange(next);
			}}
		>
			<DialogContent className="max-h-[90dvh] overflow-y-auto">
				<DialogHeader>
					<DialogTitle>
						{inUse.length
							? `${inUse.length} файл(ів) використовуються`
							: `Видалити файлів: ${items.length}?`}
					</DialogTitle>
					<DialogDescription>
						{inUse.length
							? "Ці файли пропущено. Після примусового видалення обкладинки й картинки тем буде знято, а в тексті й соцмережах лишаться биті посилання."
							: "Файли буде видалено зі сховища назавжди. Якщо якийсь із них десь використовується, його буде пропущено з попередженням."}
					</DialogDescription>
				</DialogHeader>

				{inUse.map(({ id, usages }) => (
					<div key={id} className="flex flex-col gap-1.5">
						<span className="truncate text-sm font-medium">
							{names.get(id) ?? id}
						</span>
						<UsageList usages={usages} />
					</div>
				))}

				<DialogFooter>
					{inUse.length ? (
						<Button
							variant="destructive"
							disabled={deleting}
							onClick={() =>
								remove(
									inUse.map(({ id }) => id),
									true,
								)
							}
						>
							{deleting ? "Видалення…" : "Видалити попри використання"}
						</Button>
					) : (
						<Button
							variant="destructive"
							disabled={deleting || !items.length}
							onClick={() =>
								remove(
									items.map(({ id }) => id),
									false,
								)
							}
						>
							{deleting ? "Видалення…" : "Видалити"}
						</Button>
					)}
					<DialogClose
						render={<Button variant="outline" disabled={deleting} />}
					>
						{inUse.length ? "Залишити їх" : "Скасувати"}
					</DialogClose>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}

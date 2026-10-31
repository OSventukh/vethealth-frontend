"use client";
import { Loader2, Save, Sparkles, Square } from "lucide-react";
import type { MediaItem } from "@/api/types/media.type";
import { fileNameOf, MediaThumb } from "@/components/media-library/media-grid";
import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/components/ui/use-toast";
import type { BulkAlt } from "../use-bulk-alt";

interface BulkAltDialogProps {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	bulk: BulkAlt;
	/** Що генерувати, якщо прогону ще не було (вибрані або всі без alt). */
	source: MediaItem[] | null;
	loadingSource: boolean;
}

export function BulkAltDialog({
	open,
	onOpenChange,
	bulk,
	source,
	loadingSource,
}: BulkAltDialogProps) {
	const toSave = bulk.drafts.filter(
		(draft) => draft.include && draft.alt?.trim(),
	).length;
	const idle = !bulk.running && bulk.drafts.length === 0;

	const save = async () => {
		const { saved, failed } = await bulk.save();
		toast({
			variant: failed ? "destructive" : "success",
			description: failed
				? `Збережено ${saved}, не вдалося ${failed}`
				: `Збережено alt для ${saved} зображень`,
		});
	};

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent className="flex max-h-[90dvh] w-[min(56rem,calc(100vw-2rem))] max-w-none flex-col">
				<DialogHeader>
					<DialogTitle>Масова генерація alt</DialogTitle>
					<DialogDescription>
						ШІ пропонує alt для кожного зображення по черзі. Нічого не
						зберігається, доки ви не переглянете й не натиснете «Зберегти».
					</DialogDescription>
				</DialogHeader>

				{idle && (
					<div className="flex flex-col items-start gap-3 py-2">
						{loadingSource ? (
							<Loader2 className="text-muted-foreground animate-spin" />
						) : source?.length ? (
							<>
								<p className="text-sm">
									До генерації: <strong>{source.length}</strong> зображень. Це{" "}
									{source.length} платних запитів до ШІ; бекенд пропускає до 30
									на хвилину, тож велика партія займе кілька хвилин.
								</p>
								<Button className="gap-2" onClick={() => bulk.start(source)}>
									<Sparkles size={16} /> Почати генерацію
								</Button>
							</>
						) : (
							<p className="text-muted-foreground text-sm">
								Немає зображень без alt — усе заповнено.
							</p>
						)}
					</div>
				)}

				{(bulk.running || bulk.summary) && (
					<div className="flex flex-wrap items-center justify-between gap-2 text-sm">
						<span>
							{bulk.running && bulk.progress
								? bulk.progress.waitingSeconds
									? `Ліміт запитів — продовжимо за ${bulk.progress.waitingSeconds} с…`
									: `Генерація ${bulk.progress.done + 1} з ${bulk.progress.total}…`
								: bulk.summary &&
									`Готово: ${bulk.summary.succeeded}, помилок: ${bulk.summary.failed}${
										bulk.summary.cancelled ? " (зупинено)" : ""
									}`}
						</span>
						{bulk.running && (
							<Button
								variant="outline"
								size="sm"
								className="gap-1.5"
								onClick={bulk.stop}
							>
								<Square size={13} /> Зупинити
							</Button>
						)}
					</div>
				)}
				{bulk.summary?.abortedWith && (
					<p className="text-destructive text-sm">
						Прогін зупинено: {bulk.summary.abortedWith}
					</p>
				)}

				{bulk.drafts.length > 0 && (
					<ul className="-mr-2 flex min-h-0 flex-col divide-y overflow-y-auto pr-2">
						{bulk.drafts.map((draft) => (
							<li
								key={draft.item.id}
								className="grid grid-cols-[4.5rem_1fr] gap-3 py-3"
							>
								<div className="bg-muted/40 aspect-square overflow-hidden rounded-md border">
									<MediaThumb item={draft.item} />
								</div>
								<div className="flex min-w-0 flex-col gap-1.5">
									<div className="flex items-center justify-between gap-2">
										<span className="truncate text-xs font-medium">
											{draft.item.originalName || fileNameOf(draft.item.path)}
										</span>
										{draft.alt !== undefined && (
											<label className="flex shrink-0 items-center gap-1.5 text-xs">
												<input
													type="checkbox"
													className="accent-primary"
													checked={draft.include}
													onChange={(event) =>
														bulk.setInclude(draft.item.id, event.target.checked)
													}
												/>
												Зберегти
											</label>
										)}
									</div>
									{draft.alt !== undefined ? (
										<Textarea
											value={draft.alt}
											maxLength={500}
											disabled={bulk.saving}
											className="min-h-[60px] text-sm"
											onChange={(event) =>
												bulk.setAlt(draft.item.id, event.target.value)
											}
										/>
									) : draft.error ? null : (
										<span className="text-muted-foreground text-xs">
											Очікує…
										</span>
									)}
									{draft.error && (
										<span className="text-destructive text-xs">
											{draft.error}
										</span>
									)}
								</div>
							</li>
						))}
					</ul>
				)}

				{bulk.drafts.length > 0 && (
					<DialogFooter className="gap-2 sm:justify-between">
						<Button
							variant="outline"
							disabled={bulk.running || bulk.saving}
							onClick={bulk.clear}
						>
							Відкинути все
						</Button>
						<Button
							className="gap-2"
							disabled={bulk.running || bulk.saving || toSave === 0}
							onClick={save}
						>
							{bulk.saving ? (
								<Loader2 size={16} className="animate-spin" />
							) : (
								<Save size={16} />
							)}
							Зберегти вибрані ({toSave})
						</Button>
					</DialogFooter>
				)}
			</DialogContent>
		</Dialog>
	);
}

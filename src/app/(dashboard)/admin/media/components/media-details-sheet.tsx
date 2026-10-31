"use client";
import { Copy, ExternalLink, Loader2, Save, Trash2 } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import {
	deleteMediaAction,
	getMediaAction,
	updateMediaAltAction,
} from "@/actions/media.action";
import type {
	MediaDetails,
	MediaItem,
	MediaUsage,
	MediaUsageField,
	MediaUsageType,
} from "@/api/types/media.type";
import { AltTextEditor } from "@/components/media-library/alt-text-editor";
import {
	ADMIN_IMAGE_REFERRER_POLICY,
	fileNameOf,
	formatBytes,
	formatDimensions,
} from "@/components/media-library/media-grid";
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
import {
	Sheet,
	SheetContent,
	SheetDescription,
	SheetHeader,
	SheetTitle,
} from "@/components/ui/sheet";
import { toast } from "@/components/ui/use-toast";

const TYPE_LABELS: Record<MediaUsageType, string> = {
	post: "Стаття",
	page: "Сторінка",
	topic: "Тема",
};

const FIELD_LABELS: Record<MediaUsageField, string> = {
	cover: "обкладинка",
	image: "зображення теми",
	content: "у тексті",
	social: "соцмережі (OG)",
};

const EDIT_ROUTES: Record<MediaUsageType, string> = {
	post: "/admin/posts/edit/",
	page: "/admin/pages/edit/",
	topic: "/admin/topics/edit/",
};

interface MediaDetailsSheetProps {
	mediaId: string | null;
	canManage: boolean;
	onClose: () => void;
	onUpdated: (item: MediaItem) => void;
	onDeleted: (id: string) => void;
}

export function MediaDetailsSheet({
	mediaId,
	canManage,
	onClose,
	onUpdated,
	onDeleted,
}: MediaDetailsSheetProps) {
	const [details, setDetails] = useState<MediaDetails | null>(null);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		if (!mediaId) return;
		let cancelled = false;
		setDetails(null);
		setError(null);
		getMediaAction(mediaId).then((result) => {
			if (cancelled) return;
			if (result.success) setDetails(result.data);
			else setError(result.message);
		});
		return () => {
			cancelled = true;
		};
	}, [mediaId]);

	return (
		<Sheet open={Boolean(mediaId)} onOpenChange={(open) => !open && onClose()}>
			<SheetContent className="flex w-full flex-col gap-0 overflow-y-auto p-0 sm:max-w-lg">
				<SheetHeader className="border-b p-5">
					<SheetTitle className="truncate pr-6">
						{details
							? details.originalName || fileNameOf(details.path)
							: "Файл"}
					</SheetTitle>
					<SheetDescription>Деталі, alt-текст і використання</SheetDescription>
				</SheetHeader>
				{error && <p className="text-destructive p-5 text-sm">{error}</p>}
				{!details && !error && (
					<div className="flex justify-center p-10">
						<Loader2 className="text-muted-foreground animate-spin" />
					</div>
				)}
				{details && (
					<MediaDetailsBody
						// Новий файл — новий стан форми alt.
						key={details.id}
						details={details}
						canManage={canManage}
						onUpdated={(item) => {
							setDetails({ ...details, ...item });
							onUpdated(item);
						}}
						onDeleted={onDeleted}
					/>
				)}
			</SheetContent>
		</Sheet>
	);
}

function MediaDetailsBody({
	details,
	canManage,
	onUpdated,
	onDeleted,
}: {
	details: MediaDetails;
	canManage: boolean;
	onUpdated: (item: MediaItem) => void;
	onDeleted: (id: string) => void;
}) {
	const [alt, setAlt] = useState(details.alt ?? "");
	const [saving, setSaving] = useState(false);
	// Розміри з БД; для SVG без атрибутів — те, що намалював браузер.
	const [dimensions, setDimensions] = useState(formatDimensions(details));
	const dirty = alt.trim() !== (details.alt ?? "");

	const save = async () => {
		setSaving(true);
		const result = await updateMediaAltAction(details.id, alt.trim());
		setSaving(false);
		if (!result.success) {
			toast({ variant: "destructive", description: result.message });
			return;
		}
		setAlt(result.data.alt ?? "");
		onUpdated(result.data);
		toast({ variant: "success", description: "Alt-текст збережено" });
	};

	const info = [
		details.mimeType,
		formatBytes(details.size),
		dimensions,
		new Date(details.createdAt).toLocaleDateString("uk-UA"),
	].filter(Boolean);

	return (
		<div className="flex flex-col gap-6 p-5">
			<div className="bg-muted/40 flex max-h-80 items-center justify-center overflow-hidden rounded-lg border">
				{/* eslint-disable-next-line @next/next/no-img-element -- див. MediaThumb */}
				<img
					src={details.path}
					alt={details.alt || ""}
					referrerPolicy={ADMIN_IMAGE_REFERRER_POLICY}
					className="max-h-80 w-auto object-contain"
					onLoad={(event) => {
						const { naturalWidth, naturalHeight } = event.currentTarget;
						if (naturalWidth && !details.width) {
							setDimensions(`${naturalWidth}×${naturalHeight}`);
						}
					}}
				/>
			</div>

			<div className="flex flex-col gap-2 text-sm">
				<p className="text-muted-foreground">{info.join(" · ")}</p>
				<div className="flex items-center gap-2">
					<code className="bg-muted min-w-0 flex-1 truncate rounded px-2 py-1 text-xs">
						{details.path}
					</code>
					<Button
						type="button"
						variant="outline"
						size="sm"
						aria-label="Копіювати URL"
						onClick={() => {
							navigator.clipboard.writeText(details.path);
							toast({ description: "URL скопійовано" });
						}}
					>
						<Copy size={14} />
					</Button>
					<Button variant="outline" size="sm" asChild>
						<a
							href={details.path}
							target="_blank"
							rel="noreferrer"
							aria-label="Відкрити в новій вкладці"
						>
							<ExternalLink size={14} />
						</a>
					</Button>
				</div>
			</div>

			{canManage ? (
				<div className="flex flex-col gap-3">
					<AltTextEditor
						mediaId={details.id}
						value={alt}
						onChange={setAlt}
						disabled={saving}
					/>
					<Button
						type="button"
						className="gap-2 self-end"
						disabled={!dirty || saving}
						onClick={save}
					>
						{saving ? (
							<Loader2 size={16} className="animate-spin" />
						) : (
							<Save size={16} />
						)}
						Зберегти alt
					</Button>
					<p className="text-muted-foreground text-xs">
						Новий alt підставляється, коли зображення обирають з медіатеки, і
						використовується для обкладинок та картинок тем. У вже вставлених у
						текст зображеннях alt лишається той, що був при вставці.
					</p>
				</div>
			) : (
				<div className="flex flex-col gap-1 text-sm">
					<span className="font-medium">Альтернативний текст</span>
					<p className={details.alt ? "" : "text-muted-foreground"}>
						{details.alt || "Не заповнено"}
					</p>
					<p className="text-muted-foreground text-xs">
						Змінювати alt у медіатеці можуть адміністратори.
					</p>
				</div>
			)}

			<section className="flex flex-col gap-2">
				<h3 className="text-sm font-semibold">
					Використання{" "}
					<span className="text-muted-foreground font-normal">
						· {details.usages.length || "ніде"}
					</span>
				</h3>
				<UsageList usages={details.usages} />
			</section>

			{canManage && (
				<DeleteMediaButton details={details} onDeleted={onDeleted} />
			)}
		</div>
	);
}

export function UsageList({ usages }: { usages: MediaUsage[] }) {
	if (!usages.length) {
		return (
			<p className="text-muted-foreground text-sm">
				Не знайдено в жодній статті, сторінці чи темі.
			</p>
		);
	}
	return (
		<ul className="flex flex-col divide-y rounded-lg border text-sm">
			{usages.map((usage) => (
				<li
					key={`${usage.type}:${usage.id}`}
					className="flex items-center justify-between gap-3 px-3 py-2"
				>
					<div className="min-w-0">
						<Link
							href={EDIT_ROUTES[usage.type] + usage.slug}
							className="hover:text-primary block truncate font-medium underline-offset-2 hover:underline"
						>
							{usage.title}
						</Link>
						<span className="text-muted-foreground text-xs">
							{TYPE_LABELS[usage.type]} ·{" "}
							{usage.fields.map((field) => FIELD_LABELS[field]).join(", ")}
						</span>
					</div>
				</li>
			))}
		</ul>
	);
}

function DeleteMediaButton({
	details,
	onDeleted,
}: {
	details: MediaDetails;
	onDeleted: (id: string) => void;
}) {
	const [open, setOpen] = useState(false);
	const [deleting, setDeleting] = useState(false);
	// Бекенд міг знайти використання, яких не було на момент відкриття панелі.
	const [usages, setUsages] = useState(details.usages);

	const remove = async () => {
		setDeleting(true);
		const result = await deleteMediaAction(details.id, usages.length > 0);
		setDeleting(false);
		if (result.success) {
			setOpen(false);
			toast({ variant: "success", description: "Файл видалено" });
			onDeleted(details.id);
			return;
		}
		if (result.usages) {
			setUsages(result.usages);
			return;
		}
		toast({ variant: "destructive", description: result.message });
	};

	return (
		<>
			<Button
				type="button"
				variant="outline"
				className="text-destructive hover:text-destructive gap-2 self-start"
				onClick={() => {
					setUsages(details.usages);
					setOpen(true);
				}}
			>
				<Trash2 size={16} /> Видалити файл
			</Button>
			<Dialog open={open} onOpenChange={setOpen}>
				<DialogContent>
					<DialogHeader>
						<DialogTitle>Видалити файл?</DialogTitle>
						<DialogDescription>
							{usages.length
								? "Зображення використовується в матеріалах нижче. Після видалення обкладинки й картинки тем буде знято, а в тексті й соцмережах лишаться биті посилання."
								: "Файл буде видалено зі сховища назавжди."}
						</DialogDescription>
					</DialogHeader>
					{usages.length > 0 && <UsageList usages={usages} />}
					<DialogFooter>
						<Button variant="destructive" disabled={deleting} onClick={remove}>
							{deleting
								? "Видалення…"
								: usages.length
									? "Видалити попри використання"
									: "Видалити"}
						</Button>
						<DialogClose
							render={<Button variant="outline" disabled={deleting} />}
						>
							Скасувати
						</DialogClose>
					</DialogFooter>
				</DialogContent>
			</Dialog>
		</>
	);
}

"use client";
import {
	CheckSquare,
	Loader2,
	Search,
	Sparkles,
	Trash2,
	X,
} from "lucide-react";
import { useState } from "react";
import { listMediaAction } from "@/actions/media.action";
import type { Pagination } from "@/api/types/general.type";
import type { MediaItem } from "@/api/types/media.type";
import { MediaGrid } from "@/components/media-library/media-grid";
import { MediaUploadButton } from "@/components/media-library/media-upload-button";
import { useCanManageMedia } from "@/components/media-library/media-permissions";
import { useMediaList } from "@/components/media-library/use-media-list";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { toast } from "@/components/ui/use-toast";
import { useBulkAlt } from "../use-bulk-alt";
import { BulkAltDialog } from "./bulk-alt-dialog";
import { BulkDeleteDialog } from "./bulk-delete-dialog";
import { MediaDetailsSheet } from "./media-details-sheet";

// OG-зображення — 1200px завширшки; вужчі соцмережі розтягнуть і розмиють.
const WIDTH_FILTERS = [
	{ value: "any", label: "Будь-який розмір" },
	{ value: "1200", label: "Вужчі за 1200 px (замалі для OG)" },
	{ value: "800", label: "Вужчі за 800 px" },
];

const ALL_PAGES_SIZE = 100;

interface MediaWorkspaceProps {
	initial: Pagination<MediaItem>;
}

export function MediaWorkspace({ initial }: MediaWorkspaceProps) {
	// Alt, ШІ і видалення — лише Admin+; авторам лишаються перегляд і завантаження.
	const canManage = useCanManageMedia();
	const list = useMediaList(initial);
	const [openedId, setOpenedId] = useState<string | null>(null);
	const [selecting, setSelecting] = useState(false);
	const [checked, setChecked] = useState<Map<string, MediaItem>>(new Map());
	const [altOpen, setAltOpen] = useState(false);
	const [altSource, setAltSource] = useState<MediaItem[] | null>(null);
	const [loadingSource, setLoadingSource] = useState(false);
	const [deleteOpen, setDeleteOpen] = useState(false);
	const bulkAlt = useBulkAlt(list.replace);

	const toggle = (item: MediaItem) =>
		setChecked((previous) => {
			const next = new Map(previous);
			if (next.has(item.id)) next.delete(item.id);
			else next.set(item.id, item);
			return next;
		});

	const stopSelecting = () => {
		setSelecting(false);
		setChecked(new Map());
	};

	const openBulkAlt = async (items?: MediaItem[]) => {
		setAltOpen(true);
		// Уже є прогін/чернетки — показуємо їх, а не починаємо новий.
		if (bulkAlt.running || bulkAlt.drafts.length) return;
		if (items) {
			setAltSource(items);
			return;
		}
		setLoadingSource(true);
		const all: MediaItem[] = [];
		for (let page = 1; ; page++) {
			// Сторінки по черзі: наступна потрібна, лише якщо є ще.
			// oxlint-disable-next-line no-await-in-loop
			const result = await listMediaAction({
				page,
				size: ALL_PAGES_SIZE,
				missingAlt: true,
			});
			if (!result.success) {
				toast({ variant: "destructive", description: result.message });
				break;
			}
			all.push(...result.data.items);
			if (page >= result.data.totalPages) break;
		}
		setLoadingSource(false);
		setAltSource(all);
	};

	const checkedItems = [...checked.values()];

	return (
		<div className="flex w-full flex-col gap-5">
			<header className="flex flex-wrap items-end justify-between gap-3">
				<div>
					<h1 className="text-2xl font-bold">Медіа</h1>
					<p className="text-muted-foreground text-sm">
						{list.filters.search ||
						list.filters.missingAlt ||
						list.filters.unused ||
						list.filters.narrowerThan
							? `Знайдено: ${list.count}`
							: `Усі завантажені зображення · ${list.count}`}
					</p>
				</div>
				<div className="flex flex-wrap gap-2">
					{canManage && (
						<Button
							variant="outline"
							className="gap-2"
							onClick={() => openBulkAlt()}
						>
							{bulkAlt.running ? (
								<Loader2 size={16} className="animate-spin" />
							) : (
								<Sparkles size={16} />
							)}
							{bulkAlt.running
								? "Генерація alt…"
								: bulkAlt.unsaved
									? `Переглянути alt (${bulkAlt.unsaved})`
									: "Згенерувати alt для всіх без alt"}
						</Button>
					)}
					<MediaUploadButton
						multiple
						onUploaded={(item) => list.prepend(item)}
					/>
				</div>
			</header>

			<div className="flex flex-wrap items-center gap-x-5 gap-y-3">
				<div className="relative max-w-md min-w-56 flex-1">
					<Search
						size={15}
						className="text-muted-foreground absolute top-1/2 left-3 -translate-y-1/2"
					/>
					<Input
						value={list.filters.search}
						placeholder="Пошук за назвою, alt або шляхом"
						className="bg-background pl-9"
						onChange={(event) => list.setSearch(event.target.value)}
					/>
				</div>
				<FilterSwitch
					id="media-missing-alt"
					label="Лише без alt"
					checked={list.filters.missingAlt}
					onChange={(value) => list.setFilter("missingAlt", value)}
				/>
				<FilterSwitch
					id="media-unused"
					label="Невикористані"
					checked={list.filters.unused}
					onChange={(value) => list.setFilter("unused", value)}
				/>
				<Select
					items={WIDTH_FILTERS}
					value={String(list.filters.narrowerThan ?? "any")}
					onValueChange={(value) =>
						list.setFilter(
							"narrowerThan",
							value && value !== "any" ? Number(value) : undefined,
						)
					}
				>
					<SelectTrigger className="bg-background w-64">
						<SelectValue />
					</SelectTrigger>
					<SelectContent>
						{WIDTH_FILTERS.map(({ value, label }) => (
							<SelectItem key={value} value={value}>
								{label}
							</SelectItem>
						))}
					</SelectContent>
				</Select>
			</div>

			{/* Масові дії (alt, видалення) — лише Admin+. */}
			{canManage && (
				<div className="flex min-h-9 flex-wrap items-center gap-2">
					{selecting ? (
						<>
							<span className="text-sm font-medium">
								Вибрано: {checked.size}
							</span>
							<Button
								variant="outline"
								size="sm"
								onClick={() =>
									setChecked(new Map(list.items.map((item) => [item.id, item])))
								}
							>
								Вибрати всі показані
							</Button>
							<Button
								variant="outline"
								size="sm"
								className="gap-1.5"
								disabled={!checked.size || bulkAlt.running}
								onClick={() => openBulkAlt(checkedItems)}
							>
								<Sparkles size={14} /> Згенерувати alt
							</Button>
							{canManage && (
								<Button
									variant="outline"
									size="sm"
									className="text-destructive hover:text-destructive gap-1.5"
									disabled={!checked.size}
									onClick={() => setDeleteOpen(true)}
								>
									<Trash2 size={14} /> Видалити
								</Button>
							)}
							<Button
								variant="ghost"
								size="sm"
								className="gap-1.5"
								onClick={stopSelecting}
							>
								<X size={14} /> Скасувати
							</Button>
						</>
					) : (
						<Button
							variant="outline"
							size="sm"
							className="gap-1.5"
							onClick={() => setSelecting(true)}
						>
							<CheckSquare size={14} /> Вибрати кілька
						</Button>
					)}
				</div>
			)}

			{list.error && <p className="text-destructive text-sm">{list.error}</p>}
			{!list.error && !list.loading && list.items.length === 0 && (
				<p className="text-muted-foreground py-16 text-center">
					{list.filters.unused
						? "Невикористаних файлів немає"
						: list.filters.search ||
							  list.filters.missingAlt ||
							  list.filters.narrowerThan
							? "Нічого не знайдено"
							: "Медіатека порожня — завантажте перше зображення"}
				</p>
			)}

			<MediaGrid
				items={list.items}
				selectedId={selecting ? null : openedId}
				checkedIds={selecting ? new Set(checked.keys()) : undefined}
				onSelect={(item) => (selecting ? toggle(item) : setOpenedId(item.id))}
				className="grid-cols-[repeat(auto-fill,minmax(9.5rem,1fr))]"
			/>

			{(list.hasMore || list.loading) && (
				<div className="flex justify-center pb-4">
					<Button
						variant="outline"
						disabled={list.loading}
						onClick={list.loadMore}
					>
						{list.loading ? (
							<Loader2 size={16} className="animate-spin" />
						) : (
							"Показати ще"
						)}
					</Button>
				</div>
			)}

			<MediaDetailsSheet
				mediaId={openedId}
				canManage={canManage}
				onClose={() => setOpenedId(null)}
				onUpdated={list.replace}
				onDeleted={(id) => {
					list.remove(id);
					setOpenedId(null);
				}}
			/>
			<BulkAltDialog
				open={altOpen}
				onOpenChange={setAltOpen}
				bulk={bulkAlt}
				source={altSource}
				loadingSource={loadingSource}
			/>
			{canManage && (
				<BulkDeleteDialog
					open={deleteOpen}
					onOpenChange={setDeleteOpen}
					items={checkedItems}
					onDeleted={(ids) => {
						for (const id of ids) list.remove(id);
						setChecked((previous) => {
							const next = new Map(previous);
							for (const id of ids) next.delete(id);
							return next;
						});
					}}
				/>
			)}
		</div>
	);
}

function FilterSwitch({
	id,
	label,
	checked,
	onChange,
}: {
	id: string;
	label: string;
	checked: boolean;
	onChange: (checked: boolean) => void;
}) {
	return (
		<div className="flex items-center gap-2">
			<Switch id={id} checked={checked} onCheckedChange={onChange} />
			<Label htmlFor={id}>{label}</Label>
		</div>
	);
}

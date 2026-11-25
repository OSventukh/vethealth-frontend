"use client";
import {
	ArrowLeftIcon,
	HistoryIcon,
	Loader2,
	RotateCcwIcon,
	TriangleAlertIcon,
} from "lucide-react";
import { useState, useTransition } from "react";
import type {
	PostRevision,
	PostRevisionSummary,
} from "@/api/types/post-revisions.type";
import type { PostResponse } from "@/api/types/posts.type";
import { ParsedContent } from "@/app/(dashboard)/admin/components/Editor/ParsedContent";
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
import { useToast } from "@/components/ui/use-toast";
import { cn } from "@/lib/utils";
import {
	getPostRevisionAction,
	listPostRevisionsAction,
	restorePostRevisionAction,
} from "../../../actions/post-revisions.action";
import {
	diffRevision,
	editorName,
	formatRevisionDate,
	parseRevisionContent,
	REASON_LABELS,
	type RevisionComparable,
	STATUS_LABELS,
} from "./revision-diff";

interface Props {
	postId: string;
	/** Поточний стан форми — читається в момент перегляду версії. */
	getCurrent: () => RevisionComparable;
	/** Чи є у формі незбережені зміни (відновлення їх відкине). */
	isDirty: boolean;
	onRestored: (post: PostResponse) => void;
}

export function RevisionHistoryButton({
	postId,
	getCurrent,
	isDirty,
	onRestored,
}: Props) {
	const { toast } = useToast();
	const [open, setOpen] = useState(false);
	const [revisions, setRevisions] = useState<PostRevisionSummary[] | null>(
		null,
	);
	const [selected, setSelected] = useState<PostRevision | null>(null);
	const [error, setError] = useState<string | null>(null);
	// Окремий прапорець, а не isPending транзиції: стан, виставлений після
	// `await`, рендериться раніше, ніж транзиція завершиться, — і щойно
	// показаний рядок/кнопка ще якусь мить були б disabled (клік губився).
	const [openingId, setOpeningId] = useState<string | null>(null);
	const [isRestoring, startRestoring] = useTransition();
	const [confirmOpen, setConfirmOpen] = useState(false);

	// Список щоразу свіжий: між відкриттями могли зберегти нову версію.
	const openHistory = () => {
		setOpen(true);
		setRevisions(null);
		setSelected(null);
		setError(null);
		void listPostRevisionsAction(postId).then((res) => {
			if (res.success) setRevisions(res.data);
			else setError(res.message);
		});
	};

	const openRevision = (summary: PostRevisionSummary) => {
		setError(null);
		setOpeningId(summary.id);
		void getPostRevisionAction(postId, summary.id).then((res) => {
			setOpeningId(null);
			if (res.success) setSelected(res.data);
			else setError(res.message);
		});
	};

	const restore = () => {
		if (!selected) return;
		startRestoring(async () => {
			const res = await restorePostRevisionAction(postId, selected.id);
			setConfirmOpen(false);
			if (!res.success) {
				toast({ variant: "destructive", description: res.message });
				return;
			}
			toast({
				variant: "success",
				description: `Відновлено версію від ${formatRevisionDate(selected.createdAt)}`,
			});
			setOpen(false);
			onRestored(res.data);
		});
	};

	const latestId = revisions?.[0]?.id;
	const findDate = (id: string | null) =>
		revisions?.find((revision) => revision.id === id)?.createdAt;

	return (
		<>
			<Button
				type="button"
				variant="outline"
				className="h-11 gap-2"
				onClick={openHistory}
			>
				<HistoryIcon size={15} />
				Історія змін
			</Button>

			<Sheet open={open} onOpenChange={setOpen}>
				<SheetContent className="flex w-full flex-col gap-0 overflow-y-auto p-0 sm:max-w-xl">
					<SheetHeader className="border-b p-5">
						<SheetTitle className="flex items-center gap-2 pr-6">
							<HistoryIcon size={18} />
							Історія змін
						</SheetTitle>
						<SheetDescription>
							Кожне збереження статті — окрема версія. Зберігаються останні 50.
						</SheetDescription>
					</SheetHeader>

					{error && (
						<p className="text-destructive p-5 text-sm" role="alert">
							{error}
						</p>
					)}

					{selected ? (
						<RevisionDetails
							revision={selected}
							isLatest={selected.id === latestId}
							changes={diffRevision(selected, getCurrent())}
							restoredFromDate={findDate(selected.restoredFromId)}
							onBack={() => setSelected(null)}
							onRestore={() => setConfirmOpen(true)}
						/>
					) : revisions === null ? (
						!error && (
							<div className="flex justify-center p-10">
								<Loader2 className="text-muted-foreground animate-spin" />
							</div>
						)
					) : revisions.length === 0 ? (
						<p className="text-muted-foreground p-5 text-sm">
							Історія зʼявиться після першого збереження статті.
						</p>
					) : (
						<ol className="flex flex-col">
							{revisions.map((revision) => {
								const restoredFrom = findDate(revision.restoredFromId);
								return (
									<li key={revision.id} className="border-b last:border-b-0">
										<button
											type="button"
											disabled={openingId !== null}
											onClick={() => openRevision(revision)}
											className="hover:bg-muted/60 flex w-full flex-col gap-1 px-5 py-3 text-left transition-colors disabled:opacity-60"
										>
											<span className="flex flex-wrap items-center gap-2 text-sm font-semibold">
												{formatRevisionDate(revision.createdAt)}
												{revision.id === latestId && (
													<span className="bg-primary text-primary-foreground rounded-full px-2 py-0.5 text-xs">
														Поточна
													</span>
												)}
												{revision.status && (
													<span className="text-muted-foreground rounded-full border px-2 py-0.5 text-xs font-medium">
														{STATUS_LABELS[revision.status] ?? revision.status}
													</span>
												)}
											</span>
											<span className="text-muted-foreground text-xs">
												{REASON_LABELS[revision.reason]}
												{revision.reason === "restore" &&
													restoredFrom &&
													` з версії від ${formatRevisionDate(restoredFrom)}`}
												{" · "}
												{editorName(revision)}
											</span>
											<span className="truncate text-sm">{revision.title}</span>
										</button>
									</li>
								);
							})}
						</ol>
					)}
					{/* Усередині SheetContent: Base UI вважає діалог вкладеним. Поза
					    деревом панелі модальний Sheet робить його inert — кнопки не клікаються. */}
					<Dialog open={confirmOpen} onOpenChange={setConfirmOpen}>
						<DialogContent>
							<DialogHeader>
								<DialogTitle>Відновити цю версію?</DialogTitle>
							</DialogHeader>
							<DialogDescription>
								Заголовок, адреса, текст, обкладинка і SEO-поля статті стануть
								такими, як у версії від{" "}
								{selected && formatRevisionDate(selected.createdAt)}. Статус
								публікації, теми й категорії не зміняться. Поточна версія
								лишиться в історії — до неї можна буде повернутися.
							</DialogDescription>
							{isDirty && (
								<p className="flex items-start gap-2 rounded-md border border-amber-300 bg-amber-50 p-3 text-sm text-amber-900">
									<TriangleAlertIcon size={16} className="mt-0.5 shrink-0" />
									У редакторі є незбережені зміни — їх буде втрачено.
								</p>
							)}
							<DialogFooter>
								<Button
									className="gap-2"
									disabled={isRestoring}
									onClick={restore}
								>
									{isRestoring ? (
										<Loader2 size={16} className="animate-spin" />
									) : (
										<RotateCcwIcon size={16} />
									)}
									Відновити
								</Button>
								<DialogClose render={<Button variant="outline" />}>
									Скасувати
								</DialogClose>
							</DialogFooter>
						</DialogContent>
					</Dialog>
				</SheetContent>
			</Sheet>
		</>
	);
}

interface DetailsProps {
	revision: PostRevision;
	isLatest: boolean;
	changes: ReturnType<typeof diffRevision>;
	restoredFromDate?: string;
	onBack: () => void;
	onRestore: () => void;
}

function RevisionDetails({
	revision,
	isLatest,
	changes,
	restoredFromDate,
	onBack,
	onRestore,
}: DetailsProps) {
	const content = parseRevisionContent(revision.content);
	const meta = revision.metadata;

	return (
		<div className="flex flex-col gap-5 p-5">
			<div className="flex flex-wrap items-center justify-between gap-2">
				<Button
					type="button"
					variant="ghost"
					size="sm"
					className="-ml-2 gap-2"
					onClick={onBack}
				>
					<ArrowLeftIcon size={15} />
					До списку
				</Button>
				{!isLatest && (
					<Button
						type="button"
						className="gap-2"
						disabled={changes.length === 0}
						onClick={onRestore}
					>
						<RotateCcwIcon size={15} />
						Відновити цю версію
					</Button>
				)}
			</div>

			<div className="flex flex-col gap-1 text-sm">
				<p className="font-semibold">
					{formatRevisionDate(revision.createdAt)}
					{isLatest && " · поточна збережена версія"}
				</p>
				<p className="text-muted-foreground">
					{REASON_LABELS[revision.reason]}
					{restoredFromDate &&
						` з версії від ${formatRevisionDate(restoredFromDate)}`}
					{" · "}
					{editorName(revision)}
					{revision.status &&
						` · ${STATUS_LABELS[revision.status] ?? revision.status}`}
				</p>
			</div>

			<section
				className={cn(
					"rounded-lg border p-4 text-sm",
					changes.length ? "bg-muted/40" : "bg-green-50 text-green-900",
				)}
				aria-label="Відмінності від редактора"
			>
				{changes.length === 0 ? (
					<p>Ця версія збігається з тим, що зараз у редакторі.</p>
				) : (
					<>
						<p className="mb-2 font-semibold">
							Відрізняється від того, що зараз у редакторі:
						</p>
						<ul className="flex list-disc flex-col gap-1 pl-5">
							{changes.map((change) => (
								<li key={change.field}>
									{change.label}
									{change.detail && (
										<span className="text-muted-foreground">
											{" "}
											— {change.detail}
										</span>
									)}
								</li>
							))}
						</ul>
					</>
				)}
			</section>

			<dl className="grid grid-cols-[auto_1fr] gap-x-4 gap-y-2 text-sm">
				<dt className="text-muted-foreground">Заголовок</dt>
				<dd className="font-semibold break-words">{revision.title}</dd>
				<dt className="text-muted-foreground">Адреса</dt>
				<dd className="font-mono text-xs break-all">{revision.slug}</dd>
				{meta?.metaTitle && (
					<>
						<dt className="text-muted-foreground">SEO-заголовок</dt>
						<dd className="break-words">{meta.metaTitle}</dd>
					</>
				)}
				{meta?.metaDescription && (
					<>
						<dt className="text-muted-foreground">SEO-опис</dt>
						<dd className="break-words">{meta.metaDescription}</dd>
					</>
				)}
			</dl>

			<div>
				<p className="text-muted-foreground mb-2 text-sm">Текст статті</p>
				<div className="prose prose-sm prose-headings:text-base max-h-[50vh] max-w-none overflow-y-auto rounded-lg border p-4">
					{content ? (
						<ParsedContent
							content={
								content as Parameters<typeof ParsedContent>[0]["content"]
							}
						/>
					) : (
						<p className="text-muted-foreground">
							Не вдалося показати текст цієї версії.
						</p>
					)}
				</div>
			</div>
		</div>
	);
}

"use client";
import { SaveIcon, SparklesIcon, SquareIcon } from "lucide-react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/components/ui/use-toast";
import { cn } from "@/lib/utils";
import {
	generateEntrySeoAction,
	saveEntrySeoAction,
} from "../actions/seo.action";
import {
	type BulkProgress,
	type BulkTask,
	runBulkGeneration,
} from "../run-bulk-generation";
import {
	dirtyFields,
	effectiveValues,
	fieldsToGenerate,
	filledCount,
	SEO_FIELDS,
	type SeoDraft,
	type SeoEntityType,
	type SeoEntry,
	type SeoField,
	TYPE_LABELS,
} from "../seo-fields";
import { useSeoDrafts } from "../use-seo-drafts";
import { type EntryBusy, SeoEntryCard } from "./seo-entry-card";

type TypeFilter = "all" | SeoEntityType;

const TYPE_FILTERS: TypeFilter[] = ["all", "topic", "post", "page"];

interface Props {
	initialEntries: SeoEntry[];
}

export function SeoWorkspace({ initialEntries }: Props) {
	const { toast } = useToast();
	const [entries, setEntries] = useState(initialEntries);
	const {
		drafts,
		restoredCount,
		setFields,
		revertField,
		clearEntry,
		clearAll,
	} = useSeoDrafts(initialEntries);

	const [typeFilter, setTypeFilter] = useState<TypeFilter>("all");
	const [onlyIncomplete, setOnlyIncomplete] = useState(false);
	const [onlyChanged, setOnlyChanged] = useState(false);
	const [overwrite, setOverwrite] = useState(false);
	const [selected, setSelected] = useState<Set<string>>(new Set());
	const [expanded, setExpanded] = useState<Set<string>>(new Set());
	const [busy, setBusy] = useState<Record<string, EntryBusy>>({});
	const [busyFields, setBusyFields] = useState<Record<string, Set<SeoField>>>(
		{},
	);
	const [errors, setErrors] = useState<Record<string, string>>({});
	const [hints, setHints] = useState<Record<string, string>>({});
	const [progress, setProgress] = useState<BulkProgress | null>(null);
	const [savingAll, setSavingAll] = useState(false);
	const cancelled = useRef(false);

	const running = progress !== null;
	const locked = running || savingAll;

	const dirtyKeys = useMemo(
		() =>
			entries
				.filter((entry) => dirtyFields(entry, drafts[entry.key]).length)
				.map((entry) => entry.key),
		[entries, drafts],
	);

	useEffect(() => {
		if (restoredCount) {
			toast({
				description: `Відновлено незбережені зміни: ${restoredCount}. Перегляньте і збережіть`,
			});
			setOnlyChanged(true);
		}
	}, [restoredCount, toast]);

	// Незбережене живе в localStorage, але про закриття вкладки краще
	// попередити: інакше редактор може вирішити, що все вже на сайті.
	useEffect(() => {
		if (!dirtyKeys.length && !running) {
			return;
		}
		const warn = (event: BeforeUnloadEvent) => event.preventDefault();
		window.addEventListener("beforeunload", warn);
		return () => window.removeEventListener("beforeunload", warn);
	}, [dirtyKeys.length, running]);

	const visible = useMemo(
		() =>
			entries.filter((entry) => {
				if (typeFilter !== "all" && entry.type !== typeFilter) {
					return false;
				}
				const draft = drafts[entry.key];
				if (onlyChanged && !dirtyFields(entry, draft).length) {
					return false;
				}
				return (
					!onlyIncomplete ||
					filledCount(effectiveValues(entry, draft)) < SEO_FIELDS.length
				);
			}),
		[entries, drafts, typeFilter, onlyIncomplete, onlyChanged],
	);

	const stats = useMemo(() => {
		const counts = entries.map((entry) => filledCount(entry.metadata));
		return {
			total: entries.length,
			complete: counts.filter((count) => count === SEO_FIELDS.length).length,
			empty: counts.filter((count) => count === 0).length,
		};
	}, [entries]);

	const setEntryBusy = (key: string, value: EntryBusy) =>
		setBusy((current) => ({ ...current, [key]: value }));

	const setEntryError = (key: string, message?: string) =>
		setErrors((current) => {
			const next = { ...current };
			if (message) {
				next[key] = message;
			} else {
				delete next[key];
			}
			return next;
		});

	const applyGenerated = useCallback(
		(entry: SeoEntry, data: SeoDraft) => {
			// Лише поля, яких відповідь стосується, — решта чернетки лишається.
			const values = Object.fromEntries(
				SEO_FIELDS.filter((field) => typeof data[field] === "string").map(
					(field) => [field, data[field]],
				),
			);
			setFields(entry, values);
		},
		[setFields],
	);

	const generateEntry = async (entry: SeoEntry, fields?: SeoField[]) => {
		const targets = new Set(fields ?? SEO_FIELDS);
		if (fields) {
			setBusyFields((current) => ({
				...current,
				[entry.key]: new Set([...(current[entry.key] ?? []), ...targets]),
			}));
		} else {
			setEntryBusy(entry.key, "generating");
		}
		setEntryError(entry.key);

		const result = await generateEntrySeoAction({
			type: entry.type,
			id: entry.id,
			fields,
			current: effectiveValues(entry, drafts[entry.key]),
			hint: hints[entry.key]?.trim() || undefined,
		});

		if (fields) {
			// Знімаємо лише свої поля — паралельна генерація іншого поля триває.
			setBusyFields((current) => ({
				...current,
				[entry.key]: new Set(
					[...(current[entry.key] ?? [])].filter(
						(field) => !targets.has(field),
					),
				),
			}));
		} else {
			setEntryBusy(entry.key, undefined);
		}
		if (!result.success || !result.data) {
			setEntryError(entry.key, result.message);
			return;
		}
		applyGenerated(entry, result.data);
	};

	const saveEntry = async (entry: SeoEntry): Promise<boolean> => {
		const draft = drafts[entry.key];
		const fields = dirtyFields(entry, draft);
		if (!fields.length) {
			return true;
		}
		setEntryBusy(entry.key, "saving");
		setEntryError(entry.key);

		const result = await saveEntrySeoAction({
			type: entry.type,
			id: entry.id,
			values: Object.fromEntries(fields.map((field) => [field, draft[field]])),
		});

		setEntryBusy(entry.key, undefined);
		if (!result.success || !result.data) {
			setEntryError(entry.key, result.message);
			return false;
		}
		const saved = result.data;
		setEntries((current) =>
			current.map((item) =>
				item.key === entry.key ? { ...item, metadata: saved } : item,
			),
		);
		clearEntry(entry.key);
		return true;
	};

	const handleSaveOne = async (entry: SeoEntry) => {
		if (await saveEntry(entry)) {
			toast({ variant: "success", description: `«${entry.title}» збережено` });
		}
	};

	const handleSaveAll = async () => {
		setSavingAll(true);
		let failed = 0;
		for (const entry of entries.filter((item) =>
			dirtyKeys.includes(item.key),
		)) {
			// Послідовно: кожне збереження — окремий PATCH, без сплеску запитів.
			// oxlint-disable-next-line no-await-in-loop
			if (!(await saveEntry(entry))) {
				failed++;
			}
		}
		setSavingAll(false);
		toast(
			failed
				? {
						variant: "destructive",
						description: `Не вдалося зберегти: ${failed}. Деталі — у картках`,
					}
				: { variant: "success", description: "Усі зміни збережено" },
		);
	};

	const handleRevertAll = () => {
		clearAll();
		setErrors({});
	};

	const handleBulkGenerate = async () => {
		const tasks: BulkTask[] = [];
		for (const entry of entries) {
			if (!selected.has(entry.key)) {
				continue;
			}
			const current = effectiveValues(entry, drafts[entry.key]);
			const fields = fieldsToGenerate(current, overwrite);
			if (!fields.length) {
				continue;
			}
			tasks.push({
				key: entry.key,
				title: entry.title,
				input: {
					type: entry.type,
					id: entry.id,
					fields: fields.length < SEO_FIELDS.length ? fields : undefined,
					current,
					hint: hints[entry.key]?.trim() || undefined,
				},
			});
		}
		if (!tasks.length) {
			toast({
				description: overwrite
					? "Нічого не вибрано"
					: "У вибраних матеріалах усі поля вже заповнені. Увімкніть «Перезаписувати заповнені»",
			});
			return;
		}

		const byKey = new Map(entries.map((entry) => [entry.key, entry]));
		cancelled.current = false;
		setProgress({ done: 0, total: tasks.length });

		const summary = await runBulkGeneration(tasks, {
			generate: generateEntrySeoAction,
			onSuccess: (task, data) => {
				setEntryError(task.key);
				const entry = byKey.get(task.key);
				if (entry) {
					applyGenerated(entry, data);
				}
			},
			onError: (task, message) => setEntryError(task.key, message),
			onProgress: setProgress,
			isCancelled: () => cancelled.current,
		});
		setProgress(null);
		setSelected(new Set());

		if (summary.succeeded) {
			setOnlyChanged(true);
		}
		toast({
			variant:
				summary.abortedWith || summary.failed ? "destructive" : "success",
			description: [
				summary.abortedWith
					? `Зупинено: ${summary.abortedWith}`
					: summary.cancelled
						? "Генерацію зупинено"
						: "Генерацію завершено",
				`Згенеровано: ${summary.succeeded}`,
				summary.failed ? `з помилкою: ${summary.failed}` : "",
				summary.succeeded ? "Перегляньте зміни і збережіть" : "",
			]
				.filter(Boolean)
				.join(". "),
		});
	};

	const allVisibleSelected =
		visible.length > 0 && visible.every((entry) => selected.has(entry.key));

	return (
		<div className="flex w-full max-w-6xl flex-col gap-4">
			<div className="flex flex-wrap items-end justify-between gap-x-8 gap-y-3">
				<div className="flex min-w-0 flex-1 flex-col gap-3">
					<h1 className="text-2xl font-semibold">SEO</h1>
					<CoverageBar {...stats} />
				</div>
				<div className="flex flex-wrap gap-2">
					<Button
						variant="ghost"
						onClick={handleRevertAll}
						disabled={locked || dirtyKeys.length === 0}
					>
						Скасувати всі зміни
					</Button>
					<Button
						onClick={handleSaveAll}
						disabled={locked || dirtyKeys.length === 0}
					>
						<SaveIcon className="mr-2 h-4 w-4" />
						{savingAll
							? "Зберігаємо…"
							: `Зберегти всі зміни (${dirtyKeys.length})`}
					</Button>
				</div>
			</div>

			<div className="bg-background flex flex-col gap-3 rounded-xl border p-3">
				<div className="flex flex-wrap items-center gap-2">
					{TYPE_FILTERS.map((filter) => (
						<Button
							key={filter}
							size="sm"
							variant={typeFilter === filter ? "default" : "outline"}
							onClick={() => setTypeFilter(filter)}
						>
							{filter === "all" ? "Усі" : TYPE_LABELS[filter]}
						</Button>
					))}
					<label className="ml-auto flex items-center gap-2 text-sm">
						<Switch
							checked={onlyIncomplete}
							onCheckedChange={(checked: boolean) => setOnlyIncomplete(checked)}
						/>
						Лише незаповнені
					</label>
					<label className="flex items-center gap-2 text-sm">
						<Switch
							checked={onlyChanged}
							onCheckedChange={(checked: boolean) => setOnlyChanged(checked)}
						/>
						Лише незбережені
					</label>
				</div>

				<div className="flex flex-wrap items-center gap-3 border-t pt-3">
					<label className="flex items-center gap-2 text-sm">
						<input
							type="checkbox"
							className="accent-primary h-4 w-4"
							checked={allVisibleSelected}
							disabled={locked || visible.length === 0}
							onChange={(event) =>
								setSelected((current) => {
									const next = new Set(current);
									for (const entry of visible) {
										if (event.target.checked) {
											next.add(entry.key);
										} else {
											next.delete(entry.key);
										}
									}
									return next;
								})
							}
						/>
						Вибрати всі показані
					</label>
					<label className="flex items-center gap-2 text-sm">
						<Switch
							checked={overwrite}
							onCheckedChange={(checked: boolean) => setOverwrite(checked)}
							disabled={locked}
						/>
						Перезаписувати заповнені поля
					</label>
					<div className="ml-auto flex items-center gap-2">
						{running ? (
							<Button
								variant="outline"
								onClick={() => {
									cancelled.current = true;
								}}
							>
								<SquareIcon className="mr-2 h-4 w-4" />
								Зупинити
							</Button>
						) : (
							<Button
								onClick={handleBulkGenerate}
								disabled={locked || selected.size === 0}
							>
								<SparklesIcon className="mr-2 h-4 w-4" />
								Згенерувати для вибраних ({selected.size})
							</Button>
						)}
					</div>
				</div>

				{progress && (
					<div className="flex flex-col gap-1" aria-live="polite">
						<div className="bg-muted h-2 overflow-hidden rounded-full">
							<div
								className="bg-primary h-full transition-all"
								style={{
									width: `${(progress.done / Math.max(progress.total, 1)) * 100}%`,
								}}
							/>
						</div>
						<p className="text-muted-foreground text-sm">
							{progress.done} / {progress.total}
							{progress.current ? ` · ${progress.current}` : ""}
							{progress.waitingSeconds
								? ` · ліміт запитів, продовжу через ${progress.waitingSeconds} с`
								: ""}
						</p>
					</div>
				)}
			</div>

			<div className="bg-background divide-y overflow-hidden rounded-xl border">
				{visible.length === 0 && (
					<p className="text-muted-foreground p-6 text-center">
						Немає матеріалів за цими фільтрами. Змініть тип або вимкніть
						перемикачі вгорі.
					</p>
				)}
				{visible.map((entry) => (
					<SeoEntryCard
						key={entry.key}
						entry={entry}
						draft={drafts[entry.key]}
						expanded={expanded.has(entry.key)}
						selected={selected.has(entry.key)}
						busy={busy[entry.key]}
						busyFields={busyFields[entry.key] ?? EMPTY_FIELDS}
						error={errors[entry.key]}
						hint={hints[entry.key] ?? ""}
						locked={locked}
						onToggle={() =>
							setExpanded((current) =>
								toggle(current, entry.key, !current.has(entry.key)),
							)
						}
						onSelect={(on) =>
							setSelected((current) => toggle(current, entry.key, on))
						}
						onHintChange={(hint) =>
							setHints((current) => ({ ...current, [entry.key]: hint }))
						}
						onFieldChange={(field, value) =>
							setFields(entry, { [field]: value })
						}
						onFieldRevert={(field) => revertField(entry, field)}
						onGenerate={(fields) => generateEntry(entry, fields)}
						onSave={() => handleSaveOne(entry)}
						onRevertAll={() => {
							clearEntry(entry.key);
							setEntryError(entry.key);
						}}
					/>
				))}
			</div>
			<p
				className={cn("text-muted-foreground text-xs", locked && "opacity-50")}
			>
				Незбережені зміни зберігаються в цьому браузері, доки ви їх не збережете
				або не скасуєте.
			</p>
		</div>
	);
}

const EMPTY_FIELDS = new Set<SeoField>();

interface CoverageProps {
	total: number;
	complete: number;
	empty: number;
}

/** Скільки матеріалів мають повне SEO, часткове і жодного — однією смугою. */
function CoverageBar({ total, complete, empty }: CoverageProps) {
	const partial = total - complete - empty;
	const share = (count: number) => `${(count / Math.max(total, 1)) * 100}%`;
	const parts = [
		{ label: "Заповнено повністю", count: complete, color: "bg-primary" },
		{ label: "Частково", count: partial, color: "bg-primary/35" },
		{ label: "Без SEO", count: empty, color: "bg-destructive/70" },
	];

	return (
		<div className="flex max-w-xl flex-col gap-2">
			<div
				role="img"
				aria-label={`Матеріалів: ${total}. ${parts.map((part) => `${part.label}: ${part.count}`).join(". ")}`}
				className="bg-muted flex h-2 gap-px overflow-hidden rounded-full"
			>
				{parts.map(
					(part) =>
						part.count > 0 && (
							<div
								key={part.label}
								className={part.color}
								style={{ width: share(part.count) }}
							/>
						),
				)}
			</div>
			<ul
				className="text-muted-foreground flex flex-wrap gap-x-5 gap-y-1 text-sm"
				aria-hidden
			>
				<li>
					Усього{" "}
					<span className="text-foreground font-medium tabular-nums">
						{total}
					</span>
				</li>
				{parts.map((part) => (
					<li key={part.label} className="flex items-center gap-1.5">
						<span className={cn("h-2 w-2 rounded-full", part.color)} />
						{part.label}
						<span className="text-foreground font-medium tabular-nums">
							{part.count}
						</span>
					</li>
				))}
			</ul>
		</div>
	);
}

function toggle(set: Set<string>, key: string, on: boolean): Set<string> {
	const next = new Set(set);
	if (on) {
		next.add(key);
	} else {
		next.delete(key);
	}
	return next;
}

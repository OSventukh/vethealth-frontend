"use client";
import {
	ChevronDownIcon,
	ExternalLinkIcon,
	PencilIcon,
	SaveIcon,
	SparklesIcon,
	Undo2Icon,
} from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import {
	dirtyFields,
	effectiveValues,
	filledCount,
	SEO_FIELDS,
	type SeoDraft,
	type SeoEntry,
	type SeoField,
	TYPE_LABELS,
} from "../seo-fields";
import { SeoFieldEditor } from "./seo-field-editor";

export type EntryBusy = "generating" | "saving" | undefined;

interface Props {
	entry: SeoEntry;
	draft: SeoDraft | undefined;
	expanded: boolean;
	selected: boolean;
	busy: EntryBusy;
	busyFields: Set<SeoField>;
	error?: string;
	hint: string;
	/** Іде масовий прогін — ручні дії вимкнені. */
	locked: boolean;
	onToggle: () => void;
	onSelect: (selected: boolean) => void;
	onHintChange: (hint: string) => void;
	onFieldChange: (field: SeoField, value: string) => void;
	onFieldRevert: (field: SeoField) => void;
	onGenerate: (fields?: SeoField[]) => void;
	onSave: () => void;
	onRevertAll: () => void;
}

export function SeoEntryCard({
	entry,
	draft,
	expanded,
	selected,
	busy,
	busyFields,
	error,
	hint,
	locked,
	onToggle,
	onSelect,
	onHintChange,
	onFieldChange,
	onFieldRevert,
	onGenerate,
	onSave,
	onRevertAll,
}: Props) {
	const values = effectiveValues(entry, draft);
	const dirty = dirtyFields(entry, draft);
	const filled = filledCount(values);
	const disabled = locked || Boolean(busy);
	const bodyId = `seo-entry-${entry.key}`;

	return (
		<div
			className={cn(
				"bg-background rounded-xl border shadow-xs",
				dirty.length > 0 && "border-amber-400",
				error && "border-destructive",
			)}
		>
			<div className="flex items-center gap-3 p-3">
				<input
					type="checkbox"
					className="accent-primary h-4 w-4 shrink-0"
					checked={selected}
					onChange={(event) => onSelect(event.target.checked)}
					disabled={locked}
					aria-label={`Вибрати «${entry.title}»`}
				/>
				<button
					type="button"
					className="flex min-w-0 flex-1 items-center gap-2 text-left"
					onClick={onToggle}
					aria-expanded={expanded}
					aria-controls={bodyId}
				>
					<ChevronDownIcon
						className={cn(
							"h-4 w-4 shrink-0 transition-transform",
							expanded && "rotate-180",
						)}
					/>
					<Badge variant="outline" className="shrink-0">
						{TYPE_LABELS[entry.type]}
					</Badge>
					<span className="truncate font-medium">{entry.title}</span>
				</button>
				<div className="flex shrink-0 items-center gap-2">
					{busy === "generating" && (
						<span className="text-muted-foreground text-xs">Генеруємо…</span>
					)}
					{busy === "saving" && (
						<span className="text-muted-foreground text-xs">Зберігаємо…</span>
					)}
					{dirty.length > 0 && (
						<Badge className="bg-amber-500 hover:bg-amber-500">
							Не збережено: {dirty.length}
						</Badge>
					)}
					{entry.status && (
						<Badge variant="secondary" className="hidden md:inline-flex">
							{entry.status}
						</Badge>
					)}
					<Badge
						variant={
							filled === SEO_FIELDS.length
								? "success"
								: filled === 0
									? "destructive"
									: "secondary"
						}
						title="Заповнено SEO-полів"
					>
						{filled}/{SEO_FIELDS.length}
					</Badge>
					{entry.path && (
						<a
							href={entry.path}
							target="_blank"
							rel="noreferrer"
							title="Відкрити на сайті"
							className="text-muted-foreground hover:text-primary"
						>
							<ExternalLinkIcon className="h-4 w-4" />
						</a>
					)}
					<Link
						href={entry.editHref}
						title="Відкрити в редакторі"
						className="text-muted-foreground hover:text-primary"
					>
						<PencilIcon className="h-4 w-4" />
					</Link>
				</div>
			</div>

			{error && (
				<p className="text-destructive px-3 pb-2 text-sm" role="alert">
					{error}
				</p>
			)}

			{expanded && (
				<div id={bodyId} className="flex flex-col gap-4 border-t p-4">
					<div className="flex flex-col gap-2 md:flex-row md:items-center">
						<Input
							value={hint}
							onChange={(event) => onHintChange(event.target.value)}
							placeholder="Побажання для ШІ (необовʼязково): коротше, згадай кліщів…"
							maxLength={300}
							disabled={disabled}
							className="md:flex-1"
						/>
						<Button
							type="button"
							variant="outline"
							onClick={() => onGenerate()}
							disabled={disabled}
						>
							<SparklesIcon className="mr-2 h-4 w-4" />
							Згенерувати всі поля
						</Button>
					</div>

					<div className="grid gap-4 md:grid-cols-2">
						{SEO_FIELDS.map((field) => (
							<SeoFieldEditor
								key={field}
								entryKey={entry.key}
								field={field}
								value={values[field]}
								savedValue={entry.metadata[field] ?? ""}
								dirty={dirty.includes(field)}
								busy={busyFields.has(field)}
								disabled={disabled}
								onChange={(value) => onFieldChange(field, value)}
								onRegenerate={() => onGenerate([field])}
								onRevert={() => onFieldRevert(field)}
							/>
						))}
					</div>

					<div className="flex justify-end gap-2">
						<Button
							type="button"
							variant="ghost"
							onClick={onRevertAll}
							disabled={disabled || dirty.length === 0}
						>
							<Undo2Icon className="mr-2 h-4 w-4" />
							Скасувати зміни
						</Button>
						<Button
							type="button"
							onClick={onSave}
							disabled={disabled || dirty.length === 0}
						>
							<SaveIcon className="mr-2 h-4 w-4" />
							Зберегти
						</Button>
					</div>
				</div>
			)}
		</div>
	);
}

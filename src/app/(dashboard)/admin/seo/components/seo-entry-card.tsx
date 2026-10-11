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
	FIELD_CONFIG,
	effectiveValues,
	filledCount,
	SEO_FIELDS,
	DEFAULT_SEO_FIELDS,
	type SeoDraft,
	type SeoEntry,
	type SeoField,
	TYPE_LABELS,
} from "../seo-fields";
import { SeoFieldEditor } from "./seo-field-editor";
import { SeoPreview } from "./seo-preview";

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
	primaryKeyword: string;
	warnings?: string[];
	onPrimaryKeywordChange: (value: string) => void;
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
	primaryKeyword,
	warnings,
	onPrimaryKeywordChange,
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
	// Поки перегенерується хоч одне поле, дії над усією карткою чекають:
	// інакше пізня відповідь ШІ ляже поверх щойно збереженого чи згенерованого.
	const entryDisabled = disabled || busyFields.size > 0;
	const bodyId = `seo-entry-${entry.key}`;

	return (
		<div
			className={cn(
				"border-l-2 border-l-transparent",
				dirty.length > 0 && "border-l-amber-500",
				error && "border-l-destructive",
				expanded && "bg-muted/40",
			)}
		>
			<div className="flex items-center gap-3 px-3 py-2.5">
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
					className="focus-visible:ring-ring flex min-w-0 flex-1 items-center gap-2 rounded-sm text-left focus-visible:ring-2 focus-visible:outline-hidden"
					onClick={onToggle}
					aria-expanded={expanded}
					aria-controls={bodyId}
				>
					<ChevronDownIcon
						className={cn(
							"text-muted-foreground h-4 w-4 shrink-0 transition-transform",
							expanded && "rotate-180",
						)}
					/>
					<span className="text-muted-foreground hidden w-16 shrink-0 text-xs sm:inline">
						{TYPE_LABELS[entry.type]}
					</span>
					<span className="truncate font-medium">{entry.title}</span>
				</button>
				<div className="flex shrink-0 items-center gap-2 sm:gap-3">
					{busy === "generating" && (
						<span className="text-muted-foreground text-xs">Генеруємо…</span>
					)}
					{busy === "saving" && (
						<span className="text-muted-foreground text-xs">Зберігаємо…</span>
					)}
					{dirty.length > 0 && (
						<span className="hidden text-xs font-medium text-amber-700 sm:inline">
							Не збережено: {dirty.length}
						</span>
					)}
					{entry.status && (
						<Badge variant="secondary" className="hidden md:inline-flex">
							{entry.status}
						</Badge>
					)}
					<FieldPips values={values} dirty={dirty} filled={filled} />
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
				<p className="text-destructive px-10 pb-2 text-sm" role="alert">
					{error}
				</p>
			)}

			{warnings && warnings.length > 0 && (
				<p role="status" className="px-10 pb-2 text-sm text-amber-700">
					Перевірте перед збереженням: {warnings.join(" ")}
				</p>
			)}
			{expanded && (
				<div
					id={bodyId}
					className="grid gap-6 px-4 pt-2 pb-5 md:pl-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,22rem)]"
				>
					<div className="flex min-w-0 flex-col gap-4">
						<Input
							aria-label={`Головний пошуковий запит для «${entry.title}»`}
							placeholder="Головний пошуковий запит (необовʼязково)"
							value={primaryKeyword}
							onChange={(event) => onPrimaryKeywordChange(event.target.value)}
							maxLength={150}
							disabled={disabled}
						/>
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
								disabled={entryDisabled}
							>
								<SparklesIcon className="mr-2 h-4 w-4" />
								Згенерувати основні поля
							</Button>
						</div>

						<div className="flex flex-col gap-4">
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
								disabled={entryDisabled || dirty.length === 0}
							>
								<Undo2Icon className="mr-2 h-4 w-4" />
								Скасувати зміни
							</Button>
							<Button
								type="button"
								onClick={onSave}
								disabled={entryDisabled || dirty.length === 0}
							>
								<SaveIcon className="mr-2 h-4 w-4" />
								Зберегти
							</Button>
						</div>
					</div>
					<div className="lg:sticky lg:top-4 lg:self-start">
						<SeoPreview title={entry.title} path={entry.path} values={values} />
					</div>
				</div>
			)}
		</div>
	);
}

interface PipsProps {
	values: Record<SeoField, string>;
	dirty: SeoField[];
	filled: number;
}

/** По мітці на поле, у порядку форми: видно, якого саме поля бракує. */
function FieldPips({ values, dirty, filled }: PipsProps) {
	const missing = DEFAULT_SEO_FIELDS.filter(
		(field) => !values[field].trim(),
	).map((field) => FIELD_CONFIG[field].label);

	return (
		<span
			role="img"
			className="flex items-center gap-0.5"
			aria-label={`SEO-полів заповнено: ${filled} з ${DEFAULT_SEO_FIELDS.length}${missing.length ? `. Бракує: ${missing.join(", ")}` : ""}`}
			title={
				missing.length ? `Бракує: ${missing.join(", ")}` : "Усі поля заповнені"
			}
		>
			{DEFAULT_SEO_FIELDS.map((field) => (
				<span
					key={field}
					className={cn(
						"h-3.5 w-1.5 rounded-full",
						dirty.includes(field)
							? "bg-amber-500"
							: values[field].trim()
								? "bg-primary"
								: "bg-muted-foreground/25",
					)}
				/>
			))}
		</span>
	);
}

"use client";
import { SparklesIcon, Undo2Icon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import {
	FIELD_CONFIG,
	type LengthState,
	lengthState,
	type SeoField,
} from "../seo-fields";

const COUNTER_COLORS: Record<LengthState, string> = {
	empty: "text-muted-foreground",
	short: "text-amber-600",
	ok: "text-green-700",
	long: "text-destructive",
};

interface Props {
	entryKey: string;
	field: SeoField;
	value: string;
	savedValue: string;
	dirty: boolean;
	busy: boolean;
	disabled: boolean;
	onChange: (value: string) => void;
	onRegenerate: () => void;
	onRevert: () => void;
}

export function SeoFieldEditor({
	entryKey,
	field,
	value,
	savedValue,
	dirty,
	busy,
	disabled,
	onChange,
	onRegenerate,
	onRevert,
}: Props) {
	const config = FIELD_CONFIG[field];
	const id = `${entryKey}:${field}`;
	const state = lengthState(field, value);
	const Control = config.multiline ? Textarea : Input;

	return (
		<div className="flex flex-col gap-1.5">
			<div className="flex items-center justify-between gap-2">
				<label htmlFor={id} className="text-sm font-medium">
					{config.label}
					{dirty && (
						<span className="ml-2 text-xs font-normal text-amber-600">
							змінено
						</span>
					)}
				</label>
				<div className="flex items-center gap-1">
					<span className={cn("text-xs tabular-nums", COUNTER_COLORS[state])}>
						{value.trim().length}
						{config.max ? ` / ${config.max}` : ""}
					</span>
					<Button
						type="button"
						variant="ghost"
						size="sm"
						className="h-7 px-2"
						title="Перегенерувати це поле з ШІ"
						onClick={onRegenerate}
						disabled={disabled || busy}
					>
						<SparklesIcon className={cn("h-4 w-4", busy && "animate-pulse")} />
					</Button>
					{dirty && (
						<Button
							type="button"
							variant="ghost"
							size="sm"
							className="h-7 px-2"
							title="Повернути збережене значення"
							onClick={onRevert}
							disabled={disabled || busy}
						>
							<Undo2Icon className="h-4 w-4" />
						</Button>
					)}
				</div>
			</div>
			<Control
				id={id}
				value={value}
				onChange={(event) => onChange(event.target.value)}
				disabled={disabled || busy}
				{...(config.multiline ? { rows: 3 } : {})}
			/>
			<p className="text-muted-foreground text-xs">
				{dirty ? (
					<>
						Збережено: <span className="italic">{savedValue || "—"}</span>
					</>
				) : (
					config.hint
				)}
			</p>
		</div>
	);
}

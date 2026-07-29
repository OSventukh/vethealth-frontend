"use client";
import { Save, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { cn } from "@/lib/utils";

interface Props {
	statusName?: string;
	isPending: boolean;
	lastSavedAt: string | null;
	onPublish: () => void;
	onSaveDraft: () => void;
}

const STATUS_LABELS: Record<string, { label: string; className: string }> = {
	Published: { label: "Опубліковано", className: "bg-success/15 text-success" },
	Draft: { label: "Чернетка", className: "bg-amber-100 text-amber-700" },
	OnReview: { label: "На модерації", className: "bg-blue-100 text-blue-700" },
};

export function PublishCard({
	statusName,
	isPending,
	lastSavedAt,
	onPublish,
	onSaveDraft,
}: Props) {
	const status = STATUS_LABELS[statusName || ""] || {
		label: "Нова сторінка",
		className: "bg-muted text-muted-foreground",
	};

	return (
		<div className="border-border rounded-xl border bg-white shadow-sm">
			<div className="flex items-start justify-between gap-2 p-4 pb-3">
				<div>
					<div className="text-sm font-bold">Публікація</div>
					<span
						className={cn(
							"mt-1.5 inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold",
							status.className,
						)}
					>
						<span className="h-1.5 w-1.5 rounded-full bg-current" />
						{status.label}
					</span>
				</div>
				{lastSavedAt && (
					<div className="text-muted-foreground text-right text-[11px] leading-relaxed">
						<div>Збережено</div>
						<div className="font-mono">{lastSavedAt}</div>
					</div>
				)}
			</div>
			<div className="flex flex-col gap-2 p-4 pt-0">
				<Button
					type="button"
					className="gap-2"
					disabled={isPending}
					onClick={onPublish}
				>
					{isPending ? <Spinner /> : <Send className="h-4 w-4" />}
					Опублікувати сторінку
				</Button>
				<Button
					type="button"
					variant="outline"
					className="gap-2"
					disabled={isPending}
					onClick={onSaveDraft}
				>
					<Save className="h-4 w-4" />
					Зберегти чернетку
				</Button>
			</div>
		</div>
	);
}

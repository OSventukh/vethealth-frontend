"use client";
import { GripVertical, Layers } from "lucide-react";
import type { PageBlock } from "@/lib/page-builder/types";
import { cn } from "@/lib/utils";
import { BLOCK_META, BlockTypeIcon } from "./block-registry";

interface Props {
	blocks: PageBlock[];
	selectedId: string | null;
	onSelect: (id: string) => void;
}

export function OutlinePanel({ blocks, selectedId, onSelect }: Props) {
	return (
		<aside className="border-border hidden w-56 shrink-0 self-start rounded-xl border bg-white p-3 shadow-sm xl:block">
			<div className="mb-2 flex items-center justify-between">
				<div className="flex items-center gap-1.5 text-sm font-bold">
					<Layers className="text-primary h-4 w-4" />
					Структура
				</div>
				<span className="text-muted-foreground text-xs">{blocks.length}</span>
			</div>
			<div className="flex flex-col gap-1">
				{blocks.map((block) => (
					<button
						key={block.id}
						type="button"
						onClick={() => onSelect(block.id)}
						className={cn(
							"flex w-full items-center gap-2 rounded-lg border px-2 py-1.5 text-left transition-colors",
							selectedId === block.id
								? "border-primary/30 bg-primary/10"
								: "hover:bg-muted border-transparent",
						)}
					>
						<GripVertical className="text-muted-foreground/60 h-3.5 w-3.5 shrink-0" />
						<span className="border-border text-primary flex h-6 w-6 shrink-0 items-center justify-center rounded-md border bg-white">
							<BlockTypeIcon type={block.type} className="h-3.5 w-3.5" />
						</span>
						<span
							className={cn(
								"truncate text-xs font-semibold",
								selectedId === block.id
									? "text-primary"
									: "text-muted-foreground",
							)}
						>
							{BLOCK_META[block.type].label}
						</span>
					</button>
				))}
				{!blocks.length && (
					<div className="text-muted-foreground py-3 text-center text-xs">
						Ще немає секцій
					</div>
				)}
			</div>
		</aside>
	);
}

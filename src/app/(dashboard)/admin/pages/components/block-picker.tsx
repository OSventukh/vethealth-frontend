"use client";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import type { PageBlockType } from "@/lib/page-builder/types";
import {
	BLOCK_GROUPS_ORDER,
	BLOCK_META,
	BlockTypeIcon,
} from "./block-registry";

interface Props {
	open: boolean;
	onClose: () => void;
	onPick: (type: PageBlockType) => void;
}

export function BlockPicker({ open, onClose, onPick }: Props) {
	const groups = BLOCK_GROUPS_ORDER.map((group) => ({
		group,
		types: (Object.keys(BLOCK_META) as PageBlockType[]).filter(
			(type) => BLOCK_META[type].group === group,
		),
	})).filter(({ types }) => types.length);

	return (
		<Dialog open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
			<DialogContent className="max-w-xl">
				<DialogHeader>
					<DialogTitle>Додати секцію</DialogTitle>
					<DialogDescription>
						Оберіть тип блоку для вашої сторінки
					</DialogDescription>
				</DialogHeader>
				<div className="flex flex-col gap-5">
					{groups.map(({ group, types }) => (
						<div key={group}>
							<div className="text-primary mb-2 text-[11px] font-bold tracking-[0.16em] uppercase">
								{group}
							</div>
							<div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
								{types.map((type) => (
									<button
										key={type}
										type="button"
										onClick={() => onPick(type)}
										className="border-border hover:border-primary/40 hover:bg-primary/5 flex items-center gap-2.5 rounded-xl border p-3 text-left transition-colors"
									>
										<span className="bg-primary/10 text-primary flex h-9 w-9 shrink-0 items-center justify-center rounded-lg">
											<BlockTypeIcon type={type} className="h-4 w-4" />
										</span>
										<span className="text-xs leading-tight font-semibold">
											{BLOCK_META[type].label}
										</span>
									</button>
								))}
							</div>
						</div>
					))}
				</div>
			</DialogContent>
		</Dialog>
	);
}

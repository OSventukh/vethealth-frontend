"use client";
import { ArrowDown, ArrowUp, Plus, Trash2 } from "lucide-react";
import type { ReactNode } from "react";
import { Button } from "@/components/ui/button";

interface Props<T> {
	items: T[];
	onChange: (items: T[]) => void;
	renderItem: (item: T, update: (patch: Partial<T>) => void) => ReactNode;
	createItem: () => T;
	addLabel: string;
}

export function ListEditor<T>({
	items,
	onChange,
	renderItem,
	createItem,
	addLabel,
}: Props<T>) {
	const move = (index: number, dir: -1 | 1) => {
		const next = index + dir;
		if (next < 0 || next >= items.length) return;
		const copy = [...items];
		[copy[index], copy[next]] = [copy[next], copy[index]];
		onChange(copy);
	};

	return (
		<div className="flex flex-col gap-2">
			{items.map((item, index) => (
				<div
					key={index}
					className="border-border flex flex-col gap-2 rounded-lg border p-2"
				>
					{renderItem(item, (patch) =>
						onChange(
							items.map((current, i) =>
								i === index ? { ...current, ...patch } : current,
							),
						),
					)}
					<div className="flex justify-end gap-1">
						<Button
							type="button"
							variant="ghost"
							size="icon"
							className="h-7 w-7"
							disabled={index === 0}
							onClick={() => move(index, -1)}
						>
							<ArrowUp className="h-3.5 w-3.5" />
						</Button>
						<Button
							type="button"
							variant="ghost"
							size="icon"
							className="h-7 w-7"
							disabled={index === items.length - 1}
							onClick={() => move(index, 1)}
						>
							<ArrowDown className="h-3.5 w-3.5" />
						</Button>
						<Button
							type="button"
							variant="ghost"
							size="icon"
							className="text-destructive h-7 w-7"
							onClick={() => onChange(items.filter((_, i) => i !== index))}
						>
							<Trash2 className="h-3.5 w-3.5" />
						</Button>
					</div>
				</div>
			))}
			<Button
				type="button"
				variant="outline"
				size="sm"
				className="gap-2 border-dashed"
				onClick={() => onChange([...items, createItem()])}
			>
				<Plus className="h-4 w-4" />
				{addLabel}
			</Button>
		</div>
	);
}

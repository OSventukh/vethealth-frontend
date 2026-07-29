"use client";
import type { ReactNode } from "react";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

export function Field({
	label,
	children,
}: {
	label: string;
	children: ReactNode;
}) {
	return (
		<div className="flex flex-col gap-1.5">
			<Label className="text-muted-foreground text-xs font-semibold">
				{label}
			</Label>
			{children}
		</div>
	);
}

interface SegmentedOption<T extends string> {
	value: T;
	label: ReactNode;
	title?: string;
}

export function Segmented<T extends string>({
	value,
	onChange,
	options,
	className,
}: {
	value: T;
	onChange: (value: T) => void;
	options: SegmentedOption<T>[];
	className?: string;
}) {
	return (
		<div
			className={cn(
				"bg-muted inline-flex items-center rounded-lg p-1",
				className,
			)}
		>
			{options.map((option) => (
				<button
					key={option.value}
					type="button"
					title={option.title}
					onClick={() => onChange(option.value)}
					className={cn(
						"inline-flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-semibold transition-colors",
						value === option.value
							? "text-primary bg-white shadow-sm"
							: "text-muted-foreground hover:text-foreground",
					)}
				>
					{option.label}
				</button>
			))}
		</div>
	);
}

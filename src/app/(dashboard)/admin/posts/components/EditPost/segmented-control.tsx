import { cn } from "@/lib/utils";

type Props<T extends string> = {
	value: T;
	onChange: (value: T) => void;
	options: { value: T; label: string }[];
	className?: string;
};

export function SegmentedControl<T extends string>({
	value,
	onChange,
	options,
	className,
}: Props<T>) {
	return (
		<div className={cn("bg-primary/10 inline-flex rounded-lg p-1", className)}>
			{options.map((option) => (
				<button
					key={option.value}
					type="button"
					onClick={() => onChange(option.value)}
					className={cn(
						"rounded-md px-3 py-1 text-xs font-semibold transition-colors",
						value === option.value
							? "bg-background text-primary shadow-sm"
							: "text-muted-foreground hover:text-foreground",
					)}
				>
					{option.label}
				</button>
			))}
		</div>
	);
}

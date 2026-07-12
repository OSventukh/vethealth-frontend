import { cn } from "@/lib/utils";

type Props = {
	value: number;
	ideal: [number, number];
	max?: number;
};

const toneStyles = {
	muted: { text: "text-muted-foreground", bar: "bg-muted-foreground" },
	amber: { text: "text-amber-600", bar: "bg-amber-500" },
	green: { text: "text-green-600", bar: "bg-green-500" },
	red: { text: "text-red-600", bar: "bg-red-500" },
};

export function FieldCounter({ value, ideal, max }: Props) {
	const tone =
		value === 0
			? "muted"
			: value < ideal[0]
				? "amber"
				: value <= ideal[1]
					? "green"
					: "red";
	const limit = max ?? Math.round(ideal[1] * 1.2);
	const percent = Math.min(100, (value / limit) * 100);
	const styles = toneStyles[tone];

	return (
		<div
			className={cn(
				"flex items-center gap-2 text-[11px] font-semibold",
				styles.text,
			)}
		>
			<span className="font-mono">
				{value}
				{max ? `/${max}` : ""}
			</span>
			<span
				aria-hidden
				className="bg-border h-1 w-14 overflow-hidden rounded-full"
			>
				<span
					className={cn("block h-full transition-all", styles.bar)}
					style={{ width: `${percent}%` }}
				/>
			</span>
		</div>
	);
}

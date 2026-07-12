import { cn } from "@/lib/utils";

type Props = {
	value: number;
};

const RADIUS = 52;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

export function ScoreRing({ value }: Props) {
	const offset = CIRCUMFERENCE - (value / 100) * CIRCUMFERENCE;
	const tone =
		value >= 80
			? "text-green-500"
			: value >= 50
				? "text-amber-500"
				: "text-red-500";

	return (
		<div className="relative h-32 w-32">
			<svg viewBox="0 0 120 120" className="h-full w-full">
				<circle
					cx="60"
					cy="60"
					r={RADIUS}
					fill="none"
					strokeWidth="10"
					className="stroke-border"
				/>
				<circle
					cx="60"
					cy="60"
					r={RADIUS}
					fill="none"
					strokeWidth="10"
					strokeLinecap="round"
					strokeDasharray={CIRCUMFERENCE}
					strokeDashoffset={offset}
					transform="rotate(-90 60 60)"
					className={cn("stroke-current transition-all duration-500", tone)}
				/>
			</svg>
			<div className="absolute inset-0 flex flex-col items-center justify-center">
				<span className="text-3xl font-bold">{value}</span>
				<span className="text-muted-foreground text-[10px] font-semibold tracking-wider uppercase">
					зі 100
				</span>
			</div>
		</div>
	);
}

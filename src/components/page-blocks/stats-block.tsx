import { raleway } from "@/lib/fonts";
import type { StatsBlockData } from "@/lib/page-builder/types";

export function StatsBlock({ data }: { data: StatsBlockData }) {
	if (!data.items.length) return null;
	return (
		<section className="grid grid-cols-2 gap-6 py-10 md:grid-cols-4">
			{data.items.map((item, i) => (
				<div key={`${item.value}-${i}`} className="text-center">
					<div
						className={`${raleway.className} text-primary text-3xl font-bold md:text-4xl`}
					>
						{item.value}
					</div>
					<div className="text-muted-foreground mt-2 text-sm">{item.label}</div>
				</div>
			))}
		</section>
	);
}

import { PawPrint } from "lucide-react";
import { raleway } from "@/lib/fonts";
import type { ServicesBlockData } from "@/lib/page-builder/types";

const COLS_CLASS: Record<number, string> = {
	2: "sm:grid-cols-2",
	3: "sm:grid-cols-2 lg:grid-cols-3",
	4: "sm:grid-cols-2 lg:grid-cols-4",
};

export function ServicesBlock({ data }: { data: ServicesBlockData }) {
	if (!data.items.length) return null;
	return (
		<section className="py-10">
			{data.title && (
				<h2
					className={`${raleway.className} mb-8 text-center text-2xl font-bold md:text-3xl`}
				>
					{data.title}
				</h2>
			)}
			<div
				className={`grid grid-cols-1 gap-4 ${COLS_CLASS[data.cols] || COLS_CLASS[3]}`}
			>
				{data.items.map((item, i) => (
					<div
						key={`${item.title}-${i}`}
						className="border-border rounded-xl border bg-white p-6 shadow-sm"
					>
						<div className="bg-primary/10 text-primary mb-4 flex h-11 w-11 items-center justify-center rounded-xl">
							<PawPrint className="h-5 w-5" />
						</div>
						<div className="text-lg font-bold">{item.title}</div>
						{item.description && (
							<p className="text-muted-foreground mt-2 text-sm leading-relaxed">
								{item.description}
							</p>
						)}
					</div>
				))}
			</div>
		</section>
	);
}

import { raleway } from "@/lib/fonts";
import type { HeadingBlockData } from "@/lib/page-builder/types";

export function HeadingBlock({ data }: { data: HeadingBlockData }) {
	return (
		<h2
			className={`${raleway.className} py-6 text-center text-2xl font-bold md:text-3xl`}
		>
			{data.text}
		</h2>
	);
}

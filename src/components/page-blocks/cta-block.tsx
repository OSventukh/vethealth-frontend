import { raleway } from "@/lib/fonts";
import type { CtaBlockData } from "@/lib/page-builder/types";
import { BlockLink } from "./block-link";

export function CtaBlock({ data }: { data: CtaBlockData }) {
	return (
		<section className="my-8 rounded-2xl bg-gradient-to-br from-teal-700 to-teal-500 px-6 py-10 text-center text-white md:px-10">
			<h2 className={`${raleway.className} text-2xl font-bold md:text-3xl`}>
				{data.title}
			</h2>
			{data.text && (
				<p className="mx-auto mt-3 max-w-lg text-base opacity-90">
					{data.text}
				</p>
			)}
			{data.btnLabel && (
				<BlockLink
					href={data.btnHref}
					className="mt-6 inline-flex rounded-xl bg-white px-6 py-3 text-base font-bold text-teal-700 hover:opacity-90"
				>
					{data.btnLabel}
				</BlockLink>
			)}
		</section>
	);
}

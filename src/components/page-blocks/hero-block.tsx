import Image from "next/image";
import { raleway } from "@/lib/fonts";
import type { HeroBlockData } from "@/lib/page-builder/types";
import { BlockLink } from "./block-link";

export function HeroBlock({ data }: { data: HeroBlockData }) {
	const hasImage = Boolean(data.imageUrl);
	return (
		<section className="grid items-center gap-8 py-10 md:grid-cols-2 md:py-14">
			<div>
				{data.eyebrow && (
					<div className="text-primary text-xs font-bold tracking-[0.16em] uppercase">
						{data.eyebrow}
					</div>
				)}
				<h1
					className={`${raleway.className} mt-3 text-3xl font-bold md:text-4xl`}
				>
					{data.title}
				</h1>
				{data.text && (
					<p className="text-muted-foreground mt-4 max-w-md text-lg leading-relaxed">
						{data.text}
					</p>
				)}
				{data.ctaLabel && (
					<BlockLink
						href={data.ctaHref}
						className="bg-primary text-primary-foreground mt-6 inline-flex rounded-xl px-6 py-3 text-base font-bold shadow-lg hover:opacity-90"
					>
						{data.ctaLabel}
					</BlockLink>
				)}
			</div>
			{hasImage && (
				<Image
					src={data.imageUrl}
					alt={data.imageAlt || data.title}
					width={800}
					height={600}
					sizes="(max-width: 768px) 100vw, 560px"
					className="h-auto w-full rounded-xl object-cover"
					priority
				/>
			)}
		</section>
	);
}

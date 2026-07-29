import Image from "next/image";
import type { GalleryBlockData } from "@/lib/page-builder/types";

export function GalleryBlock({ data }: { data: GalleryBlockData }) {
	if (!data.images.length) return null;
	return (
		<section className="grid grid-cols-2 gap-4 py-10 md:grid-cols-3">
			{data.images.map((image, i) => (
				<Image
					key={`${image.url}-${i}`}
					src={image.url}
					alt={image.alt || ""}
					width={600}
					height={450}
					sizes="(max-width: 768px) 50vw, 380px"
					className="aspect-[4/3] h-auto w-full rounded-xl object-cover"
				/>
			))}
		</section>
	);
}

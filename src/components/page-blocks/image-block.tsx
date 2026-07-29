import Image from "next/image";
import type { ImageBlockData } from "@/lib/page-builder/types";

export function ImageBlock({ data }: { data: ImageBlockData }) {
	if (!data.url) return null;
	return (
		<figure className="py-6">
			<Image
				src={data.url}
				alt={data.alt || ""}
				width={1200}
				height={675}
				sizes="(max-width: 768px) 100vw, 1140px"
				className="h-auto w-full rounded-xl object-cover"
			/>
			{data.caption && (
				<figcaption className="text-muted-foreground mt-2 text-center text-sm">
					{data.caption}
				</figcaption>
			)}
		</figure>
	);
}

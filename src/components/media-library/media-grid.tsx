"use client";
import { Check, ImageOff, TriangleAlert } from "lucide-react";
import type { MediaItem } from "@/api/types/media.type";
import { cn } from "@/lib/utils";

interface MediaGridProps {
	items: MediaItem[];
	selectedId?: string | null;
	/** Режим вибору кількох: показує чекбокси, `onSelect` перемикає вибір. */
	checkedIds?: ReadonlySet<string>;
	onSelect: (item: MediaItem) => void;
	className?: string;
}

export function MediaGrid({
	items,
	selectedId,
	checkedIds,
	onSelect,
	className,
}: MediaGridProps) {
	return (
		<ul
			className={cn(
				"grid grid-cols-[repeat(auto-fill,minmax(7.5rem,1fr))] gap-3",
				className,
			)}
		>
			{items.map((item) => {
				const checked = checkedIds?.has(item.id) ?? false;
				const selected = item.id === selectedId || checked;
				const name = item.originalName || fileNameOf(item.path);
				const dimensions = formatDimensions(item);
				return (
					<li key={item.id}>
						<button
							type="button"
							onClick={() => onSelect(item)}
							aria-pressed={selected}
							title={[item.alt || name, dimensions].filter(Boolean).join(" · ")}
							className={cn(
								"group bg-muted/40 relative block aspect-square w-full overflow-hidden rounded-lg border text-left transition",
								"hover:border-primary focus-visible:ring-ring focus-visible:ring-2 focus-visible:outline-hidden",
								selected && "border-primary ring-primary ring-2",
							)}
						>
							<MediaThumb item={item} />
							{checkedIds && (
								<span
									className={cn(
										"absolute top-1.5 right-1.5 flex h-5 w-5 items-center justify-center rounded border-2 border-white shadow",
										checked
											? "bg-primary text-primary-foreground"
											: "bg-black/30",
									)}
								>
									{checked && <Check size={13} strokeWidth={3} />}
								</span>
							)}
							{!item.alt && (
								<span
									className="absolute top-1.5 left-1.5 flex items-center gap-1 rounded bg-amber-100/95 px-1.5 py-0.5 text-[10px] font-semibold text-amber-900"
									title="Немає alt-тексту"
								>
									<TriangleAlert size={11} /> alt
								</span>
							)}
							<span className="absolute inset-x-0 bottom-0 truncate bg-black/55 px-2 py-1 text-[11px] text-white">
								{name}
							</span>
						</button>
					</li>
				);
			})}
		</ul>
	);
}

export function MediaThumb({
	item,
	className,
}: {
	item: Pick<MediaItem, "path" | "alt" | "mimeType">;
	className?: string;
}) {
	if (!item.path) {
		return (
			<span className="text-muted-foreground flex h-full w-full items-center justify-center">
				<ImageOff size={20} />
			</span>
		);
	}
	const isVector =
		item.mimeType === "image/svg+xml" || /\.svg$/i.test(item.path);
	// Не next/image: він пускає лише vethealth-хости, а в dev/R2 файли живуть
	// на інших доменах.
	return (
		// eslint-disable-next-line @next/next/no-img-element
		<img
			src={item.path}
			alt={item.alt || ""}
			loading="lazy"
			referrerPolicy={ADMIN_IMAGE_REFERRER_POLICY}
			className={cn(
				"h-full w-full",
				isVector ? "object-contain p-2" : "object-cover",
				className,
			)}
		/>
	);
}

/**
 * Hotlink Protection у Cloudflare на CDN віддає 403 на jpg/jpeg/png (svg/avif не
 * чіпає), якщо Referer — не наш домен: з адмінки на localhost чи staging превʼю
 * були б порожні. Запит без Referer вона пропускає.
 */
export const ADMIN_IMAGE_REFERRER_POLICY = "no-referrer";

export function fileNameOf(path: string): string {
	const name = path.split("/").pop() || path;
	try {
		return decodeURIComponent(name);
	} catch {
		return name;
	}
}

export function formatDimensions(
	item: Pick<MediaItem, "width" | "height">,
): string | null {
	return item.width && item.height ? `${item.width}×${item.height}` : null;
}

export function formatBytes(size: number | null): string | null {
	if (size === null || size === undefined) return null;
	if (size < 1024) return `${size} Б`;
	if (size < 1024 * 1024) return `${(size / 1024).toFixed(0)} КБ`;
	return `${(size / 1024 / 1024).toFixed(1)} МБ`;
}

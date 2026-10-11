import { ImageIcon } from "lucide-react";
import { SITE_HOST, SITE_NAME, SITE_TITLE } from "@/utils/constants/generals";
import type { SeoField } from "../seo-fields";

// Приблизні межі, після яких Google і соцмережі обрізають текст. Реальна
// межа — у пікселях, тож це орієнтир, а не гарантія.
const SERP_TITLE_LIMIT = 60;
const SERP_DESCRIPTION_LIMIT = 160;
const OG_DESCRIPTION_LIMIT = 110;

interface Props {
	title: string;
	path: string | null;
	values: Record<SeoField, string>;
}

/**
 * Як матеріал побачать у пошуку й соцмережах. Підстановки — ті самі, що
 * `buildContentMetadata` у (public)/_lib/seo.ts: порожній meta title стає
 * «Заголовок | SITE_TITLE», порожні OG-поля беруть значення з meta.
 */
export function SeoPreview({ title, path, values }: Props) {
	const metaTitle = values.metaTitle.trim() || `${title} | ${SITE_TITLE}`;
	const metaDescription = values.metaDescription.trim();
	const ogTitle = values.ogTitle.trim() || metaTitle;
	const ogDescription = values.ogDescription.trim() || metaDescription;
	const crumbs = (path ?? "").split("/").filter(Boolean);

	return (
		<div className="flex flex-col gap-5">
			<section
				aria-label="Вигляд у пошуку Google"
				className="flex flex-col gap-2"
			>
				<h3 className="text-muted-foreground text-xs font-medium">
					У пошуку Google
				</h3>
				<div className="rounded-lg bg-white p-4 font-[Arial,sans-serif] shadow-[0_0_0_1px_hsl(0_0%_0%/0.08)]">
					<div className="flex items-center gap-2.5">
						<span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-[#dadce0] bg-white">
							{/* oxlint-disable-next-line nextjs/no-img-element -- статичний 32px фавікон */}
							<img
								src="/favicon/favicon-32x32.png"
								alt=""
								className="h-[18px] w-[18px]"
							/>
						</span>
						<div className="min-w-0 leading-tight">
							<p className="truncate text-sm text-[#202124]">{SITE_NAME}</p>
							<p className="truncate text-xs text-[#4d5156]">
								https://{SITE_HOST}
								{crumbs.map((crumb) => ` › ${crumb}`)}
							</p>
						</div>
					</div>
					<p className="mt-2 text-xl leading-snug text-[#1a0dab]">
						{clip(metaTitle, SERP_TITLE_LIMIT)}
					</p>
					<p className="mt-1 text-sm leading-normal text-[#4d5156]">
						{metaDescription ? (
							clip(metaDescription, SERP_DESCRIPTION_LIMIT)
						) : (
							<span className="italic">
								Опису немає — Google підбере уривок зі сторінки сам
							</span>
						)}
					</p>
				</div>
				{!path && (
					<p className="text-muted-foreground text-xs">
						Цей матеріал не має публічної сторінки, адреса умовна.
					</p>
				)}
			</section>

			<section aria-label="Вигляд у соцмережах" className="flex flex-col gap-2">
				<h3 className="text-muted-foreground text-xs font-medium">
					У соцмережах і месенджерах
				</h3>
				<div className="overflow-hidden rounded-lg border bg-white">
					<div className="flex h-28 items-center justify-center bg-[#e9eef0] text-[#8a9aa0]">
						<ImageIcon className="h-8 w-8" aria-hidden />
						<span className="sr-only">Зображення матеріалу</span>
					</div>
					<div className="flex flex-col gap-0.5 border-t bg-[#f2f3f5] px-3 py-2.5 font-[Arial,sans-serif]">
						<p className="text-xs text-[#65676b] uppercase">{SITE_HOST}</p>
						<p className="line-clamp-2 font-semibold leading-snug text-[#050505]">
							{ogTitle}
						</p>
						{ogDescription && (
							<p className="line-clamp-1 text-sm text-[#65676b]">
								{clip(ogDescription, OG_DESCRIPTION_LIMIT)}
							</p>
						)}
					</div>
				</div>
				{!values.ogTitle.trim() && (
					<p className="text-muted-foreground text-xs">
						OG title порожній, тому соцмережі покажуть meta title.
					</p>
				)}
			</section>
		</div>
	);
}

function clip(text: string, limit: number): string {
	return text.length > limit ? `${text.slice(0, limit - 1).trimEnd()}…` : text;
}

export interface SeoScoreInput {
	title: string;
	slug: string;
	words: number;
	metadata: {
		metaTitle?: string;
		metaDescription?: string;
		metaKeywords?: string;
		ogTitle?: string;
		ogDescription?: string;
		ogImage?: string;
		canonicalUrl?: string;
		indexable?: boolean;
	};
}

/**
 * Евристика SEO-готовності, 0–100. Часткові бали за наявність поля
 * поза ідеальним діапазоном. Сума максимумів = 100.
 */
export function computeSeoScore({
	title,
	slug,
	words,
	metadata,
}: SeoScoreInput): number {
	let score = 0;

	const titleLen = title.trim().length;
	if (titleLen >= 40 && titleLen <= 65) score += 15;
	else if (titleLen > 0) score += 7;

	const metaTitleLen = metadata.metaTitle?.trim().length ?? 0;
	if (metaTitleLen >= 40 && metaTitleLen <= 60) score += 15;
	else if (metaTitleLen > 0) score += 7;

	const metaDescLen = metadata.metaDescription?.trim().length ?? 0;
	if (metaDescLen >= 120 && metaDescLen <= 160) score += 15;
	else if (metaDescLen > 0) score += 7;

	const cleanSlug = slug.trim();
	if (cleanSlug && /^[a-z0-9-]+$/.test(cleanSlug) && cleanSlug.length <= 60)
		score += 10;
	else if (cleanSlug) score += 5;

	const keywords =
		metadata.metaKeywords
			?.split(",")
			.map((keyword) => keyword.trim())
			.filter(Boolean) ?? [];
	if (keywords.length >= 3) score += 10;
	else if (keywords.length > 0) score += 5;

	if (metadata.ogImage?.trim()) score += 6;
	if (metadata.ogTitle?.trim() || metadata.ogDescription?.trim()) score += 4;

	if (metadata.canonicalUrl?.trim()) score += 5;
	if (metadata.indexable) score += 5;

	if (words >= 300) score += 15;
	else if (words >= 100) score += 7;

	return Math.min(100, score);
}

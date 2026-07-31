import type { Metadata } from "next";
import type { PostMetadataResponse } from "@/api/types/posts.type";
import { SITE_NAME, SITE_TITLE } from "@/utils/constants/generals";

export const SOCIAL_FALLBACK_IMAGE = "/social/social.jpg";

const DESCRIPTION_LIMIT = 160;

type ContentMeta = Partial<PostMetadataResponse> | null | undefined;

type BuildMetadataParams = {
	title: string;
	description?: string | null;
	image?: string | null;
	canonicalPath: string;
	meta?: ContentMeta;
	article?: {
		publishedTime?: string;
		modifiedTime?: string;
	};
};

/**
 * Збирає Metadata зі спільним пріоритетом: SEO-поля з адмінки
 * (metadata-сутність бекенду) перекривають значення з контенту.
 * openGraph завжди містить images: Next не мержить og з батьківським
 * layout, тож без явного fallback сторінка втратила б og:image.
 */
export function buildContentMetadata({
	title,
	description,
	image,
	canonicalPath,
	meta,
	article,
}: BuildMetadataParams): Metadata {
	const resolvedTitle = meta?.metaTitle || `${title} | ${SITE_TITLE}`;
	const resolvedDescription = meta?.metaDescription || description || undefined;
	const ogImage = meta?.ogImage || image || SOCIAL_FALLBACK_IMAGE;

	const openGraph: Metadata["openGraph"] = {
		title: meta?.ogTitle || resolvedTitle,
		description: meta?.ogDescription || resolvedDescription,
		siteName: SITE_NAME,
		locale: "uk_UA",
		url: meta?.canonicalUrl || canonicalPath,
		images: ogImage,
		...(article
			? {
					type: "article",
					publishedTime: article.publishedTime,
					modifiedTime: article.modifiedTime,
				}
			: { type: "website" }),
	};

	return {
		title: resolvedTitle,
		description: resolvedDescription,
		keywords: meta?.metaKeywords || undefined,
		alternates: {
			canonical: meta?.canonicalUrl || canonicalPath,
		},
		...(meta && (meta.indexable === false || meta.followable === false)
			? {
					robots: {
						index: meta.indexable !== false,
						follow: meta.followable !== false,
					},
				}
			: {}),
		openGraph,
	};
}

type LexicalNode = {
	text?: unknown;
	children?: LexicalNode[];
};

/**
 * Опис для meta description: збирає текст із перших вузлів Lexical
 * і обрізає до ~160 символів. Перший вузол може бути картинкою чи
 * заголовком, тому обхід не зупиняється на ньому.
 */
export function extractDescription(content: string): string | undefined {
	try {
		const parsed = JSON.parse(content) as { root?: LexicalNode };
		const chunks: string[] = [];
		let length = 0;

		const walk = (node: LexicalNode | undefined) => {
			if (!node || length > DESCRIPTION_LIMIT * 2) {
				return;
			}
			if (typeof node.text === "string" && node.text.trim()) {
				chunks.push(node.text.trim());
				length += node.text.length;
			}
			node.children?.forEach(walk);
		};
		walk(parsed?.root);

		const full = chunks.join(" ").replaceAll(/\s+/g, " ").trim();
		if (!full) {
			return undefined;
		}
		if (full.length <= DESCRIPTION_LIMIT) {
			return full;
		}
		return `${full.slice(0, DESCRIPTION_LIMIT - 1).trimEnd()}…`;
	} catch {
		return undefined;
	}
}

/** Файл медіатеки — рядок `files` бекенда (`GET /media`). */
export interface MediaItem {
	id: string;
	/** Публічний URL (локально — backendDomain/…, у R2 — CDN). */
	path: string;
	relativePath: string;
	alt: string | null;
	originalName: string | null;
	mimeType: string | null;
	/** Розмір у байтах. */
	size: number | null;
	/** Розміри в пікселях; null — не вдалося визначити. */
	width: number | null;
	height: number | null;
	createdAt: string;
}

export type MediaUsageType = "post" | "page" | "topic";

/** Де в матеріалі стоїть зображення (див. backend `media.types.ts`). */
export type MediaUsageField = "cover" | "image" | "content" | "social";

export interface MediaUsage {
	type: MediaUsageType;
	id: string;
	title: string;
	slug: string;
	fields: MediaUsageField[];
}

export interface MediaDetails extends MediaItem {
	usages: MediaUsage[];
}

/** Те, що пікер повертає у форму: URL, id запису і збережений alt. */
export interface PickedMedia {
	id: string;
	path: string;
	alt: string;
}

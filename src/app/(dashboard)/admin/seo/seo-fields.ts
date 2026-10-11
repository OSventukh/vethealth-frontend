// Модель екрана масового SEO. Поля, типи і рекомендовані довжини — ті самі,
// що в бекендовому `seo-metadata.task.ts` (промт просить саме ці межі).

export const SEO_FIELDS = [
	"metaTitle",
	"metaDescription",
	"metaKeywords",
	"ogTitle",
	"ogDescription",
] as const;

export type SeoField = (typeof SEO_FIELDS)[number];

export type SeoValues = Record<SeoField, string | null>;

/** Незбережені правки: лише ті поля, які редактор змінив або згенерував ШІ. */
export type SeoDraft = Partial<Record<SeoField, string>>;

export type SeoEntityType = "post" | "page" | "topic";

/** Рядок `GET /seo/entries` бекенда. */
export interface SeoEntryResponse {
	type: SeoEntityType;
	id: string;
	title: string;
	slug: string;
	status: string | null;
	topicSlugs?: string[];
	parentSlug?: string | null;
	metadata: SeoValues;
}

export interface SeoEntry {
	key: string;
	type: SeoEntityType;
	id: string;
	title: string;
	slug: string;
	status: string | null;
	/** Публічна URL (null — матеріал без сторінки на сайті). */
	path: string | null;
	editHref: string;
	metadata: SeoValues;
}

interface FieldConfig {
	label: string;
	hint: string;
	min?: number;
	max?: number;
	multiline: boolean;
}

export const FIELD_CONFIG: Record<SeoField, FieldConfig> = {
	metaTitle: {
		label: "Meta title",
		hint: "Заголовок у пошуку, 40–60 символів",
		min: 40,
		max: 60,
		multiline: false,
	},
	metaDescription: {
		label: "Meta description",
		hint: "Опис у пошуку, 120–160 символів",
		min: 120,
		max: 160,
		multiline: true,
	},
	metaKeywords: {
		label: "Ключові слова",
		hint: "4–8 фраз через кому",
		multiline: false,
	},
	ogTitle: {
		label: "OG title",
		hint: "Заголовок у соцмережах, до 60 символів",
		max: 60,
		multiline: false,
	},
	ogDescription: {
		label: "OG description",
		hint: "Опис у соцмережах, до 200 символів",
		max: 200,
		multiline: true,
	},
};

export const TYPE_LABELS: Record<SeoEntityType, string> = {
	topic: "Тема",
	post: "Стаття",
	page: "Сторінка",
};

export type LengthState = "empty" | "short" | "ok" | "long";

export function lengthState(field: SeoField, value: string): LengthState {
	const length = value.trim().length;
	const { min, max } = FIELD_CONFIG[field];
	if (!length) {
		return "empty";
	}
	if (min && length < min) {
		return "short";
	}
	if (max && length > max) {
		return "long";
	}
	return "ok";
}

/** Значення, яке зараз бачить редактор: чернетка поверх збереженого. */
export function effectiveValue(
	entry: SeoEntry,
	draft: SeoDraft | undefined,
	field: SeoField,
): string {
	return draft?.[field] ?? entry.metadata[field] ?? "";
}

export function effectiveValues(
	entry: SeoEntry,
	draft: SeoDraft | undefined,
): Record<SeoField, string> {
	return Object.fromEntries(
		SEO_FIELDS.map((field) => [field, effectiveValue(entry, draft, field)]),
	) as Record<SeoField, string>;
}

/** Поля, у яких чернетка відрізняється від збереженого. */
export function dirtyFields(
	entry: SeoEntry,
	draft: SeoDraft | undefined,
): SeoField[] {
	return SEO_FIELDS.filter(
		(field) =>
			draft?.[field] !== undefined &&
			draft[field] !== (entry.metadata[field] ?? ""),
	);
}

export function filledCount(values: Record<SeoField, string | null>): number {
	return SEO_FIELDS.filter((field) => values[field]?.trim()).length;
}

/**
 * Що генерувати при масовому прогоні: без перезапису — лише порожні поля
 * (заповнене вручну не чіпаємо), з перезаписом — усі.
 */
export function fieldsToGenerate(
	values: Record<SeoField, string>,
	overwrite: boolean,
): SeoField[] {
	return overwrite
		? [...SEO_FIELDS]
		: SEO_FIELDS.filter((field) => !values[field].trim());
}

const EDIT_ROUTES: Record<SeoEntityType, string> = {
	topic: "/admin/topics/edit",
	post: "/admin/posts/edit",
	page: "/admin/pages/edit",
};

// Окремі сторінки мають публічний роут лише ті, під які він є в (public).
const PAGE_ROUTES: Record<string, string> = {
	"privacy-policy": "/privacy-policy",
};

const MAX_TOPIC_DEPTH = 5;

/**
 * Додає до відповіді бекенда публічні URL (за тими ж правилами, що
 * sitemap: шлях теми через батьків, hub-пост зі слагом теми не дублює слаг)
 * і посилання на редактор.
 */
export function buildSeoEntries(items: SeoEntryResponse[]): SeoEntry[] {
	const parents = new Map(
		items
			.filter((item) => item.type === "topic")
			.map((topic) => [topic.slug, topic.parentSlug ?? null]),
	);

	const topicPath = (slug: string): string[] => {
		const path = [slug];
		let parent = parents.get(slug);
		for (let depth = 0; parent && depth < MAX_TOPIC_DEPTH; depth++) {
			path.unshift(parent);
			parent = parents.get(parent);
		}
		return path;
	};

	const pathOf = (item: SeoEntryResponse): string | null => {
		if (item.type === "topic") {
			return `/${topicPath(item.slug).join("/")}`;
		}
		if (item.type === "page") {
			return PAGE_ROUTES[item.slug] ?? null;
		}
		const topic = item.topicSlugs?.[0];
		if (!topic || !parents.has(topic)) {
			return null;
		}
		const path = topicPath(topic);
		return `/${(item.slug === topic ? path : [...path, item.slug]).join("/")}`;
	};

	const entries = items.map((item) => ({
		key: `${item.type}:${item.id}`,
		type: item.type,
		id: item.id,
		title: item.title,
		slug: item.slug,
		status: item.status,
		path: pathOf(item),
		editHref: `${EDIT_ROUTES[item.type]}/${item.slug}`,
		metadata: item.metadata,
	}));

	// Hub-пост займає URL однойменної теми: resolvePath віддає за нею пост,
	// тож мета теми на сайті не використовується — редагувати її тут марно.
	const postPaths = new Set(
		entries.filter((entry) => entry.type === "post").map((entry) => entry.path),
	);
	return entries.filter(
		(entry) => entry.type !== "topic" || !postPaths.has(entry.path),
	);
}

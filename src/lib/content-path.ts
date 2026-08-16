import { api } from "@/api";
import { TAGS } from "@/api/constants/tags";
import {
	type ContentFetchers,
	resolvePathWith,
} from "@/app/(public)/_lib/resolve-path";

// Перевірка «чи існує публічний URL» для проксі. Правила беремо з
// `resolvePathWith` — саме їх застосовує рендер, тож проксі не може
// розійтися зі сторінкою і 404-ити те, що вона показує.

// Перші сегменти, які не є темами: власні роути, статика з public/.
const RESERVED_SEGMENTS = new Set([
	"search",
	"privacy-policy",
	"auth",
	"admin",
	"images",
	"logo",
	"social",
	"favicon",
	"js",
	"_next",
	"_not-found",
]);

// Проксі не має ні Data Cache, ні "use cache" (обидва — частина
// рендер-пайплайна), тож без власного кешу кожен перегляд статті додавав
// би 2-4 запити в бекенд. Негативні відповіді живуть менше: щойно
// опублікований пост не має 404-итись довго.
const POSITIVE_TTL_MS = 60_000;
const NEGATIVE_TTL_MS = 15_000;
const MAX_ENTRIES = 500;

const resultCache = new Map<string, { exists: boolean; expiresAt: number }>();

const fetchers: ContentFetchers = {
	getTopicBySlug: (slug) =>
		api.topics.getOne({
			slug,
			query: { include: "parent" },
			tags: [TAGS.TOPICS],
		}),
	getPostBySlug: (slug) =>
		api.posts.getOne({
			slug,
			query: { include: "topics" },
			tags: [TAGS.POSTS],
		}),
};

/** Чи схожий шлях на публічний контент (тема або тема/…/пост). */
export function isContentPath(pathname: string): boolean {
	const segments = pathname.split("/").filter(Boolean);

	return (
		segments.length > 0 &&
		!RESERVED_SEGMENTS.has(segments[0]) &&
		// robots.txt, sitemap.xml, llms.txt, ads.txt, favicon.ico — усе з крапкою
		!segments[segments.length - 1].includes(".")
	);
}

async function lookup(segments: string[]): Promise<boolean> {
	const [topicSlug, ...rest] = segments;

	// Один сегмент — сторінка теми: `[topic]/page.tsx` вважає її валідною
	// рівно тоді, коли тема існує.
	if (rest.length === 0) {
		return Boolean(await fetchers.getTopicBySlug(topicSlug));
	}
	return (await resolvePathWith(fetchers, topicSlug, rest)) !== null;
}

/**
 * `false` — тільки коли бекенд впевнено сказав, що контенту немає.
 * Будь-яка помилка (лежить бекенд, таймаут) трактується як «існує»:
 * віддати 404 через збій означало б викосити з індексу живі сторінки.
 */
export async function contentPathExists(pathname: string): Promise<boolean> {
	const cached = resultCache.get(pathname);
	if (cached && cached.expiresAt > Date.now()) {
		return cached.exists;
	}

	let exists: boolean;
	try {
		exists = await lookup(pathname.split("/").filter(Boolean));
	} catch {
		return true;
	}

	if (resultCache.size >= MAX_ENTRIES) {
		resultCache.clear();
	}
	resultCache.set(pathname, {
		exists,
		expiresAt: Date.now() + (exists ? POSITIVE_TTL_MS : NEGATIVE_TTL_MS),
	});

	return exists;
}

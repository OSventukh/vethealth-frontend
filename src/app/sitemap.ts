import type { MetadataRoute } from "next";
import { api } from "@/api";
import { TAGS } from "@/api/constants/tags";
import type { PostResponse } from "@/api/types/posts.type";
import type { TopicResponse } from "@/api/types/topics.type";
import { SITE_HOST } from "@/utils/constants/generals";

// Сам роут рендериться на кожен запит, але всі фетчі всередині йдуть
// через Data Cache (force-cache + tags), тож sitemap дешевий і
// оновлюється одразу після revalidateTag з адмінки.
export const dynamic = "force-dynamic";

const PAGE_SIZE = 100;
const MAX_TOPIC_DEPTH = 5;

function getBaseUrl(): string {
	return (process.env.CLIENT_URL || `https://${SITE_HOST}`).replace(/\/+$/, "");
}

async function getAllPosts(): Promise<PostResponse[]> {
	const first = await api.posts.getMany({
		query: { size: PAGE_SIZE, include: "topics" },
		tags: [TAGS.POSTS],
	});
	if (!first) {
		return [];
	}
	if (first.totalPages <= 1) {
		return first.items;
	}

	const rest = await Promise.all(
		Array.from({ length: first.totalPages - 1 }, (_, i) =>
			api.posts.getMany({
				query: { page: i + 2, size: PAGE_SIZE, include: "topics" },
				tags: [TAGS.POSTS],
			}),
		),
	);
	return [...first.items, ...rest.flatMap((page) => page?.items ?? [])];
}

async function getAllTopics(): Promise<TopicResponse[]> {
	const topics = await api.topics.getMany({
		query: { size: 500, showAll: true, include: "parent" },
		tags: [TAGS.TOPICS],
	});
	return topics?.items ?? [];
}

// include=parent дає лише один рівень угору, тому повний шлях теми
// збирається по мапі всіх тем (з захистом від циклів у даних).
function topicPath(
	topic: TopicResponse,
	bySlug: Map<string, TopicResponse>,
): string[] {
	const path = [topic.slug];
	let current = topic;
	for (let depth = 0; current.parent && depth < MAX_TOPIC_DEPTH; depth++) {
		const parent = bySlug.get(current.parent.slug) ?? current.parent;
		path.unshift(parent.slug);
		current = parent;
	}
	return path;
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
	const base = getBaseUrl();
	const [posts, topics] = await Promise.all([getAllPosts(), getAllTopics()]);

	const topicBySlug = new Map(topics.map((topic) => [topic.slug, topic]));
	const entryByUrl = new Map<string, MetadataRoute.Sitemap[number]>();

	for (const topic of topics) {
		const url = `${base}/${topicPath(topic, topicBySlug).join("/")}`;
		entryByUrl.set(url, {
			url,
			changeFrequency: "weekly",
			priority: 0.8,
		});
	}

	// Пости перекривають однойменні URL тем (hub-пости) — у постів є
	// достовірний lastModified.
	for (const post of posts) {
		const postTopic = post.topics?.[0]
			? topicBySlug.get(post.topics[0].slug)
			: undefined;
		if (!postTopic) {
			continue;
		}
		// Hub-пост має той самий слаг, що і його тема — URL збігається зі
		// шляхом теми, слаг поста не дублюється в кінці.
		const path = topicPath(postTopic, topicBySlug);
		const url =
			post.slug === postTopic.slug
				? `${base}/${path.join("/")}`
				: `${base}/${[...path, post.slug].join("/")}`;
		entryByUrl.set(url, {
			url,
			lastModified: post.updatedAt || post.createdAt,
			changeFrequency: "monthly",
			priority: 0.7,
		});
	}

	return [
		{
			url: base,
			changeFrequency: "daily",
			priority: 1,
		},
		...entryByUrl.values(),
		{
			url: `${base}/privacy-policy`,
			changeFrequency: "yearly",
			priority: 0.2,
		},
	];
}

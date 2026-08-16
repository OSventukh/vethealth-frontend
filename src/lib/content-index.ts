import { api } from "@/api";
import { TAGS } from "@/api/constants/tags";
import type { PostResponse } from "@/api/types/posts.type";
import type { TopicResponse } from "@/api/types/topics.type";

// Повний перелік опублікованого контенту для sitemap.xml і llms.txt.
// Усі фетчі йдуть через Data Cache (force-cache + tags) — оновлюється
// одразу після revalidateTag з адмінки.

const PAGE_SIZE = 100;
const MAX_TOPIC_DEPTH = 5;

export async function getAllPosts(): Promise<PostResponse[]> {
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

export async function getAllTopics(): Promise<TopicResponse[]> {
	const topics = await api.topics.getMany({
		query: { size: 500, showAll: true, include: "parent" },
		tags: [TAGS.TOPICS],
	});
	return topics?.items ?? [];
}

// include=parent дає лише один рівень угору, тому повний шлях теми
// збирається по мапі всіх тем (з захистом від циклів у даних).
export function topicPath(
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

// Hub-пост має той самий слаг, що і його тема — URL збігається зі шляхом
// теми, слаг поста не дублюється в кінці. null — пост без теми (нема URL).
export function postPath(
	post: PostResponse,
	bySlug: Map<string, TopicResponse>,
): string[] | null {
	const postTopic = post.topics?.[0]
		? bySlug.get(post.topics[0].slug)
		: undefined;
	if (!postTopic) {
		return null;
	}
	const path = topicPath(postTopic, bySlug);
	return post.slug === postTopic.slug ? path : [...path, post.slug];
}

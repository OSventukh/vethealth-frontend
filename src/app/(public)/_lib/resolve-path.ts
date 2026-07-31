import { cache } from "react";
import type { PostResponse } from "@/api/types/posts.type";
import type { TopicResponse } from "@/api/types/topics.type";
import { getPostBySlug, getTopicBySlug } from "./content-cache";

export type ResolvedPath =
	| { type: "post"; post: PostResponse; topicChain: TopicResponse[] }
	| { type: "page"; topic: TopicResponse; topicChain: TopicResponse[] }
	| null;

/**
 * Кожен сегмент шляху, крім останнього, має бути темою, що ланцюжком
 * parent→child відповідає URL (перша — кореневою). Інакше той самий
 * пост відкривався б за URL будь-якої глибини й під будь-якою темою —
 * дубльований контент зі статусом 200.
 */
async function getValidatedTopicChain(
	slugs: string[],
): Promise<TopicResponse[] | null> {
	const topics = await Promise.all(slugs.map((slug) => getTopicBySlug(slug)));
	const chain: TopicResponse[] = [];

	for (const [i, topic] of topics.entries()) {
		if (!topic) {
			return null;
		}
		const parentSlug = topic.parent?.slug;
		if (i === 0 ? parentSlug : parentSlug !== slugs[i - 1]) {
			return null;
		}
		chain.push(topic);
	}
	return chain;
}

export const resolvePath = cache(
	async (topicSlug: string, slug: string[]): Promise<ResolvedPath> => {
		const pathSlugs = [topicSlug, ...slug];
		const lastSlug = pathSlugs[pathSlugs.length - 1];
		const chainSlugs = pathSlugs.slice(0, -1);

		const [post, lastTopic, topicChain] = await Promise.all([
			getPostBySlug(lastSlug),
			getTopicBySlug(lastSlug),
			getValidatedTopicChain(chainSlugs),
		]);

		if (!topicChain) {
			return null;
		}
		const parentTopic = topicChain[topicChain.length - 1];

		if (post) {
			// Старі пости можуть не мати тем — такий URL не рвемо. Якщо
			// теми є, пост мусить належати темі, під якою його відкрили.
			// Окремий випадок — hub-пост: його слаг збігається зі слагом
			// однойменної підтеми (/drugs/antiparasitic-drugs), і він може
			// бути прив'язаний до неї, а не до батьківської теми.
			const belongsToPath =
				!post.topics?.length ||
				post.topics.some((topic) => topic.slug === parentTopic.slug) ||
				(lastTopic?.parent?.slug === parentTopic.slug &&
					post.topics.some((topic) => topic.slug === lastSlug));
			if (belongsToPath) {
				return { type: "post", post, topicChain };
			}
		}

		if (
			lastTopic &&
			lastTopic.contentType === "page" &&
			lastTopic.parent?.slug === parentTopic.slug
		) {
			return { type: "page", topic: lastTopic, topicChain };
		}

		return null;
	},
);

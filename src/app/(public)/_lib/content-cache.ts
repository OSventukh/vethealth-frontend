import { cacheTag } from "next/cache";
import { api } from "@/api";
import { TAGS } from "@/api/constants/tags";

// Однаковий include у всіх викликах = один запит на рендер (кеш дедуплікує
// лише ідентичні аргументи). parent потрібен для валідації ланцюжка тем,
// metadata — для SEO-полів з адмінки.
// `cacheTag` обовʼязковий: без нього `revalidateTag` з адмінки не діставав
// би до цих записів і публікація не зʼявлялася б на сайті.
export async function getTopicBySlug(
	slug: string,
	include = "children,parent,metadata",
) {
	"use cache";
	cacheTag(TAGS.TOPICS);

	return api.topics.getOne({
		slug,
		query: { include },
		tags: [TAGS.TOPICS],
	});
}

export async function getPostBySlug(slug: string) {
	"use cache";
	cacheTag(TAGS.POSTS);

	return api.posts.getOne({
		slug,
		query: { include: "topics,metadata" },
		tags: [TAGS.POSTS],
	});
}

export async function getCategoriesByTopic(topic?: string) {
	"use cache";
	cacheTag(TAGS.CATEGORIES);

	return api.categories.getMany({
		query: { include: "children", topic },
		tags: [TAGS.CATEGORIES],
	});
}

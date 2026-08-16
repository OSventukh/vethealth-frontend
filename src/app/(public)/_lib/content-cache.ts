import { cache } from "react";
import { api } from "@/api";
import { TAGS } from "@/api/constants/tags";

// Однаковий include у всіх викликах = один запит на рендер (React.cache
// дедуплікує лише ідентичні аргументи). parent потрібен для валідації
// ланцюжка тем, metadata — для SEO-полів з адмінки.
export const getTopicBySlug = cache(
	async (slug: string, include = "children,parent,metadata") => {
		return api.topics.getOne({
			slug,
			query: { include },
			tags: [TAGS.TOPICS],
		});
	},
);

export const getPostBySlug = cache(async (slug: string) => {
	return api.posts.getOne({
		slug,
		query: { include: "topics,metadata" },
		tags: [TAGS.POSTS],
	});
});

export const getCategoriesByTopic = cache(async (topic?: string) => {
	return api.categories.getMany({
		query: { include: "children", topic },
		tags: [TAGS.CATEGORIES],
	});
});

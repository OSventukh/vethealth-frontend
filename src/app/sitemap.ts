import type { MetadataRoute } from "next";
import { getBaseUrl } from "@/app/(public)/_lib/seo";
import {
	getAllPosts,
	getAllTopics,
	postPath,
	topicPath,
} from "@/lib/content-index";

// Сам роут рендериться на кожен запит, але всі фетчі всередині йдуть
// через Data Cache (force-cache + tags), тож sitemap дешевий і
// оновлюється одразу після revalidateTag з адмінки.
export const dynamic = "force-dynamic";

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
		const path = postPath(post, topicBySlug);
		if (!path) {
			continue;
		}
		const url = `${base}/${path.join("/")}`;
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

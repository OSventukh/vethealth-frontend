import { getBaseUrl } from "@/app/(public)/_lib/seo";
import type { TopicResponse } from "@/api/types/topics.type";
import { getAllPosts, getAllTopics, postPath } from "@/lib/content-index";
import { SITE_DESCRIPTION, SITE_NAME } from "@/utils/constants/generals";

// llms.txt (llmstxt.org): markdown-огляд сайту для AI-краулерів, які не
// виконують JS і не ходять углиб — короткий зміст з прямими посиланнями.
export const dynamic = "force-dynamic";

export async function GET() {
	const base = getBaseUrl();
	const [topics, posts] = await Promise.all([getAllTopics(), getAllPosts()]);
	const topicBySlug = new Map(topics.map((topic) => [topic.slug, topic]));

	const lines: string[] = [
		`# ${SITE_NAME}`,
		"",
		`> ${SITE_DESCRIPTION}`,
		"",
		"Довідкові статті українською мовою: хвороби тварин, їх лікування,",
		"профілактика, догляд і ветеринарні препарати.",
		"",
		"## Розділи",
		"",
	];

	const rootTopics = topics.filter((topic) => !topic.parent);
	for (const topic of rootTopics) {
		const url = `${base}/${topic.slug}`;
		lines.push(
			`- [${topic.title}](${url})${topic.description ? `: ${topic.description}` : ""}`,
		);
	}

	lines.push("", "## Статті", "");

	// Групуємо за кореневою темою в порядку розділів вище
	const postsByRoot = new Map<string, string[]>();
	for (const post of posts) {
		const path = postPath(post, topicBySlug);
		if (!path) {
			continue;
		}
		const rootSlug = path[0];
		const entry = `- [${post.title}](${base}/${path.join("/")})`;
		postsByRoot.set(rootSlug, [...(postsByRoot.get(rootSlug) ?? []), entry]);
	}

	const orderedRoots: TopicResponse[] = [
		...rootTopics,
		// теми-сироти з постами, яких нема серед кореневих
		...[...postsByRoot.keys()]
			.filter((slug) => !rootTopics.some((topic) => topic.slug === slug))
			.map((slug) => topicBySlug.get(slug))
			.filter((topic): topic is TopicResponse => Boolean(topic)),
	];

	for (const root of orderedRoots) {
		const entries = postsByRoot.get(root.slug);
		if (!entries?.length) {
			continue;
		}
		lines.push(`### ${root.title}`, "", ...entries, "");
	}

	lines.push(
		"## Інше",
		"",
		`- [Політика конфіденційності](${base}/privacy-policy)`,
		`- [Sitemap](${base}/sitemap.xml)`,
		"",
	);

	return new Response(lines.join("\n"), {
		headers: {
			"Content-Type": "text/plain; charset=utf-8",
		},
	});
}

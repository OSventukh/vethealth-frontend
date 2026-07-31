import type { MetadataRoute } from "next";
import { SITE_HOST } from "@/utils/constants/generals";

// Явна група для AI-краулерів: політика сайту — контент відкритий для
// пошукових і answer-ботів (видимість у видачах LLM). Окрема група
// документує намір і переживе можливі майбутні "закриті за замовчуванням"
// зміни в поведінці ботів.
const AI_CRAWLERS = [
	"GPTBot",
	"OAI-SearchBot",
	"ChatGPT-User",
	"ClaudeBot",
	"Claude-User",
	"Claude-SearchBot",
	"PerplexityBot",
	"Perplexity-User",
	"Google-Extended",
	"Applebot-Extended",
	"CCBot",
	"meta-externalagent",
];

export default function robots(): MetadataRoute.Robots {
	const isAllowed = process.env.NODE_ENV === "production";

	if (!isAllowed) {
		return {
			rules: {
				userAgent: "*",
				disallow: ["/", "/admin"],
			},
		};
	}

	const base = (process.env.CLIENT_URL || `https://${SITE_HOST}`).replace(
		/\/+$/,
		"",
	);

	return {
		rules: [
			{
				userAgent: "*",
				allow: "/",
				disallow: ["/admin"],
			},
			{
				userAgent: AI_CRAWLERS,
				allow: "/",
				disallow: ["/admin"],
			},
		],
		sitemap: `${base}/sitemap.xml`,
	};
}

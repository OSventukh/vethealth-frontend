import type { Metadata } from "next";
import { Suspense } from "react";
import { api } from "@/api";
import { TAGS } from "@/api/constants/tags";
import { JsonLd } from "@/components/seo/json-ld";
import { SITE_DESCRIPTION, SITE_NAME } from "@/utils/constants/generals";
import { getBaseUrl } from "./_lib/seo";
import Description from "./components/Description";
import Footer from "./components/Footer";
import Header from "./components/Header";
import TopicListSkeleton from "./components/Skeletons/TopicListSkeleton";
import TopicList from "./components/topics/TopicList";

export const metadata: Metadata = {
	alternates: {
		canonical: "/",
	},
};

export default function Home() {
	// size: дефолтні 10 обрізали б навігацію, якщо кореневих тем стане більше
	const topics = api.topics.getMany({
		query: { size: 100 },
		tags: [TAGS.TOPICS],
	});
	const base = getBaseUrl();

	return (
		<>
			<JsonLd
				data={{
					"@context": "https://schema.org",
					"@type": "WebSite",
					name: SITE_NAME,
					description: SITE_DESCRIPTION,
					url: base,
					inLanguage: "uk",
					potentialAction: {
						"@type": "SearchAction",
						target: `${base}/search?query={search_term_string}`,
						"query-input": "required name=search_term_string",
					},
				}}
			/>
			<JsonLd
				data={{
					"@context": "https://schema.org",
					"@type": "Organization",
					name: SITE_NAME,
					url: base,
					logo: `${base}/favicon/android-chrome-512x512.png`,
				}}
			/>
			<Header />
			<main>
				<div className="container">
					<Description />
					<Suspense fallback={<TopicListSkeleton />}>
						<TopicList topics={topics} />
					</Suspense>
				</div>
			</main>
			<Footer />
		</>
	);
}

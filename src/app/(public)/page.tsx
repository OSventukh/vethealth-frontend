import type { Metadata } from "next";
import { Suspense } from "react";
import { api } from "@/api";
import { TAGS } from "@/api/constants/tags";
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
	const topics = api.topics.getMany({
		tags: [TAGS.TOPICS],
	});
	return (
		<>
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

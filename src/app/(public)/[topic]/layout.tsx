import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { NOT_FOUND_TITLE } from "@/utils/constants/generals";
import { getTopicBySlug } from "../_lib/content-cache";
import { buildContentMetadata } from "../_lib/seo";
import Footer from "../components/Footer";
import Header from "../components/Header";

type MetadataProps = {
	params: Promise<{
		topic: string;
	}>;
};

export async function generateMetadata(
	props: MetadataProps,
): Promise<Metadata> {
	const params = await props.params;
	const topic = await getTopicBySlug(params.topic);

	if (!topic || topic.parent) {
		return {
			title: NOT_FOUND_TITLE,
		};
	}
	return buildContentMetadata({
		title: topic.title,
		description: topic.description,
		image: topic.image?.path,
		canonicalPath: `/${topic.slug}`,
		meta: topic.metadata,
	});
}

type TopicLayoutProps = {
	children: React.ReactNode;
	params: Promise<{
		topic: string;
	}>;
};
export default async function TopicLayout(props: TopicLayoutProps) {
	const params = await props.params;

	// Валідація тут, а не в page: layout рендериться до першого flush,
	// тож notFound() дає справжній HTTP 404. notFound() зі стрімленої
	// сторінки (за Suspense-межею loading.tsx) віддає 200 — soft-404.
	// Підтеми за кореневим URL (topic.parent) — теж 404: їхній контент
	// живе за повним шляхом /батько/підтема.
	const topic = await getTopicBySlug(params.topic);
	if (!topic || topic.parent) {
		notFound();
	}

	const { children } = props;

	return (
		<>
			<Header topic={params.topic} />
			<main>
				<div className="container">{children}</div>
			</main>
			<Footer />
		</>
	);
}

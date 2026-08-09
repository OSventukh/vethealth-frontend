import type { Metadata } from "next";
import { NOT_FOUND_TITLE, SITE_TITLE } from "@/utils/constants/generals";
import { getTopicBySlug } from "../_lib/content-cache";
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

	if (typeof topic === "string") {
		return {
			title: NOT_FOUND_TITLE,
		};
	}
	return {
		title: `${topic?.title} | ${SITE_TITLE}`,
		description: topic?.description,
		openGraph: {
			images: topic?.image.path || [],
		},
	};
}

type TopicLayoutProps = {
	children: React.ReactNode;
	params: Promise<{
		topic: string;
	}>;
};
export default function TopicLayout(props: TopicLayoutProps) {
	const { children } = props;

	// Forwarded as a promise, not awaited: awaiting `params` here would make the
	// whole layout request-time and keep the site chrome out of the static shell.
	// Navigation awaits it inside its own <Suspense>.
	const topic = props.params.then((params) => params.topic);

	return (
		<>
			<Header topic={topic} />
			<main>
				<div className="container">{children}</div>
			</main>
			<Footer />
		</>
	);
}

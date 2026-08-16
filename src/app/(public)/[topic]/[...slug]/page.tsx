import React from "react";
import { notFound } from "next/navigation";
import { resolvePath } from "../../_lib/resolve-path";
import Page from "../../components/Page";
import Post from "../../components/Post";

type Props = {
	params: Promise<{
		topic: string;
		slug: string[];
	}>;
};
export default async function SlugPage(props: Props) {
	const params = await props.params;
	const resolved = await resolvePath(params.topic, params.slug ?? []);

	if (!resolved) {
		return notFound();
	}

	if (resolved.type === "page") {
		return (
			<Page
				parentTopicSlug={params.topic}
				topic={resolved.topic.slug}
				slug=""
			/>
		);
	}

	const topicSlug =
		params.slug.length > 1 ? params.slug[params.slug.length - 2] : undefined;

	return (
		<Post
			parentTopicSlug={params.topic}
			topicSlug={topicSlug}
			slug={params.slug[params.slug.length - 1]}
		/>
	);
}

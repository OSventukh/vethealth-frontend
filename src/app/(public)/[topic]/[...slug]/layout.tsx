import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { NOT_FOUND_TITLE } from "@/utils/constants/generals";
import { resolvePath } from "../../_lib/resolve-path";
import { buildContentMetadata, extractDescription } from "../../_lib/seo";

type Props = {
	params: Promise<{
		topic: string;
		slug: string[];
	}>;
};

export async function generateMetadata(props: Props): Promise<Metadata> {
	const { topic, slug } = await props.params;
	const resolved = await resolvePath(topic, slug ?? []);

	if (!resolved) {
		return {
			title: NOT_FOUND_TITLE,
		};
	}

	const canonicalPath = `/${[topic, ...slug].join("/")}`;

	if (resolved.type === "post") {
		const { post } = resolved;
		return buildContentMetadata({
			title: post.title,
			description: extractDescription(post.content),
			image: post.featuredImage,
			canonicalPath,
			meta: post.metadata,
			article: {
				publishedTime: post.createdAt,
				modifiedTime: post.updatedAt,
			},
		});
	}

	return buildContentMetadata({
		title: resolved.topic.title,
		description: resolved.topic.description,
		image: resolved.topic.image?.path,
		canonicalPath,
		meta: resolved.topic.metadata,
	});
}

export default async function SlugLayout({
	children,
	params,
}: Props & {
	children: React.ReactNode;
}) {
	const { topic, slug } = await params;

	// Валідація до першого flush (див. коментар у ../layout.tsx):
	// неіснуючий пост, чужа тема в шляху чи зайва глибина → HTTP 404.
	const resolved = await resolvePath(topic, slug ?? []);
	if (!resolved) {
		notFound();
	}

	return <>{children}</>;
}

import type { Metadata } from "next";
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

// Валідація живе в page.tsx (той самий resolvePath + notFound). Тут її
// більше немає: `await params` у layout робив увесь shell request-time, а
// обіцяного «404 до першого flush» він при cacheComponents уже не давав —
// заміряно: невідомий URL віддавав 200 і з блокуючим layout.
export default function SlugLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return <>{children}</>;
}

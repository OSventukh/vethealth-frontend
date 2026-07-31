import { notFound } from "next/navigation";
import { ParsedContent } from "@/app/(dashboard)/admin/components/Editor/ParsedContent";
import {
	getPostBySlug,
	getTopicBySlug,
} from "@/app/(public)/_lib/content-cache";
import {
	absoluteUrl,
	extractDescription,
	getBaseUrl,
} from "@/app/(public)/_lib/seo";
import { JsonLd } from "@/components/seo/json-ld";
import CustomBreadcrumb from "@/components/ui/custom/custom-breadcrumb";
import { raleway } from "@/lib/fonts";
import { SITE_NAME } from "@/utils/constants/generals";

type Props = {
	parentTopicSlug: string;
	topicSlug?: string;
	slug: string;
};

export default async function Post({
	slug,
	parentTopicSlug,
	topicSlug,
}: Props) {
	const [post, parentTopic] = await Promise.all([
		getPostBySlug(slug),
		getTopicBySlug(parentTopicSlug),
	]);

	if (!post || typeof post === "string") {
		return notFound();
	}

	const topicTitle = parentTopic?.children?.find(
		(topic) => topic.slug === topicSlug,
	)?.title;

	const canonicalPath = `/${[parentTopicSlug, topicSlug, slug]
		.filter(Boolean)
		.join("/")}`;
	const description = extractDescription(post.content);
	const articleJsonLd = {
		"@context": "https://schema.org",
		"@type": "Article",
		headline: post.title,
		...(description ? { description } : {}),
		...(post.featuredImage ? { image: absoluteUrl(post.featuredImage) } : {}),
		datePublished: post.createdAt,
		dateModified: post.updatedAt || post.createdAt,
		inLanguage: "uk",
		mainEntityOfPage: {
			"@type": "WebPage",
			"@id": absoluteUrl(canonicalPath),
		},
		author: {
			"@type": "Organization",
			name: SITE_NAME,
			url: getBaseUrl(),
		},
		publisher: {
			"@type": "Organization",
			name: SITE_NAME,
			logo: {
				"@type": "ImageObject",
				url: absoluteUrl("/favicon/android-chrome-512x512.png"),
			},
		},
	};

	return (
		<>
			<JsonLd data={articleJsonLd} />
			<CustomBreadcrumb
				prevPages={[
					{ href: "/", label: "Головна" },
					{
						href: `/${parentTopic?.slug || ""}`,
						label: parentTopic?.description || parentTopic?.title || "",
					},
					...(topicSlug
						? [
								{
									href: `/${parentTopic?.slug}/${topicSlug}`,
									label: topicTitle || "",
								},
							]
						: []),
				]}
				currentPage={{ label: post?.title || "" }}
			/>
			<div className="border-border mt-4 rounded-xl border-[1px] bg-white p-4 md:p-8">
				<h1
					className={`${raleway.className} my-4 text-center text-lg font-[600] uppercase`}
				>
					{post.title}
				</h1>
				<div className="prose prose-headings:text-lg max-w-none">
					{post?.content && (
						<ParsedContent content={JSON.parse(post.content)} />
					)}
				</div>
			</div>
		</>
	);
}

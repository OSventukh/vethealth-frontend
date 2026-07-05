import { notFound } from "next/navigation";
import { Suspense } from "react";
import type { CategoryResponse } from "@/api/types/categories.type";
import type { TopicResponse } from "@/api/types/topics.type";
import CustomBreadcrumb from "@/components/ui/custom/custom-breadcrumb";
import { getCategoriesByTopic, getTopicBySlug } from "../_lib/content-cache";
import Description from "../components/Description";
import Page from "../components/Page";
import PostList from "../components/Post/PostList";
import PostListSkeleton from "../components/Skeletons/PostListSkeleton";
import TopicListSkeleton from "../components/Skeletons/TopicListSkeleton";
import TopicChildrenList from "../components/topics/TopicChildrenList";

type SearchParams = Promise<{
	category?: string;
}>;

type Props = {
	params: Promise<{
		topic: string;
		slug?: string[];
	}>;
	searchParams: SearchParams;
};

function findCategoryBySlug(
	slug: string,
	categoriesList: CategoryResponse[],
): CategoryResponse | null {
	const foundCategory = categoriesList.find((cat) => cat.slug === slug);
	if (foundCategory) return foundCategory;

	for (const category of categoriesList) {
		if (category.children && category.children.length > 0) {
			const foundInChildren = findCategoryBySlug(slug, category.children);
			if (foundInChildren) return foundInChildren;
		}
	}

	return null;
}

function TopicBreadcrumb({ topic }: { topic: TopicResponse }) {
	return (
		<CustomBreadcrumb
			prevPages={[{ href: "/", label: "Головна" }]}
			currentPage={{ label: topic?.description || topic?.title }}
		/>
	);
}

async function CategoryBreadcrumb({
	topic,
	searchParams,
}: {
	topic: TopicResponse;
	searchParams: SearchParams;
}) {
	const { category } = await searchParams;
	if (!category) {
		return <TopicBreadcrumb topic={topic} />;
	}

	const categories = await getCategoriesByTopic(topic.slug);
	const selectedCategory = categories?.items
		? findCategoryBySlug(category, categories.items)
		: null;

	return (
		<CustomBreadcrumb
			prevPages={[
				{ href: "/", label: "Головна" },
				{
					href: `/${topic.slug}`,
					label: topic?.description || topic?.title,
				},
			]}
			currentPage={{ label: selectedCategory?.name || category }}
		/>
	);
}

async function FilteredPostList({
	topic,
	searchParams,
}: {
	topic: string;
	searchParams: SearchParams;
}) {
	const { category } = await searchParams;
	return <PostList topic={topic} category={category} />;
}

export default async function TopicPage(props: Props) {
	const params = await props.params;
	const topic = await getTopicBySlug(params.topic);

	if (!topic) {
		return notFound();
	}

	return (
		<>
			<Suspense fallback={<TopicBreadcrumb topic={topic} />}>
				<CategoryBreadcrumb topic={topic} searchParams={props.searchParams} />
			</Suspense>

			<div>
				<Description title={topic?.description} />
				{topic?.children && topic.children.length > 0 ? (
					<Suspense fallback={<TopicListSkeleton />}>
						<TopicChildrenList topic={topic} params={params} />
					</Suspense>
				) : topic.contentType === "page" ? (
					<Suspense>
						<Page
							parentTopicSlug={topic.slug}
							topic={params?.slug?.[0] || params.topic}
							slug={params.slug?.[1] || ""}
						/>
					</Suspense>
				) : (
					<Suspense fallback={<PostListSkeleton />}>
						<FilteredPostList
							topic={topic.slug}
							searchParams={props.searchParams}
						/>
					</Suspense>
				)}
			</div>
		</>
	);
}

import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import type { CategoryResponse } from "@/api/types/categories.type";
import type { TopicResponse } from "@/api/types/topics.type";
import CustomBreadcrumb from "@/components/ui/custom/custom-breadcrumb";
import { SITE_TITLE } from "@/utils/constants/generals";
import { getCategoriesByTopic, getTopicBySlug } from "../_lib/content-cache";
import Description from "../components/Description";
import Page from "../components/Page";
import PostList from "../components/Post/PostList";
import PostListSkeleton from "../components/Skeletons/PostListSkeleton";
import TopicListSkeleton from "../components/Skeletons/TopicListSkeleton";
import TopicChildrenList from "../components/topics/TopicChildrenList";

type SearchParams = Promise<{
	category?: string;
	page?: string;
}>;

type Props = {
	params: Promise<{
		topic: string;
		slug?: string[];
	}>;
	searchParams: SearchParams;
};

function parsePage(value?: string): number {
	const parsed = Number.parseInt(value ?? "1", 10);
	return Number.isNaN(parsed) || parsed < 1 ? 1 : parsed;
}

// Сторінки 2+ мають self-canonical (?page=N), інакше canonical з layout
// (/topic) склеїв би всю пагінацію в одну сторінку і Google бачив би
// лише перші 10 постів. Для ?category= лишається canonical /topic.
export async function generateMetadata(props: Props): Promise<Metadata> {
	const [params, searchParams] = await Promise.all([
		props.params,
		props.searchParams,
	]);
	const page = parsePage(searchParams.page);

	if (searchParams.category || page <= 1) {
		return {};
	}

	const topic = await getTopicBySlug(params.topic);
	if (!topic) {
		return {};
	}
	return {
		title: `${topic.title} — сторінка ${page} | ${SITE_TITLE}`,
		alternates: {
			canonical: `/${params.topic}?page=${page}`,
		},
	};
}

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
	const { category, page } = await searchParams;
	return <PostList topic={topic} category={category} page={parsePage(page)} />;
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

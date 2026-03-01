import { Suspense } from 'react';
import { notFound } from 'next/navigation';
import CustomBreadcrumb from '@/components/ui/custom/custom-breadcrumb';
import type { CategoryResponse } from '@/api/types/categories.type';
import TopicChildrenList from '../components/topics/TopicChildrenList';
import Page from '../components/Page';
import PostList from '../components/Post/PostList';
import Description from '../components/Description';
import TopicListSkeleton from '../components/Skeletons/TopicListSkeleton';
import PostListSkeleton from '../components/Skeletons/PostListSkeleton';
import { getCategoriesByTopic, getTopicBySlug } from '../_lib/content-cache';

type Props = {
  params: Promise<{
    topic: string;
    slug?: string[];
  }>;
  searchParams: Promise<{
    category?: string;
  }>;
};
export default async function TopicPage(props: Props) {
  const searchParams = await props.searchParams;
  const params = await props.params;
  const [topic, categories] = await Promise.all([
    getTopicBySlug(params.topic),
    getCategoriesByTopic(params.topic),
  ]);

  if (!topic) {
    return notFound();
  }

  const findCategoryBySlug = (
    slug: string,
    categoriesList: CategoryResponse[]
  ): CategoryResponse | null => {
    const foundCategory = categoriesList.find((cat) => cat.slug === slug);
    if (foundCategory) return foundCategory;

    for (const category of categoriesList) {
      if (category.children && category.children.length > 0) {
        const foundInChildren = findCategoryBySlug(slug, category.children);
        if (foundInChildren) return foundInChildren;
      }
    }

    return null;
  };

  const renderBreadcrumbs = () => {
    if (searchParams.category && categories?.items) {
      const selectedCategory = findCategoryBySlug(
        searchParams.category,
        categories.items
      );

      return (
        <CustomBreadcrumb
          prevPages={[
            { href: '/', label: 'Головна' },
            {
              href: `/${topic.slug}`,
              label: topic?.description || topic?.title,
            },
          ]}
          currentPage={{
            label: selectedCategory?.name || searchParams.category,
          }}
        />
      );
    }

    return (
      <CustomBreadcrumb
        prevPages={[{ href: '/', label: 'Головна' }]}
        currentPage={{ label: topic?.description || topic?.title }}
      />
    );
  };

  return (
    <>
      {renderBreadcrumbs()}

      <div>
        <Description title={topic?.description} />
        {topic?.children && topic.children.length > 0 ? (
          <Suspense fallback={<TopicListSkeleton />}>
            <TopicChildrenList topic={topic} params={params} />
          </Suspense>
        ) : topic.contentType === 'page' ? (
          <Suspense>
            <Page
              parentTopicSlug={topic.slug}
              topic={params?.slug?.[0] || params.topic}
              slug={params.slug?.[1] || ''}
            />
          </Suspense>
        ) : (
          <Suspense fallback={<PostListSkeleton />}>
            <PostList topic={topic.slug} category={searchParams?.category} />
          </Suspense>
        )}
      </div>
    </>
  );
}

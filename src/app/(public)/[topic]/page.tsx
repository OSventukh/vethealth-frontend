import { notFound } from 'next/navigation';
import { api } from '@/api';
import TopicContent from '../components/topics/TopicContent';
import CustomBreadcrumb from '@/components/ui/custom/custom-breadcrumb';
import { TAGS } from '@/api/constants/tags';
import { CategoryResponse } from '@/api/types/categories.type';

type Props = {
  params: Promise<{
    topic: string;
  }>;
  searchParams: Promise<{
    category?: string;
  }>;
};
export default async function TopicPage(props: Props) {
  const searchParams = await props.searchParams;
  const params = await props.params;
  const topic = await api.topics.getOne({
    slug: params.topic,
    query: { include: 'children' },
    tags: [TAGS.TOPICS],
  });

  const categories = await api.categories.getMany({
    query: { include: 'children' },
    tags: [TAGS.CATEGORIES],
  });

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
      <TopicContent
        topic={topic!}
        params={params}
        searchParams={searchParams}
      />
    </>
  );
}

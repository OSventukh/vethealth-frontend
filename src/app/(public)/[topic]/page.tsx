import { api } from '@/api';
import TopicContent from '../components/topics/TopicContent';
import CustomBreadcrumb from '@/components/ui/custom/custom-breadcrumb';
import { notFound } from 'next/navigation';

type Props = {
  params: {
    topic: string;
  };
  searchParams: {
    category?: string;
  };
};
export default async function TopicPage({ params, searchParams }: Props) {
  const topic = await api.topics.getOne({
    slug: params.topic,
    query: { include: 'children' },
    tags: ['topics'],
  });

  if (!topic) {
    return notFound();
  }

  return (
    <>
      <CustomBreadcrumb
        prevPages={[{ href: '/', label: 'Головна' }]}
        currentPage={{ label: topic?.description || topic?.title }}
      />
      <TopicContent
        topic={topic!}
        params={params}
        searchParams={searchParams}
      />
    </>
  );
}

import { api } from '@/api';
import TopicContent from '../components/topics/TopicContent';
import CustomBreadcrumb from '@/components/ui/custom/custom-breadcrumb';
import { notFound } from 'next/navigation';
import { TAGS } from '@/api/constants/tags';

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

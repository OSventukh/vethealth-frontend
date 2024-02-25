
import { PenSquare } from 'lucide-react';

import { DataTable } from '@/components/ui/DataTable';
import { topicColumns } from './columns';
import { api } from '@/api';
import { topicQuerySchema } from '@/utils/validators/query.validator';
import CreateButton from '@/components/ui/create-button';

type Props = {
  searchParams: {
    page?: string;
    size?: string;
    sort?: string;
    orderBy?: string;
    title?: string;
  };
};

export default async function TopicsPage({ searchParams }: Props) {
  const topicQueryValidation = topicQuerySchema.safeParse({
    ...searchParams,
    include: 'children',
  });
  const topics = await api.topics.getMany({
    query: topicQueryValidation.success ? topicQueryValidation.data : undefined,
    tags: ['topics'],
  });

  return (
    <>
      <CreateButton link="topics/create" icon={<PenSquare size={20} />} text="Нова тема" />
      <DataTable
        columns={topicColumns}
        data={topics?.items || []}
        pageCount={topics?.totalPages || 0}
        searchField="title"
        childrenProp="children"
      />
    </>
  );
}

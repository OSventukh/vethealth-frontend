import Link from 'next/link';
import { PenSquare } from 'lucide-react';

import { DataTable } from '@/components/ui/DataTable';
import { topicColumns } from './columns';
import { api } from '@/api';
import { topicQuerySchema } from '@/utils/validators/query.validator';

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
      <div className="w-full flex">
        <Link
          href="topics/create"
          className="flex gap-2 justify-center items-center p-3 py-2 bg-primary text-sm text-white hover:opacity-90 rounded-xl shadow-lg"
        >
          <PenSquare size={20} /> Нова тема
        </Link>
      </div>
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

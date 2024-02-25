import { DataTable } from '@/components/ui/DataTable';
import { pageColumns } from './columns';
import { api } from '@/api';
import { postQuerySchema } from '@/utils/validators/query.validator';
import { PenSquare } from 'lucide-react';
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

export default async function PagesPage({ searchParams }: Props) {
  const postQueryValidation = postQuerySchema.safeParse(searchParams);
  const pages = await api.pages.getMany({
    query: postQueryValidation.success ? postQueryValidation.data : undefined,
    tags: ['pages'],
  });

  return (
    <>
      <CreateButton
        link="pages/create"
        icon={<PenSquare size={20} />}
        text="Нова сторінка"
      />
      <DataTable
        columns={pageColumns}
        data={pages?.items || []}
        pageCount={pages?.totalPages || 1}
        searchField="title"
      />
    </>
  );
}

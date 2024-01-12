import { DataTable } from '@/components/ui/DataTable';
import { pageColumns } from './columns';
import { api } from '@/api';
import { postQuerySchema } from '@/utils/validators/query.validator';
import Link from 'next/link';
import { PenSquare } from 'lucide-react';

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
    tags: ['admin_pages'],
  });

  return (
    <>
      <div className="w-full flex mb-5">
        <Link
          href="pages/create"
          className="flex justify-center items-center p-5 py-3 bg-primary text-white hover:opacity-90 rounded-2xl shadow-lg"
        >
          <PenSquare /> Нова сторінка
        </Link>
      </div>
      <DataTable
        columns={pageColumns}
        data={pages.items}
        pageCount={pages.totalPages}
        searchField="title"
      />
    </>
  );
}

import Link from 'next/link';
import { PenSquare } from 'lucide-react';
import { DataTable } from '@/components/ui/DataTable';
import { api } from '@/api';
import { categoryColumns } from './columns';
import { categoryQuerySchema } from '@/utils/validators/query.validator';

type Props = {
  searchParams: {
    page?: string;
    size?: string;
    sort?: string;
    orderBy?: string;
    name?: string;
  };
};

export default async function CategoriesPage({ searchParams }: Props) {
  const categoryQueryValidation = categoryQuerySchema.safeParse({
    ...searchParams,
    include: 'children',
  });
  const categories = await api.categories.getMany({
    query: categoryQueryValidation.success
      ? categoryQueryValidation.data
      : undefined,
    tags: ['categories'],
  });
  return (
    <>
      <div className="w-full flex">
        <Link
          href="categories/create"
          className="flex gap-2 justify-center items-center p-3 py-2 bg-primary text-sm text-white hover:opacity-90 rounded-xl shadow-lg"
        >
          <PenSquare size={20} /> Нова категорія
        </Link>
      </div>
      <DataTable
        columns={categoryColumns}
        data={categories.items}
        pageCount={categories.totalPages}
        searchField="name"
        childrenProp={'children'}
      />
    </>
  );
}

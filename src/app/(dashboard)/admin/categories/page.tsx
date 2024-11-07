import { PenSquare } from 'lucide-react';
import { DataTable } from '@/components/ui/DataTable';
import { api } from '@/api';
import { categoryColumns } from './columns';
import { categoryQuerySchema } from '@/utils/validators/query.validator';
import CreateButton from '@/components/ui/create-button';

type Props = {
  searchParams: Promise<{
    page?: string;
    size?: string;
    sort?: string;
    orderBy?: string;
    name?: string;
  }>;
};

export default async function CategoriesPage(props: Props) {
  const searchParams = await props.searchParams;
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
      <CreateButton
        link="categories/create"
        icon={<PenSquare size={20} />}
        text="Нова категорія"
      />
      <DataTable
        columns={categoryColumns}
        data={categories?.items || []}
        pageCount={categories?.totalPages || 1}
        searchField="name"
        childrenProp={'children'}
      />
    </>
  );
}

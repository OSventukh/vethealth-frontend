import Head from 'next/head';
import CategoryList from '@/components/admin/Category/CategoryList';
import { General } from '@/utils/constants/general.enum';

export default function CategoriesPage() {
  return (
    <>
      <Head>
        <title>{`Categories | ${General.SiteTitle}`}</title>
      </Head>
      <CategoryList />
    </>
  );
}

import Head from 'next/head';
import PageList from '@/components/admin/Pages/PageList';
import { General } from '@/utils/constants/general.enum';
export default function PagesPage() {
  return (
    <>
      <Head>
        <title>{`Pages | ${General.SiteTitle}`}</title>
      </Head>
      <PageList />
    </>
  );
}

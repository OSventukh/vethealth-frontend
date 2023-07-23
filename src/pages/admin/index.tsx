import Head from 'next/head';
import { General } from '@/utils/constants/general.enum';
import Dashboard from './dashboard';
export default function IndexAdminPage() {
  return (
    <>
      <Head>
        <title>{`${General.SiteTitle}`}</title>
      </Head>
      <Dashboard />
    </>
  );
}

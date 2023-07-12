import Head from 'next/head';
import { General } from '@/utils/constants/general.enum';

export default function IndexAdminPage() {
  return (
    <>
      <Head>
        <title>{`${General.SiteTitle}`}</title>
      </Head>
      <p style={{ textAlign: 'center' }}>Not avaiable</p>
    </>
  );
}

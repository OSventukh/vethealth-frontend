import Head from 'next/head';
import { General } from '@/utils/constants/general.enum';

export default function Settings() {
  return (
    <>
      <Head>
        <title>{`Settings | ${General.SiteTitle}`}</title>
      </Head>
      <p style={{ textAlign: 'center' }}>Not avaiable</p>
    </>
  );
}

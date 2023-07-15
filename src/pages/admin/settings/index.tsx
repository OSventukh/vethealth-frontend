import Head from 'next/head';
import { General as GeneralEnum } from '@/utils/constants/general.enum';

export default function Settings() {
  return (
    <>
      <Head>
        <title>{`Settings | ${GeneralEnum.SiteTitle}`}</title>
      </Head>
    </>
  );
}

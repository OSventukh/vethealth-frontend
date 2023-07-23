import Head from 'next/head';
import type { InferGetStaticPropsType } from 'next';
import { General } from '@/utils/constants/general.enum';
export default function Page500({
  general,
}: InferGetStaticPropsType<typeof getStaticProps>) {
  return (
    <>
      <Head>
        <title>{`Помилка | ${General.SiteTitle}`}</title>
        <meta name="title" content={`Помилка | ${General.SiteTitle}`} />
      </Head>
      <p style={{ textAlign: 'center' }}>Виникла непердбачувана помилка</p>
    </>
  );
}

export async function getStaticProps() {
  try {
    return {
      props: {
        general: {
          siteName: General.SiteName,
          siteDescription: General.SiteDescription,
        },
      },
    };
  } catch (error) {
    return {
      props: {
        general: {
          name: General.SiteName,
          siteName: General.SiteName,
          siteDescription: General.SiteDescription,
        },
        navigationMenu: null,
      },
    };
  }
}

import Head from 'next/head';
import type { InferGetStaticPropsType } from 'next';
import { General } from '@/utils/constants/general.enum';
export default function Page500({
  general,
}: InferGetStaticPropsType<typeof getStaticProps>) {
  return (
    <>
      <Head>
        <title>{`Помилка | ${general.siteName} - ${general.siteDescription}`}</title>
        <meta
          name="description"
          content={
            general.siteDescription
              ? general.siteDescription
              : General.SiteDescription
          }
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
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
          siteName: General.SiteName,
          siteDescription: General.SiteDescription,
        },
        navigationMenu: null,
      },
    };
  }
}

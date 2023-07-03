import Head from 'next/head';
import type { InferGetStaticPropsType } from 'next';

export default function Page404({
  general,
}: InferGetStaticPropsType<typeof getStaticProps>) {
  return (
    <>
      <Head>
        <title>{`Cторінка не існує | ${general.siteName} - ${general.siteDescription}`}</title>
        <meta
          name="description"
          content={
            general.siteDescription
              ? general.siteDescription
              : 'Лікуванн та догляд за тваринами'
          }
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <p style={{ textAlign: 'center' }}>Цієї сторінки не існує</p>
    </>
  );
}

export async function getStaticProps() {
  try {
    return {
      props: {
        general: {
          siteName: 'VetHealth',
          siteDescription: 'Лікувавння та догляд за тваринами',
        },
      },
      revalidate: 1000,
    };
  } catch (error) {
    return {
      props: {
        general: {
          siteName: null,
          siteDescription: null,
          siteUrl: null,
        },
        navigationMenu: null,
      },
    };
  }
}

import Head from 'next/head';
import type { InferGetStaticPropsType } from 'next';
import { General } from '@/utils/constants/general.enum';
export default function Page404({
  general,
}: InferGetStaticPropsType<typeof getStaticProps>) {

  const pageTitle = `Cторінка не існує | ${general.title}`;
  const pageDescription = general.description;
  return (
    <>
      <Head>
      <title>{pageTitle}</title>
        <meta name="title" content={pageTitle}/>
        <meta name="description" content={pageDescription}/>
        <meta property="og:title" content={pageTitle} />
        <meta property="og:description" content={pageDescription} />
        <meta property="twitter:title" content={pageTitle} />
        <meta property="twitter:description" content={pageDescription} />
      </Head>
      <p style={{ textAlign: 'center' }}>Цієї сторінки не існує</p>
    </>
  );
}

export async function getStaticProps() {
    return {
      props: {
        general: {
          name: General.SiteName,
          title: General.SiteTitle,
          description: General.SiteDescription,
        },
      },
    };
}

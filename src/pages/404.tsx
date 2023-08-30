import Head from 'next/head';
import Image from 'next/image';
import type { InferGetStaticPropsType } from 'next';
import { Raleway } from 'next/font/google';
const releway = Raleway({ subsets: ['latin', 'cyrillic'] });
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
        <meta name="title" content={pageTitle} />
        <meta name="description" content={pageDescription} />
        <meta property="og:title" content={pageTitle} />
        <meta property="og:description" content={pageDescription} />
        <meta property="twitter:title" content={pageTitle} />
        <meta property="twitter:description" content={pageDescription} />
      </Head>
      <div style={{ width: '100%', height: 'calc(20vw + 5rem)', overflow: 'hidden', position: 'relative' }}>
        <Image src="/images/404.svg" alt="404" fill style={{ objectFit: 'contain' }} />
      </div>
      <p style={{ textAlign: 'center', fontWeight: '600' }} className={releway.className}>{General.NotFoundPage.toUpperCase()}</p>
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

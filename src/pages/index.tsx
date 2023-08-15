import Head from 'next/head';
import dynamic from 'next/dynamic';
const TopicList = dynamic(() => import('../components/topics/TopicList'));
import getData from '@/utils/getData';
import type { Topic } from '@/types/content-types';
import type { InferGetStaticPropsType } from 'next';
import { General } from '@/utils/constants/general.enum';
export default function Home({
  topics,
  general
}: InferGetStaticPropsType<typeof getStaticProps>) {
  const pageTitle = general.title;
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

      <TopicList topics={topics} />
    </>
  );
}

export async function getStaticProps() {
  const data = await getData<{ topics: Topic[] }>(
    '/topics?parentId=null&status=active'
  );

  return {
    props: {
      topics: data.topics || null,
      general: {
        name: General.SiteName,
        title: General.SiteTitle,
        description: General.SiteDescription,
      },
    },
    revalidate: 60,
  };
}

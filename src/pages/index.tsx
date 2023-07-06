import Head from 'next/head';
import dynamic from 'next/dynamic';
const TopicList = dynamic(() => import('../components/Topics/TopicList'))
import getData from '@/utils/getData';
import type { Topic } from '@/types/content-types';
import type { InferGetStaticPropsType } from 'next';
import { General } from '@/utils/constants/general.enum';

export default function Home(
  { topics }: InferGetStaticPropsType<typeof getStaticProps>
) {
  return (
    <>
      <Head>
        <title>{`${General.SiteTitle}`}</title>
        <meta name="description" content={General.SiteDescription} />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <TopicList topics={topics} />
    </>
  );
}

export async function getStaticProps() {
  const data = await getData<{ topics: Topic[] }>('/topics?parentId=null&status=active');

  return {
    props: {
      topics: data.topics || null,
      general: {
        siteName: General.SiteName,
        siteDescription: General.SiteDescription,
      },
    },
    revalidate: 60,
  };
}

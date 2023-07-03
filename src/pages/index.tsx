import Head from 'next/head';
import dynamic from 'next/dynamic';
const TopicList = dynamic(() => import('../components/Topics/TopicList'))
import getData from '@/utils/getData';
import type { Topic } from '@/types/content-types';
import type { InferGetStaticPropsType } from 'next';

export default function Home(
  { general, topics }: InferGetStaticPropsType<typeof getStaticProps>
) {
  return (
    <>
      <Head>
        <title>{`${general.siteName} – ${general.siteDescription}`}</title>
        <meta name="description" content="Лікування та догляд за тваринами" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <TopicList topics={topics} />
    </>
  );
}

export async function getStaticProps() {
  const data = await getData<{ topics: Topic[] }>('/topics?status=active');

  return {
    props: {
      topics: data.topics || null,
      general: {
        siteName: 'VetHealth',
        siteDescription: 'Лікування та догляд за тваринами',
      },
    },
    revalidate: 1000,
  };
}

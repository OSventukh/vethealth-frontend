import dynamic from 'next/dynamic';
import Head from 'next/head';

import Loading from '@/components/UI/Loading';
import { General } from '@/utils/constants/general.enum';
import getData from '@/utils/getData';
const Post = dynamic(() => import('@/components/Posts/Post'), {
  loading: () => <Loading />,
});
import type { GetServerSidePropsContext, InferGetStaticPropsType } from 'next';
import type { Params } from '@/types/params-types';
import type { Post as PostType, Topic } from '@/types/content-types';

export default function PostPage(
  { post, general }: InferGetStaticPropsType<typeof getServerSideProps>
) {
  if (!post) {
    return <div>Стаття не знайдена</div>;
  }
  return (
    <>
      <Head>
        <title>
        {`${post?.title} | ${General.SiteTitle}`}
        </title>
        <meta
          name="description"
          content={
            general?.siteDescription
              ? general.siteDescription
              : General.SiteDescription
          }
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <section className="content">
        <Post post={post} />
      </section>
    </>
  );
}

export async function getServerSideProps(context: GetServerSidePropsContext) {

  try {
    const { topic, post } = context.params as Params;
    const [postData, topicData] = await Promise.all([
      getData<{ post: PostType }>(`/posts?slug=${post}`),
      getData<{ topic: Topic }>(`/topics/?slug=${topic}&include=categories`),
    ]);
  
    return {
      props: {
        post: postData?.post || null,
        general: {
          siteName: General.SiteName,
          siteDescription: null,
        },
        navigationMenu: topicData?.topic?.categories || null,
      },
    };
  } catch (error) {
    return {
      props: {
        post: null,
        general: {
          siteName: General.SiteName,
          siteDescription: null,
        },
        navigationMenu: null,
      }
    }
  }
}

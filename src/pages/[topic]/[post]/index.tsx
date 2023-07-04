import dynamic from 'next/dynamic';
import Head from 'next/head';

import Loading from '@/components/UI/Loading';
import { General } from '@/utils/constants/general.enum';
import getData from '@/utils/getData';
const Post = dynamic(() => import('@/components/Posts/Post'), {
  loading: () => <Loading />,
});
import type { GetStaticPropsContext, InferGetStaticPropsType } from 'next';
import type { Params } from '@/types/params-types';
import type { Post as PostType, Topic } from '@/types/content-types';

export default function PostPage(
  { post, general }: InferGetStaticPropsType<typeof getStaticProps>
) {
  if (!post) {
    return <div>Стаття не знайдена</div>;
  }
  return (
    <>
      <Head>
        <title>
        {`${post?.title} | ${general?.siteName} - ${general?.siteDescription}`}
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

export async function getStaticProps(context: GetStaticPropsContext) {
  
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
      revalidate: 1000,
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

export async function getStaticPaths() {
  const topicData = await getData<{ topics: Topic[] }>('/topics?include=posts');

  const paths = topicData.topics.flatMap((item: Topic) => {
    const postSlugs = item.posts?.map((post) => post.slug).filter(Boolean);

    return postSlugs?.map((postSlug) => ({
      params: { topic: item.slug, post: postSlug },
    }));
  });

  return {
    paths,
    fallback: false,
  };
}

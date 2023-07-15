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

export default function PostPage({
  post,
  general,
}: InferGetStaticPropsType<typeof getServerSideProps>) {
  if (!post) {
    return <Loading />;
  }
  const pageTitle = `${post?.title} | ${general.title}`;
  const pageDescription = post?.excerpt.replace(/<[^>]+>/g, '');;
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

    if (!postData) {
      return {
        notFound: true,
      };
    }
  
    return {
      props: {
        post: postData?.post || null,
        general: {
          name: General.SiteName,
          title: General.SiteTitle,
          description: null,
        },
        navigationMenu: topicData?.topic?.categories || null,
      },
    };
  } catch (error) {
    throw new Error('Something went wrong')
  }
}

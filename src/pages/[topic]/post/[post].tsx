import dynamic from 'next/dynamic';
import Loading from '@/components/UI/Loading';

import getData from '@/utils/getData';
const Post = dynamic(() => import('@/components/Posts/Post'), {
  loading: () => <Loading />
});
import type { GetStaticPropsContext, InferGetStaticPropsType } from 'next';
import type { Params } from '@/types/params-types';
import type { Post as PostType, Topic } from '@/types/content-types';

export default function PostPage(props: InferGetStaticPropsType<typeof getStaticProps>) {
  if (!props) {
    return <div>Loading</div>;
  }
  return (
    <section className="content">
      <Post post={props.post} />
    </section>
  );
}

export async function getStaticProps(context: GetStaticPropsContext) {
  const { topic, post } = context.params as Params;

  const [postData, topicData] = await Promise.all([
    getData<{posts: PostType[]}>(`/posts?slug=${post}`),
    getData<{topic: Topic}>(`/topics/?slug=${topic}&include=categories`),
  ]);

  return {
    props: {
      post: postData.posts[0] || null,
      general: {
        siteName: 'Vethealth',
        siteDescription: null,
      },
      navigationMenu: topicData?.topic?.categories || null,
    },
    revalidate: 1000,
  };
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

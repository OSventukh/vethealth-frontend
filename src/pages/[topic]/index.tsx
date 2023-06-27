import dynamic from 'next/dynamic';
import { useRouter } from 'next/router';
import Loading from '@/components/UI/Loading';

import getData from '@/utils/getData';
import { Raleway } from 'next/font/google';
import type { Params } from '@/types/params-types';
import type { GetServerSidePropsContext, InferGetStaticPropsType } from 'next';
import type { Post, Topic, Category } from '@/types/content-types';

const PostsList = dynamic(() => import('@/components/Posts/PostList'), {
  loading: () => <Loading />
});

const TopicsList = dynamic(() => import('@/components/Topics/TopicList'), {
  loading: () => <Loading />,
})

const PostComponent = dynamic(() => import('@/components/Posts/Post'), {
  loading: () => <Loading />,
})


const releway = Raleway({ weight: ['600'], subsets: ['latin', 'cyrillic'] });

export default function TopicPage({
  subtopics,
  posts,
  page,
  general,
}: InferGetStaticPropsType<typeof getServerSideProps>) {
  const router = useRouter();
  const category = router.query?.category;

  return (
    <>
      <div className="description">
        <h2 className={releway.className}>{general.siteDescription}</h2>
      </div>
      {page ? (
        <PostComponent post={page as Post} />
      ) : subtopics ? (
        <TopicsList topics={subtopics} />
      ) : posts ? (
        <PostsList posts={posts} />
      ) : (
        <p style={{ textAlign: 'center' }}>
          {category ? 'Матеріали в даній категорії поки-що відсутні' : 'Матеріли по даній темі поки-що відсутні'}
        </p>
      )}
    </>
  );
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const { topic } = context.params as Params;
  const { category } = context.query;

  const topicData = await getData<{ topic: Topic }>(
    `/topics?slug=${topic}&parentId=null&include=categories,children,page&status=active`
  );

  let url = `/posts/?topic=${topic}&include=topics,categories&status=published`;

  if (category) {
    url += `&category=${category}`;
  }

  const [data] = await Promise.all([getData<{ posts: Post[] }>(url)]);
  return {
    props: {
      posts: data?.posts && data.posts.length > 0 ? data.posts : null,
      page: topicData?.topic?.content === 'page' ? topicData.topic.page : null,
      subtopics:
        topicData?.topic?.children && topicData.topic.children.length > 0
          ? topicData.topic.children
          : null,
      general: {
        siteName: 'Vethealth',
        siteDescription: topicData?.topic?.description || null,
      },
      navigationMenu: topicData?.topic?.categories || null,
    },
  };
}

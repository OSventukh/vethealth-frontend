import Head from 'next/head';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/router';
import Loading from '@/components/UI/Loading';
import type { General as GeneralType } from '@/utils/constants/general.enum';
import { General } from '@/utils/constants/general.enum';
import getData from '@/utils/getData';
import type { Params } from '@/types/params-types';
import type {
  GetServerSidePropsContext,
  InferGetServerSidePropsType,
} from 'next';

import type { Post, Topic, PaginateData } from '@/types/content-types';

const PostsList = dynamic(() => import('@/components/Posts/PostList'), {
  loading: () => <Loading />,
});

const TopicsList = dynamic(() => import('@/components/Topics/TopicList'), {
  loading: () => <Loading />,
});

const PostComponent = dynamic(() => import('@/components/Posts/Post'), {
  loading: () => <Loading />,
});

export default function TopicPage({
  topic,
  subtopics,
  postsData,
  page,
  general,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const router = useRouter();
  const category = router.query?.category;

  return (
    <>
      <Head>
        <title>{`${page ? page.title : topic?.title} | ${
          General.SiteTitle
        }`}</title>
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
      {page ? (
        <PostComponent post={page as Post} />
      ) : subtopics ? (
        <TopicsList topics={subtopics} />
      ) : postsData?.posts ? (
        <PostsList posts={postsData.posts} totalPages={postsData.totalPages} />
      ) : (
        <p style={{ textAlign: 'center' }}>
          {category
            ? 'Матеріали в даній категорії поки-що відсутні'
            : 'Матеріли по даній темі поки-що відсутні'}
        </p>
      )}
    </>
  );
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const { topic } = context.params as Params;
  const { category, page } = context.query;
  try {
    const topicData = await getData<{ topic: Topic }>(
      `/topics?slug=${topic}&include=categories,children,page&status=active`
    );
    
    if (!topicData.topic) {
      return {
        notFound: true,
      };
    }

    let url = `/posts/?topic=${topic}&include=topics,categories&status=published&order=createdAt:desc&size=10&page=${page}`;

    if (category) {
      url += `&category=${category}`;
    }

    const postData = await getData<PaginateData & { posts: Post[] }>(url);

    return {
      props: {
        topic: topicData?.topic || null,
        postsData:
          postData?.posts && postData.posts.length > 0 ? postData : null,
        page:
          topicData?.topic?.content === 'page' ? topicData.topic.page : null,
        subtopics:
          topicData?.topic?.children && topicData.topic.children.filter((child) => child.status === 'active').length > 0
            ? topicData.topic.children.filter((child) => child.status === 'active')
            : null,
        general: {
          siteName: General.SiteName,
          siteDescription:
            topicData?.topic?.description ||
            (topicData?.topic?.children && topicData?.topic?.children.length > 0
              ? topicData?.topic?.title
              : null) ||
            null,
        },
        navigationMenu: topicData?.topic?.categories || null,
      },
    };
  } catch (error) {
    return {
      props: {
        postsData: null,
        page: null,
        subtopics: null,
        general: {
          siteName: General.SiteName,
          siteDescription: General.SiteDescription,
        },
        navigationMenu: null,
      },
    };
  }
}

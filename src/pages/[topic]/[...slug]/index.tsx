import dynamic from 'next/dynamic';
import Link from 'next/link';
import Head from 'next/head';
import { useRouter } from 'next/router';
import Loading from '@/components/UI/Loading';
import { General } from '@/utils/constants/general.enum';
import getData from '@/utils/getData';
import { Breadcrumbs, Typography, Box } from '@mui/material';
const PostsList = dynamic(() => import('@/components/posts/PostList'), {
  loading: () => <Loading />,
});

const Post = dynamic(() => import('@/components/posts/Post'), {
  loading: () => <Loading />,
});
import type { GetServerSidePropsContext, InferGetStaticPropsType } from 'next';
import type { Params } from '@/types/params-types';
import type {
  Post as PostType,
  Topic,
  PaginateData,
} from '@/types/content-types';

export default function PostPage({
  post,
  page,
  topic,
  postsData,
  general,
  subtopic,
}: InferGetStaticPropsType<typeof getServerSideProps>) {
  const router = useRouter();
  const { topic: topicSlug, slug } = router.query;

  if (!post && !page && !postsData) {
    return <Loading />;
  }
  const pageTitle = `${post?.title || page?.title || subtopic?.title} | ${
    general.title
  }`;
  const pageDescription =
    post?.excerpt?.replace(/<[^>]+>/g, '').slice(0, 150) ||
    post?.content.replace(/<[^>]+>/g, '').slice(0, 150);

  let breadcrumbs: React.ReactNode[] = [];

  if (slug && slug.length === 1) {
    breadcrumbs = [
      <Typography key="1" component={Link} href={`/${topicSlug}`}>
        {topic?.title}
      </Typography>,
      <Typography key="2" color="text.primary">
        {subtopic?.title || post?.title}
      </Typography>,
    ];
  }

  if (slug && slug.length > 1) {
    breadcrumbs = [
      <Typography key="1" component={Link} href={`/${topicSlug}/${slug[0]}`}>
        {subtopic?.title}
      </Typography>,
      <Typography key="2" color="text.primary">
        {post?.title}
      </Typography>,
    ];
  }

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
      <Box sx={{ display: 'flex', justifyContent: 'center', p: '0.5rem' }}>
        <Breadcrumbs sx={{ '& .MuiBreadcrumbs-ol': { justifyContent: 'center'}}} separator="›">{breadcrumbs}</Breadcrumbs>
      </Box>
      {postsData?.posts ? (
        <PostsList posts={postsData.posts} totalPages={postsData.totalPages} />
      ) : post ? (
        <section className="content">
          <Post post={post} />
        </section>
      ) : (
        <section className="content">
          <Post post={page as PostType} />
        </section>
      )}
    </>
  );
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
  try {
    const { topic, slug } = context.params as Params;
    const { page } = context.query;

    const [postData, topicData, subtopicData] = await Promise.all([
      getData<{ post: PostType }>(
        `/posts?slug=${slug?.[1] ? slug?.[1] : slug}`
      ),
      getData<{ topic: Topic }>(`/topics/?slug=${topic}&include=categories`),
      getData<{ topic: Topic }>(
        `/topics/?slug=${slug?.[0]}&include=categories,page`
      ),
    ]);

    if (!postData && !subtopicData) {
      return {
        notFound: true,
      };
    }

    let posts = null;

    if (subtopicData.topic?.content === 'posts') {
      posts = await getData<PaginateData & { posts: PostType[] }>(
        `/posts/?topic=${topic}&include=topics,categories&status=published&order=createdAt:desc&size=10&page=${page}`
      );
    }

    return {
      props: {
        topic: topicData?.topic || null,
        subtopic: subtopicData?.topic || null,
        page: subtopicData?.topic?.page || null,
        post: postData?.post || null,
        postsData: posts,
        general: {
          name: General.SiteName,
          title: General.SiteTitle,
          description: null,
        },
        navigationMenu: topicData?.topic?.categories || null,
      },
    };
  } catch (error) {
    throw new Error('Something went wrong');
  }
}

import Head from 'next/head';
import { useRouter } from 'next/router';
import dynamic from 'next/dynamic';
const PostsList = dynamic(() => import('@/components/Posts/PostList'));
import getData from '@/utils/getData';
import type {
  GetServerSidePropsContext,
  InferGetServerSidePropsType,
} from 'next';
import type { Post, PaginateData } from '@/types/content-types';
import { General } from '@/utils/constants/general.enum';

export default function SearchPage({
  postsData,
  general,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const router = useRouter();

  const pageTitle = `Пошук | ${general.title}`;
  const pageDescription = general.desription;
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
      {!postsData && (
        <p style={{ textAlign: 'center' }}>Результатів не знайдено</p>
      )}
      {postsData && (
        <PostsList posts={postsData.posts} totalPages={postsData.totalPages} />
      )}
    </>
  );
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const { search } = context.query;

  let url = `/search/${search}`;

  let postData;

  if (search && search.length > 0) {
    postData = await getData<PaginateData & { posts: Post[] }>(url);
  }

  return {
    props: {
      postsData: postData?.posts && postData.posts.length > 0 ? postData : null,

      general: {
        name: General.SiteName,
        title: General.SiteTitle,
        desription: General.SearchResult,
      },
      navigationMenu: null,
    },
  };
}

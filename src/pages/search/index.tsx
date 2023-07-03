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

export default function SearchPage({
  postsData,
  general,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const router = useRouter();

  return (
    <>
      <Head>
        <title>{`Пошук | ${general.siteName} - ${general.siteDescription}`}</title>
        <meta
          name="description"
          content={
            general.siteDescription
              ? general.siteDescription
              : 'Лікуванн та догляд за тваринами'
          }
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
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
        siteName: 'VetHealth',
        siteDescription: 'Результати пошуку',
      },
      navigationMenu: null,
    },
  };
}

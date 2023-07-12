import Head from 'next/head';
import PostsList from '@/components/admin/Posts/PostList';
import { General } from '@/utils/constants/general.enum';

export default function PostsPage() {
  return (
    <>
      <Head>
        <title>{`Posts | ${General.SiteTitle}`}</title>
      </Head>
      <PostsList />
    </>
  );
}

import { useRouter } from 'next/router';
import PostItem from './PostItem';
import Loading from '../UI/Loading';
import Pagination from '@mui/material/Pagination';
import Box from '@mui/material/Box';
import type { Post } from '@/types/content-types';

export default function PostsList({ posts, totalPages }: { posts: Post[]; totalPages: number }) {
  if (!posts) {
    return <Loading />;
  }

  const router = useRouter();
  const currentPage = parseInt(router.query.page?.toString() || '0');

  const postsPaginationChangeHandler = (event: React.ChangeEvent<unknown>, value: number) => {
    router.push({
      pathname: router.pathname,
      query: {...router.query, page: value}
    })
  }

  return (
    <section className="content">
      {posts.map((post: Post) => (
        <PostItem key={post.id} post={post} />
      ))}
      {totalPages && +totalPages > 1 && <Box sx={{ display: 'flex', justifyContent: 'center', p: '1rem'}}>
        <Pagination count={totalPages} page={currentPage || 1} onChange={postsPaginationChangeHandler} />
      </Box>}
    </section>
  );
}

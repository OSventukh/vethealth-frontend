import React from 'react';
import PostItem from './PostItem';
import Loading from '../UI/Loading';
import type { Post } from '@/types/content-types';

export default function PostsList({ posts }: { posts: Post[] }) {
  if (!posts) {
    return <Loading />;
  }

  return (
    <section className="content">
      {posts.map((post: Post) => (
        <PostItem key={post.id} post={post} />
      ))}
    </section>
  );
}

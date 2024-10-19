import React from 'react';
import Footer from '../components/Footer';
import Header from '../components/Header';
import { api } from '@/api';
import PostItem from '../components/Post/PostItem';
import CustomBreadcrumb from '@/components/ui/custom/custom-breadcrumb';
import Description from '../components/Description';

type Props = {
  searchParams: {
    query: string;
  };
};
export default async function SearchPage({ searchParams }: Props) {
  const { query } = searchParams;

  const posts = await api.search({ query, revalidate: 1 });

  return (
    <>
      <Header />
      <main>
        <div className="container">
          <CustomBreadcrumb
            prevPages={[{ href: '/', label: 'Головна' }]}
            currentPage={{ label: 'Пошук' }}
          />
          <Description title={`Пошук по запиту: "${query}"`} />
          <div className="grid grid-cols-1 justify-center justify-items-center gap-8 md:grid-cols-2">
            {posts &&
              posts?.count > 0 &&
              posts.items.map((post) => (
                <PostItem
                  key={post.id}
                  post={post}
                  topic={post?.topics?.[0].slug ?? ''}
                />
              ))}
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}

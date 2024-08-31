import { api } from '@/api';
import React from 'react';
import Post from '../../components/Post';
import Page from '../../components/Page';
import TopicList from '../../components/topics/TopicList';

type Props = {
  params: {
    topic: string;
    slug: string[];
  };
};
export default async function SlugPage({ params }: Props) {
  const topicSlug = params?.slug.length > 0 ? params?.slug[0] : params.topic;

  const topic = await api.topics.getOne({
    slug: topicSlug,
    query: { include: 'children,page' },
    tags: ['topics'],
  });

  const hasChildren = typeof topic !== 'string' && topic?.children && topic.children.length > 0;
  const isPage = typeof topic !== 'string' && topic && topic.contentType === 'page';
  const isRootSlug = params.slug.length < 1;
  
  return (
    <>
    {hasChildren && isRootSlug ? (
      <TopicList items={topic?.children || []} />
    ) : isPage ? (
      <Page topic={params.slug[params.slug.length - 1]} />
    ) : (
      <Post slug={params.slug[params.slug.length - 1]} />
    )}
  </>
  );
}

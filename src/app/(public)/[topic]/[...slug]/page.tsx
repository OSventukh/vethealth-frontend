import { api } from '@/api';
import React from 'react';
import TopicContent from '../../components/topics/TopicContent';
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
  console.log('params', params);
  const topicSlug = params?.slug.length > 0 ? params?.slug[0] : params.topic;
  const topic = await api.topics.getOne({
    slug: topicSlug,
    query: { include: 'children,page' },
    tags: ['topics'],
  });

  return (
    <>
      {topic?.children &&
      topic.children.length > 0 &&
      params.slug.length < 1 ? (
        <TopicList items={topic?.children} />
      ) : topic && topic.contentType === 'page' ? (
        <Page topic={params.slug[params.slug.length - 1]} />
      ) : (
        <Post slug={params.slug[params.slug.length - 1]} />
      )}
    </>
  );
}

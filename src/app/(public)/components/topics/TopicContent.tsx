import React from 'react';
import Description from '../Description';
import TopicList from './TopicList';
import PostList from '../Post/PostList';
import Page from '../Page';
import { TopicResponse } from '@/api/types/topics.type';
import { notFound } from 'next/navigation';

type Props = {
  topic: TopicResponse | null;
  params: {
    topic: string;
    slug?: string[];
  };
  searchParams: {
    category?: string;
  };
};
export default function TopicContent({ topic, params, searchParams }: Props) {
  const parentSlug = params.slug
    ? `${params.topic}/${params.slug.join('/')}`
    : params.topic;

  if (!topic) {
    return notFound();
  }
  return (
    <div>
      <Description title={topic?.description} />
      {topic?.children && topic.children.length > 0 ? (
        <TopicList items={Promise.resolve(topic.children)} parentSlug={parentSlug} />
      ) : topic.contentType === 'page' ? (
        <Page
          parentTopicSlug={topic.slug}
          topic={params?.slug?.[0] || params.topic}
          slug={params.slug?.[1] || ''}
        />
      ) : (
        <PostList topic={topic.slug} category={searchParams?.category} />
      )}
    </div>
  );
}

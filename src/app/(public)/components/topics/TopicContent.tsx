import React from 'react';
import Description from '../Description';
import TopicList from './TopicList';
import PostList from '../Post/PostList';
import Page from '../Page';
import { TopicResponse } from '@/api/types/topics.type';
import { filterFns } from '@tanstack/react-table';

type Props = {
  topic: TopicResponse | null;
  params: {
    topic: string;
    slug?: string[];
  };
};
export default function TopicContent({ topic, params }: Props) {
  const parentSlug = params.slug
    ? `${params.topic}/${params.slug.join('/')}`
    : params.topic;
 
  if (!topic) {
    return <div>Сторінка не знайдена</div>;
  }
  return (
    <div>
      <Description title={topic?.description} />
      {topic?.children && topic.children.length > 0 ? (
        <TopicList items={topic.children} parentSlug={parentSlug} />
      ) : topic.contentType === 'page' ? (
        <Page topic={params?.slug?.[0] || params.topic} />
      ) : (
        <PostList topic={topic.slug} />
      )}
    </div>
  );
}

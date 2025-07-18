import { api } from '@/api';
import React from 'react';
import Post from '../../components/Post';
import Page from '../../components/Page';
import TopicList from '../../components/topics/TopicList';
import CustomBreadcrumb from '@/components/ui/custom/custom-breadcrumb';
import { TAGS } from '@/api/constants/tags';

type Props = {
  params: Promise<{
    topic: string;
    slug: string[];
  }>;
};
export default async function SlugPage(props: Props) {
  const params = await props.params;
  const topicSlug = params?.slug.length > 0 ? params?.slug[0] : params.topic;
  const topic = await api.topics.getOne({
    slug: topicSlug,
    query: { include: 'children,page' },
    tags: [TAGS.TOPICS],
  });

  const hasChildren = topic && topic?.children && topic.children.length > 0;
  const isPage = topic && topic && topic.contentType === 'page';
  const isRootSlug = params.slug.length < 1;
  return (
    <>
      {hasChildren && isRootSlug ? (
        <>
          <CustomBreadcrumb
            prevPages={[{ href: '/', label: 'Головна' }]}
            currentPage={{ label: topic?.title || '' }}
          />
          <TopicList items={Promise.resolve(topic?.children || [])} />
        </>
      ) : isPage ? (
        <Page
          parentTopicSlug={params.topic}
          topic={params.slug[0]}
          slug={params.slug[1]}
        />
      ) : (
        <Post
          parentTopicSlug={params.topic}
          slug={params.slug[params.slug.length - 1]}
        />
      )}
    </>
  );
}

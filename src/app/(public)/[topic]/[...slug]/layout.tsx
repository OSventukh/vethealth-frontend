import type { Metadata, ResolvingMetadata } from 'next';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import { api } from '@/api';
import { NOT_FOUND_TITLE, SITE_TITLE } from '@/utils/constants/generals';

type Props = {
  params: {
    topic: string;
    slug: string[];
  };
  searchParams: { [key: string]: string | string[] | undefined };
};

async function getTopicMetadata(topicSlug: string): Promise<Metadata> {
  const topic = await api.topics.getOne({
    slug: topicSlug,
    query: { include: 'children' },
    tags: ['topics'],
  });

  if (typeof topic === 'string') {
    return { title: NOT_FOUND_TITLE };
  }

  const hasChildren = topic?.children && topic.children.length > 0;
  const isPage = topic?.contentType === 'page';

  if (hasChildren || isPage) {
    return {
      title: `${topic?.title} | ${SITE_TITLE}`,
      description: topic?.description,
      openGraph: {
        images: topic?.image.path || [],
      },
    };
  }

  return { title: `${topic?.title} | ${SITE_TITLE}` };
}

async function getPostMetadata(postSlug: string): Promise<Metadata> {
  const post = await api.posts.getOne({
    slug: postSlug,
    tags: ['posts'],
  });

  if (typeof post === 'string') {
    return { title: NOT_FOUND_TITLE };
  }

  return { title: `${post?.title} | ${SITE_TITLE}` };
}

export async function generateMetadata(
  { params, searchParams }: Props,
  parent: ResolvingMetadata
): Promise<Metadata> {
  const topicSlug = params.topic;
  const isRootSlug = params.slug.length < 1;

  if (isRootSlug) {
    return getTopicMetadata(topicSlug);
  } else {
    const postSlug = params.slug[params.slug.length - 1];
    return getPostMetadata(postSlug);
  }
}

export default function TopicLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: {
    topic: string;
  };
}) {
  return <>{children}</>;
}

import type { Metadata } from 'next';
import { api } from '@/api';
import { SITE_TITLE } from '@/utils/constants/generals';
import { notFound } from 'next/navigation';

type Props = {
  params: {
    topic?: string;
    slug?: string[];
  };
};

async function getTopicMetadata(topicSlug: string): Promise<Metadata> {
  const topic = await api.topics.getOne({
    slug: topicSlug,
    query: { include: 'children' },
    tags: ['topics'],
  });

  if (!topic) {
    return notFound();
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

  if (!post) {
    return getTopicMetadata(postSlug);
  }
  const firstParagraph = JSON.parse(post?.content).root.children[0].children[0].text;
  return {
    title: `${post?.title} | ${SITE_TITLE}`,
    openGraph: { images: post?.featuredImage || [] },
    description: firstParagraph,
  };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { topic, slug } = params;
  if (!topic || !slug) return notFound();
  const topicSlug = topic;
  const isRootSlug = slug.length < 1;

  if (isRootSlug) {
    return getTopicMetadata(topicSlug);
  } else {
    const postSlug = slug[slug.length - 1];
    return getPostMetadata(postSlug);
  }
}

export default function TopicLayout({
  children,
}: {
  children: React.ReactNode;
  params: {
    topic: string;
  };
}) {
  return <>{children}</>;
}

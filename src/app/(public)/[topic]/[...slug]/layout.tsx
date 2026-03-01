import type { Metadata } from 'next';
import { SITE_TITLE } from '@/utils/constants/generals';
import { notFound } from 'next/navigation';
import { getPostBySlug, getTopicBySlug } from '../../_lib/content-cache';

type Props = {
  params: Promise<{
    topic?: string;
    slug?: string[];
  }>;
};

async function getTopicMetadata(topicSlug: string): Promise<Metadata> {
  const topic = await getTopicBySlug(topicSlug);

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

function getFirstParagraph(content: string): string | undefined {
  try {
    const parsed = JSON.parse(content);
    const firstNode = parsed?.root?.children?.[0];
    const firstText = firstNode?.children?.[0]?.text;

    if (typeof firstText === 'string' && firstText.trim()) {
      return firstText;
    }

    return undefined;
  } catch {
    return undefined;
  }
}

async function getPostOrTopicMetadata({
  postSlug,
  topicSlug,
}: {
  postSlug: string;
  topicSlug: string;
}): Promise<Metadata> {
  const [post, nestedTopic] = await Promise.all([
    getPostBySlug(postSlug),
    getTopicBySlug(postSlug),
  ]);

  if (post) {
    return {
      title: `${post?.title} | ${SITE_TITLE}`,
      openGraph: { images: post?.featuredImage || [] },
      description: getFirstParagraph(post.content),
    };
  }

  if (nestedTopic) {
    return {
      title: `${nestedTopic?.title} | ${SITE_TITLE}`,
      description: nestedTopic?.description,
      openGraph: {
        images: nestedTopic?.image.path || [],
      },
    };
  }

  return getTopicMetadata(topicSlug);
}

export async function generateMetadata(props: Props): Promise<Metadata> {
  const params = await props.params;
  const { topic, slug } = params;
  if (!topic || !slug) return notFound();
  const topicSlug = topic;
  const isRootSlug = slug.length < 1;

  if (isRootSlug) {
    return getTopicMetadata(topicSlug);
  } else {
    const postSlug = slug[slug.length - 1];
    return getPostOrTopicMetadata({ postSlug, topicSlug });
  }
}

export default function TopicLayout({
  children,
}: {
  children: React.ReactNode;
  params: Promise<{
    topic: string;
  }>;
}) {
  return <>{children}</>;
}

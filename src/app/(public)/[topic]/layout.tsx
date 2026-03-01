import type { Metadata } from 'next';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { NOT_FOUND_TITLE, SITE_TITLE } from '@/utils/constants/generals';
import { getTopicBySlug } from '../_lib/content-cache';

type MetadataProps = {
  params: Promise<{
    topic: string;
  }>;
};

export async function generateMetadata(
  props: MetadataProps
): Promise<Metadata> {
  const params = await props.params;
  const topic = await getTopicBySlug(params.topic);

  if (typeof topic === 'string') {
    return {
      title: NOT_FOUND_TITLE,
    };
  }
  return {
    title: `${topic?.title} | ${SITE_TITLE}`,
    description: topic?.description,
    openGraph: {
      images: topic?.image.path || [],
    },
  };
}

type TopicLayoutProps = {
  children: React.ReactNode;
  params: Promise<{
    topic: string;
  }>;
};
export default async function TopicLayout(props: TopicLayoutProps) {
  const params = await props.params;

  const { children } = props;

  return (
    <>
      <Header topic={params.topic} />
      <main>
        <div className="container">{children}</div>
      </main>
      <Footer />
    </>
  );
}

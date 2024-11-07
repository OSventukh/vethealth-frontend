import type { Metadata } from 'next';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { api } from '@/api';
import { NOT_FOUND_TITLE, SITE_TITLE } from '@/utils/constants/generals';

type Props = {
  params: Promise<{
    topic: string;
  }>;
};

export async function generateMetadata(props: Props): Promise<Metadata> {
  const params = await props.params;
  const topic = await api.topics.getOne({
    slug: params.topic,
    query: { include: 'children' },
    tags: ['topics'],
  });

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

export default async function TopicLayout(props: {
  children: React.ReactNode;
  params: Promise<{
    topic: string;
  }>;
}) {
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

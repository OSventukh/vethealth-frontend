import type { Metadata, ResolvingMetadata } from 'next';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { api } from '@/api';
import { NOT_FOUND_TITLE, SITE_TITLE } from '@/utils/constants/generals';

type Props = {
  params: {
    topic: string;
  };
  searchParams: { [key: string]: string | string[] | undefined };
};

export async function generateMetadata(
  { params, searchParams }: Props,
  parent: ResolvingMetadata
): Promise<Metadata> {
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

export default function TopicLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: {
    topic: string;
  };
}) {
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

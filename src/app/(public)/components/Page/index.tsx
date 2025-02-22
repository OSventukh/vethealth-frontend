import { Raleway } from 'next/font/google';

import { ParsedContent } from '@/app/(dashboard)/admin/components/Editor/ParsedContent';
import React from 'react';
import { api } from '@/api';
import { notFound } from 'next/navigation';
import CustomBreadcrumb from '@/components/ui/custom/custom-breadcrumb';
import { TAGS } from '@/api/constants/tags';
import Post from '../Post';

type Props = {
  topic: string;
  parentTopicSlug: string;
  slug: string;
};

const raleway = Raleway({ subsets: ['latin', 'cyrillic'] });

export default async function Page({ topic, parentTopicSlug, slug }: Props) {
  const topicResponse = await api.topics.getOne({
    slug: topic,
    query: { include: 'page' },
    tags: [TAGS.TOPICS],
  });

  const parentTopic = await api.topics.getOne({
    slug: parentTopicSlug,
    tags: [TAGS.TOPICS],
  });
  if (!topicResponse?.page && !slug) {
    return notFound();
  }

  const page = topicResponse?.page;
  return (
    <>
      {page && !slug && (
        <>
          <CustomBreadcrumb
            prevPages={[
              { href: '/', label: 'Головна' },
              {
                href: '/' + parentTopic?.slug || '',
                label: parentTopic?.description || parentTopic?.title || '',
              },
            ]}
            currentPage={{ label: topicResponse?.page?.title || '' }}
          />
          <div className="border-border mt-4 rounded-xl border-[1px] bg-white p-8">
            <h2
              className={`${raleway.className} my-4 text-center text-lg font-[600] uppercase`}
            >
              {page?.title}
            </h2>
            <div className="prose max-w-none">
              <ParsedContent content={JSON.parse(page?.content || '')} />
            </div>
          </div>
        </>
      )}
      {slug && (
        <Post slug={slug} parentTopicSlug={parentTopicSlug} topicSlug={topic} />
      )}
    </>
  );
}

import { Raleway } from 'next/font/google';

import { ParsedContent } from '@/components/dashboard/Editor/ParsedContent';
import React from 'react';
import { api } from '@/api';
import { notFound } from 'next/navigation';
import CustomBreadcrumb from '@/components/ui/custom/custom-breadcrumb';

type Props = {
  topic: string;
  parentTopicSlug: string;
};

const raleway = Raleway({ subsets: ['latin', 'cyrillic'] });

export default async function Page({ topic, parentTopicSlug }: Props) {
  const topicResponse = await api.topics.getOne({
    slug: topic,
    query: { include: 'page' },
    tags: ['topics'],
  });

  const parentTopic = await api.topics.getOne({
    slug: parentTopicSlug,
    tags: ['topics'],
  });

  if (!topicResponse?.page) {
    return notFound();
  }

  return (
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
      <div className="mt-4 rounded-xl border-[1px] border-border bg-white p-8">
        <h2
          className={`${raleway.className} my-4 text-center text-lg font-[600] uppercase`}
        >
          {topicResponse?.page?.title}
        </h2>
        <div>
          <ParsedContent
            content={JSON.parse(topicResponse?.page?.content || '')}
          />
        </div>
      </div>
    </>
  );
}

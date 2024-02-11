import { Raleway } from 'next/font/google';

import { PageResponse } from '@/api/types/pages.type';
import { ParsedContent } from '@/components/dashboard/Editor/ParsedContent';
import React from 'react';
import { api } from '@/api';
import { TopicResponse } from '@/api/types/topics.type';

type Props = {
  topic: string;
};

const raleway = Raleway({ subsets: ['latin', 'cyrillic'] });

export default async function Page({ topic }: Props) {
  console.log('topic', topic)
  const topicResponse = await api.topics.getOne({
    slug: topic,
    query: { include: 'page' },
    tags: ['topics'],
  });
  console.log('page', topicResponse);

  if (!topicResponse?.page) {
    return <div>Сторінка не знайдена</div>;
  }
  return (
    <div className="mt-8 rounded-xl border-[1px] border-border bg-white p-8">
      <h2
        className={`${raleway.className} my-4 text-center text-lg font-[600] uppercase`}
      >
        {topicResponse?.page?.title}
      </h2>
      <div>
        <ParsedContent content={JSON.parse(topicResponse?.page?.content || '')} />
      </div>
    </div>
  );
}

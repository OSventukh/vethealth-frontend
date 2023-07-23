import React from 'react';

import TopicItem from './TopicItem';
import type { Topic } from '@/types/content-types';

export default function TopicsList({ topics }: { topics: Topic[]}) {
  return (
    <section className="topics">
      {topics?.map((topic) => (
        <TopicItem key={topic.id} topic={topic} />
      ))}
    </section>
  );
}

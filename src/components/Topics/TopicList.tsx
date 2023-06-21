import React from 'react';

import TopicItem from './TopicItem';
import type { Topic } from '@/types/content-types';

export default function TopicsList({ topics }: { topics: Topic[]}) {
  console.log(topics);
  return (
    <>
      {topics?.map((topic) => (
        <TopicItem topic={topic} />
      ))}
    </>
  );
}

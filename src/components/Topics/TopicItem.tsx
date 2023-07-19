import React, { useEffect } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import Image from 'next/image';
import classes from '@/styles/topics/TopicItem.module.css';
import { Topic } from '@/types/content-types';
import { Paper } from '@mui/material';
export default function TopicItem({ topic }: { topic: Topic }) {
  const router = useRouter();
  const parentTopicSlug = router.query.topic;

  const topicUrl = parentTopicSlug ? `${parentTopicSlug}/${topic.slug}`: topic.slug;
  return (
    <Link className={classes.topic__item} href={topicUrl}>
      {topic?.image && (
        <div className={classes.topic__image}>
          <Image
            src={process.env.NEXT_PUBLIC_API + '/' + topic.image}
            alt={topic.title}
            fill={true}
            style={{ objectFit: 'cover' }}
            priority
          />
        </div>
      )}
      <div className={classes.topic__title}>{topic.title}</div>
    </div>
  );
}

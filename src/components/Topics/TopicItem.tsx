import React, { useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import Image from 'next/image';
import classes from '@/styles/topics/TopicItem.module.css';
import { Topic } from '@/types/content-types';


export default function TopicItem({ topic }: { topic: Topic }) {
  const router = useRouter();
  const parentTopicSlug = router.query.topic;

  const topicUrl = parentTopicSlug
    ? `${parentTopicSlug}/${topic.slug}`
    : topic.slug;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
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
      </Link>
      <Link href={topicUrl} className={classes.topic__title}>
        {topic.title}
      </Link>
    </div>
  );
}

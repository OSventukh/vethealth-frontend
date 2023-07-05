import React, { useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import classes from '@/styles/topics/TopicItem.module.css';
import { Topic } from '@/types/content-types';

export default function TopicItem({ topic }: { topic: Topic }) {
  return (
    <Link className={classes.topic__item} href={topic.slug}>
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
    </Link>
  );
}

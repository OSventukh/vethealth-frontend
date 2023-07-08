import React, { useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import classes from '@/styles/topics/TopicItem.module.css';
import { Topic } from '@/types/content-types';
import { Paper } from '@mui/material';
export default function TopicItem({ topic }: { topic: Topic }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column'}}>
      <Link className={classes.topic__item} href={topic.slug}>
        {topic?.image && (
          <div className={classes.topic__image}>
            <Image
              // src={process.env.NEXT_PUBLIC_API + '/' + topic.image}
              src={topic.image}
              alt={topic.title}
              fill
              style={{ objectFit: 'cover' }}
              priority
            />
          </div>
        )}
      </Link>
      <div className={classes.topic__title}>{topic.title}</div>
    </div>
  );
}

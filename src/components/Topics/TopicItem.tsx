import React, { useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Server } from '@/utils/constants/general.enum';
import classes from '@/styles/topics/TopicItem.module.css';
import { Topic } from '@/types/content-types';

export default function TopicItem({ topic }: { topic: Topic }) {
  return (
    <Link href={topic.slug}>
      <div className={classes.topic__item}>
        {topic?.image && (
          <Image
            src={Server.Api + '/' + topic.image}
            alt={topic.title}
            fill={true}
            style={{ objectFit: 'cover' }}
            priority
          />
        )}
      </div>
    </Link>
  );
}

import { cache } from 'react';
import { api } from '@/api';
import { TAGS } from '@/api/constants/tags';

export const getTopicBySlug = cache(async (slug: string, include = 'children') => {
  return api.topics.getOne({
    slug,
    query: { include },
    tags: [TAGS.TOPICS],
  });
});

export const getPostBySlug = cache(async (slug: string) => {
  return api.posts.getOne({
    slug,
    tags: [TAGS.POSTS],
  });
});

export const getCategoriesByTopic = cache(async (topic?: string) => {
  return api.categories.getMany({
    query: { include: 'children', topic },
    tags: [TAGS.CATEGORIES],
  });
});

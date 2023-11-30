import { z } from 'zod';

import { topicQuerySchema } from '@/utils/validators/query.validator';
import { PostResponse } from './posts.type';
import { CategoryResponse } from './categories.type';

export type TopicResponse = {
  id: string;
  title: string;
  image: string;
  description?: string;
  slug: string;
  contentType: string;
  createdAt: string;
  updatedAt?: string;
  status: 'Active' | 'Inactive';
  categories?: CategoryResponse[];
  posts?: PostResponse[];
  users?: [];
  parent?: TopicResponse[];
  children?: TopicResponse[];
};

export type TopicGetOneParams = {
  slug: string;
  token?: string;
};

export type TopicGetManyParams = {
  token?: string;
  query?: z.infer<typeof topicQuerySchema>;
};

import type { z } from 'zod';

import type { categoryQuerySchema } from '@/utils/validators/query.validator';
import type { PostResponse } from './posts.type';
import type { TopicResponse } from './topics.type';

export type CategoryResponse = {
  id: string;
  name: string;
  slug: string;
  createdAt: string;
  updatedAt?: string;
  topics?: TopicResponse[];
  posts?: PostResponse[];
  users?: [];
  parent?: CategoryResponse;
  children?: CategoryResponse[];
};

export type CategoryGetOneParams = {
  slug: string;
  query?: z.infer<typeof categoryQuerySchema>;
  token?: string;
  revalidate?: number | false;
  tags?: string[];
};

export type CategoryGetManyParams = {
  token?: string;
  query?: z.infer<typeof categoryQuerySchema>;
  revalidate?: number | false;
  tags?: string[];
};

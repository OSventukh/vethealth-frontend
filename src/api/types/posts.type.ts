import { z } from 'zod';

import { postQuerySchema } from '@/utils/validators/query.validator';
import { TopicResponse } from './topics.type';
import { CategoryResponse } from './categories.type';

export type PostResponse = {
  id: string;
  title: string;
  content: string;
  slug: string;
  featuredImage: string | null;
  featuredImageFile?: {
    id: string;
    path: string;
  } | null;
  featuredImageUrl?: string | null;
  createdAt: string;
  updatedAt?: string;
  status?: 'Draft' | 'Published';
  topics?: TopicResponse[];
  categories?: CategoryResponse[];
};

export type PostGetOneParams = {
  slug: string;
  token?: string;
  query?: z.infer<typeof postQuerySchema>;
  revalidate?: number | false;
  tags?: string[];
};

export type PostGetManyParams = {
  token?: string;
  query?: z.infer<typeof postQuerySchema>;
  revalidate?: number | false;
  tags?: string[];
};

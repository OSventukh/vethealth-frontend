import { z } from 'zod';

import { topicQuerySchema } from '@/utils/validators/query.validator';
import type { PostResponse } from './posts.type';
import type { CategoryResponse } from './categories.type';
import type { Image, Status } from './general.type';
import { PageResponse } from './pages.type';

export type TopicResponse = {
  id: string;
  title: string;
  image: Image;
  description?: string;
  slug: string;
  contentType: 'post' | 'page';
  createdAt: string;
  updatedAt?: string;
  status: Status;
  categories?: CategoryResponse[];
  page?: PageResponse;
  posts?: PostResponse[];
  users?: [];
  parent?: TopicResponse;
  children?: TopicResponse[];
};

export type TopicGetOneParams = {
  slug: string;
  token?: string;
  query?: z.infer<typeof topicQuerySchema>;
  revalidate?: number | false;
  tags?: string[];
};

export type TopicGetManyParams = {
  token?: string;
  query?: z.infer<typeof topicQuerySchema>;
  revalidate?: number | false;
  tags?: string[];
};

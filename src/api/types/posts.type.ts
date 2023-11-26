import { postQuerySchema } from '@/utils/validators/query.validator';
import { z } from 'zod';

export type PostResponse = {
  id: string;
  title: string;
  content: string;
  slug: string;
  featuredImage: string | null;
  createdAt: string;
  updatedAt?: string;
  status?: 'Draft' | 'Published';
};

export type PostGetOneParams = {
  slug: string;
  token?: string;
};

export type PostGetManyParams = {
  token?: string;
  query?: z.infer<typeof postQuerySchema>;
};

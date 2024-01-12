import { z } from 'zod';

import { postQuerySchema } from '@/utils/validators/query.validator';

export type PageResponse = {
  id: string;
  title: string;
  content: string;
  slug: string;
  featuredImage: string | null;
  createdAt: string;
  updatedAt?: string;
  status?: 'Draft' | 'Published';
};

export type PageGetOneParams = {
  slug: string;
  token?: string;
  query?: z.infer<typeof postQuerySchema>;
  revalidate?: number | false;
  tags?: string[];
};

export type PageGetManyParams = {
  token?: string;
  query?: z.infer<typeof postQuerySchema>;
  revalidate?: number | false;
  tags?: string[];
};

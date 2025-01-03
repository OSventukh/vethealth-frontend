import { z } from 'zod';

const sortQuerySchema = z.enum(['desc', 'asc']);
const pageQuerySchema = z.coerce.number().positive();
const sizeQuerySchema = z.coerce.number().positive();

export const postQuerySchema = z.object({
  page: pageQuerySchema.optional(),
  size: sizeQuerySchema.optional(),
  orderBy: z.enum(['status', 'createAt']).optional(),
  sort: sortQuerySchema.optional(),
  status: z.enum(['all', 'published', 'draft', 'onreview']).optional(),
  title: z.string().optional(),
  category: z.string().optional(),
  topic: z.string().optional(),
  include: z.string().optional(),
});

export const topicQuerySchema = z.object({
  page: pageQuerySchema.optional(),
  size: sizeQuerySchema.optional(),
  orderBy: z.enum(['status', 'createAt']).optional(),
  sort: sortQuerySchema.optional(),
  title: z.string().optional(),
  include: z.string().optional(),
  showAll: z.boolean().optional(),
});

export const categoryQuerySchema = z.object({
  page: pageQuerySchema.optional(),
  size: sizeQuerySchema.optional(),
  topic: z.string().optional(),
  orderBy: z.enum(['status', 'createAt']).optional(),
  sort: sortQuerySchema.optional(),
  name: z.string().optional(),
  include: z.string().optional(),
  showAll: z.boolean().optional(),
});

export const userQuerySchema = z.object({
  page: pageQuerySchema.optional(),
  size: sizeQuerySchema.optional(),
  orderBy: z.enum(['status', 'createAt']).optional(),
  sort: sortQuerySchema.optional(),
  firstname: z.string().optional(),
  include: z.string().optional(),
});

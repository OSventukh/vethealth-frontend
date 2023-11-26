import { z } from 'zod';

const sortQuerySchema = z.enum(['desc', 'asc']);
const pageQuerySchema = z.coerce.number().positive();
const sizeQuerySchema = z.coerce.number().positive();

export const postQuerySchema = z.object({
  page: pageQuerySchema.optional(),
  size: sizeQuerySchema.optional(),
  orderBy: z.enum(['status', 'createAt']).optional(),
  sort: sortQuerySchema.optional(),
  title: z.string().optional(),
});

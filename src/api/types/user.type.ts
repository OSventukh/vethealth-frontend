import { userQuerySchema } from '@/utils/validators/query.validator';
import { z } from 'zod';
import { PostResponse } from './posts.type';
import { TopicResponse } from './topics.type';
import { Status } from './general.type';

export type UserResponse = {
  id: string;
  firstname: string;
  lastname?: string;
  email: string;
  role: Role;
  status: Status;
  posts?: PostResponse[];
  topics?: TopicResponse[];
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date;
};

export type Role = {
  id: string;
  name: string;
};

export type UserGetOneParams = {
  id: string;
  token?: string;
  query?: z.infer<typeof userQuerySchema>;
  revalidate?: number | false;
  tags?: string[];
};

export type UserGetManyParams = {
  token?: string;
  query?: z.infer<typeof userQuerySchema>;
  revalidate?: number | false;
  tags?: string[];
};

export type SearchParams = {
  query: string;
  revalidate?: number | false;
  tags?: string[];
};

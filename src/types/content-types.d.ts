import { TopicContent } from '@/utils/constants/content.enum';
import { UserRole } from '@/utils/constants/users.enum';

export type PaginateData = {
  count: number;
  currentPage: number;
  totalPages: number;
};

export type Category = {
  id: string;
  name: string;
  slug: string;
  parentId: string;
  parent?: Category;
  children?: Category[];
};

export type Topic = {
  id: string;
  title: string;
  slug: string;
  image: string;
  status: 'active' | 'inactive';
  description: string;
  posts?: Post[];
  categories?: Category[];
  parentId: string;
  parent?: Topic;
  children?: Topic[];
  page?: Page;
  content: TopicContent;
};

export type Page = {
  id: string;
  title: string;
  content: string;
  slug: string;
  status: 'published' | 'draft';
};

export type Post = {
  id: string;
  content: string;
  title: string;
  excerpt: string;
  slug: string;
  categories: Category[] | null;
  topics: Topic[] | null;
  status: 'published' | 'draft';
};

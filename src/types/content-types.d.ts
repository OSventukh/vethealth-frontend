import { TopicContent } from "@/utils/constants/content.enum";
export type Category = {
  id: number;
  name: string;
  slug: string;
  parentId: number;
  parent?: Category;
  children?: Category[];
}

export type Topic = {
  id: number;
  title: string;
  slug: string;
  image: string;
  status: 'active' | 'inactive';
  description: string;
  posts?: Post[];
  categories?: Category[];
  parentId: number;
  parent?: Topic;
  children?: Topic[];
  page?: Page;
  content: TopicContent;
}

export type Page = {
  id: number;
  title: string;
  content: string;
  slug: string;
  status: 'published' | 'draft';
}

export type Post = {
  id: number;
  content: string;
  title: string;
  excerpt: string;
  slug: string;
  categories: Category[] | null;
  topics: Topic[] | null;
  status: 'published' | 'draft';
}
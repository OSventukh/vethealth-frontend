export type Category = {
  id: number;
  name: string;
  parentId: number;
  parent?: Category;
  children?: Category[];
}

export type Topic = {
  id: number;
  title: string;
  slug: string;
  image: string;
  parentId: number;
  parent?: Topic;
  children?: Topic[];
}

export type Page = {
  id: number;
  title: string;
  parentId: number;
  parent: Page;
  children: Page[];
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
export type PostResponse = {
  title: string;
  content: string;
  slug: string;
  featuredImage: string | null;
  createdAt: string;
  updatedAt?: string;
  status?: 'Draft' | 'Published';
};

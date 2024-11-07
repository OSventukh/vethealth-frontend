import React from 'react';
import EditTopic from '../../components/EditTopic';
import { api } from '@/api';
import { auth } from '@/lib/next-auth/auth';

type Props = {
  params: Promise<{ slug: string }>;
};
export default async function EditTopicPage(props: Props) {
  const params = await props.params;
  const session = await auth();
  const { slug } = params;
  const topic = await api.topics.getOne({
    slug,
    token: session?.token,
    query: { include: 'parent,categories,children' },
  });
  const categories = await api.categories.getMany({ tags: ['categories'] });
  const topics = await api.topics.getMany({
    tags: ['topics'],
    query: { include: 'categories' },
  });
  const pages = await api.pages.getMany({ tags: ['pages'] });

  return (
    <EditTopic
      initialData={topic}
      categories={categories?.items || []}
      topics={topics?.items || []}
      pages={pages?.items || []}
      editMode
    />
  );
}

import React from 'react';
import EditTopic from '../../components/EditTopic';
import { api } from '@/api';
import { auth } from '@/lib/next-auth/auth';

type Props = {
  params: { slug: string };
};
export default async function EditTopicPage({ params }: Props) {
  const session = await auth();
  const { slug } = params;
  const topic = await api.topics.getOne({
    slug,
    token: session?.token,
    query: { include: 'parent,categories,children' },
  });
  const categories = await api.categories.getMany({});
  const topics = await api.topics.getMany({});
  return (
    <EditTopic
      initialData={topic}
      categories={categories.items}
      topics={topics.items}
      editMode
    />
  );
}
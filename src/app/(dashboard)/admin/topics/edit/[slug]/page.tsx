import EditTopic from '../../components/EditTopic';
import { api } from '@/api';
import { auth } from '@/lib/next-auth/auth';

type Props = {
  params: Promise<{ slug: string }>;
};
export default async function EditTopicPage(props: Props) {
  const [params, session] = await Promise.all([props.params, auth()]);
  const { slug } = params;
  const [topic, categories, topics, pages] = await Promise.all([
    api.topics.getOne({
      slug,
      token: session?.token,
      query: { include: 'parent,categories,children' },
    }),
    api.categories.getMany({ tags: ['categories'] }),
    api.topics.getMany({
      tags: ['topics'],
      query: { include: 'categories' },
    }),
    api.pages.getMany({ tags: ['pages'] }),
  ]);

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

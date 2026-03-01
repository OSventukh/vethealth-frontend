import { api } from '@/api';
import { auth } from '@/lib/next-auth/auth';
import EditPost from '../../components/EditPost';

type Props = { params: Promise<{ slug: string }> };

export default async function EditPostPage(props: Props) {
  const [params, session] = await Promise.all([props.params, auth()]);

  const { slug } = params;
  const [post, topics, categories] = await Promise.all([
    api.posts.getOne({
      slug,
      query: { include: 'categories,topics' },
      token: session?.token,
    }),
    api.topics.getMany({
      query: { showAll: true },
      tags: ['topics'],
    }),
    api.categories.getMany({
      query: { showAll: true },
      tags: ['categories'],
    }),
  ]);

  return (
    <EditPost
      initialData={post}
      topics={topics?.items}
      categories={categories?.items}
      editMode
      user={session?.user}
    />
  );
}

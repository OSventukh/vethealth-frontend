import { useCallback } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import dynamic from 'next/dynamic';
import { usePostData } from '@/hooks/data-hook';
import { SnackError, SnackSuccess } from '@/components/admin/UI/SnackBar';
import usePost from '@/hooks/editor-hook';
import Loading from '@/components/admin/UI/Loading';
const Editor = dynamic(() => import('@/components/admin/Editor'), {
  ssr: false,
  loading: () => <Loading />
});

export default function NewPostPage() {
  const router = useRouter()
  const {
    title,
    content,
    slug,
    topics,
    categories,
    titleChangeHandler,
    contentChangeHandler,
    slugChangeHandler,
    topicsChangeHandler,
    categoriesChangeHandler,
    errorMessage,
    setErrorMessage,
    successMessage,
    setSuccessMessage,
  } = usePost();

  const { trigger } = usePostData('posts');

  const editorSaveHandler = useCallback(
    async (status: 'published' | 'draft') => {
      setErrorMessage('');
      setSuccessMessage('');

      if (!topics || topics.length === 0) {
        setErrorMessage('Please select a post topic')
        return;
      }

      if (!categories || categories.length === 0) {
        setErrorMessage('Please select a post category')
        return;
      }

      try {
        const response = await trigger({
          method: 'POST',
          data: {
            title,
            content,
            slug,
            categoryId: categories?.map((category) => category.id),
            topicId: topics?.map((topic) => topic.id),
            status: status,
          },
        });
        setSuccessMessage(response?.message ?? 'Post saved successfully');
        setTimeout(() => {
          router.push(`/admin/posts/[postId]`, `/admin/posts/${response.post.id}`, {
            shallow: true,
          })
        }, 2000)
      } catch (error) {
        setErrorMessage(
          error instanceof Error ? error.message : 'Saving post failed'
        );
      }
    },
    [trigger, title, content, slug, categories, topics, setErrorMessage, setSuccessMessage, router]
  );

  return (
    <>
      <Head>
        <title>Create Post</title>
      </Head>
      <>
        <Editor
          onSave={editorSaveHandler}
          content={content}
          title={title}
          slug={slug}
          topics={topics}
          categories={categories}
          titleChangeHandler={titleChangeHandler}
          contentChangeHandler={contentChangeHandler}
          slugChangeHandler={slugChangeHandler}
          topicsChangeHandler={topicsChangeHandler}
          categoriesChangeHandler={categoriesChangeHandler}
        />

        <SnackError
          open={!!errorMessage}
          onClose={() => setErrorMessage(null)}
          content={errorMessage}
        />

        <SnackSuccess
          open={!!successMessage}
          onClose={() => setSuccessMessage(null)}
          content={successMessage}
        />
      </>
    </>
  );
}

import { useCallback } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Loading from '@/components/admin/UI/Loading';

import dynamic from 'next/dynamic';
import { usePostData, useGetData } from '@/hooks/data-hook';
import { SnackError, SnackSuccess } from '@/components/admin/UI/SnackBar';
import usePost from '@/hooks/post-hook';

const Editor = dynamic(() => import('@/components/admin/Editor'), {
  ssr: false,
  loading: () => <Loading />
});

export default function EditPostPage() {

  const router = useRouter();
  const postId = router.query.postId;

  const { data, isLoading } = useGetData(
    `posts/${postId}?include=categories,topics`
  );
  const {
    content,
    slug,
    topics,
    categories,
    contentChangeHandler,
    slugChangeHandler,
    topicsChangeHandler,
    categoriesChangeHandler,
    errorMessage,
    setErrorMessage,
    successMessage,
    setSuccessMessage,
  } = usePost({
    initCategories: data?.posts[0]?.categories,
    initTopics: data?.posts[0]?.topics,
    initContent: data?.posts[0]?.title && `<h1>${data?.posts[0]?.title}</h1>${data?.posts[0]?.content}`,
    initSlug: data?.posts[0]?.slug,
  });

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
          method: 'PATCH',
          data: {
            id: postId,
            rawContent: content,
            slug: slug,
            categoryId: categories?.map((category) => category.id),
            topicId: topics?.map((topic) => topic.id),
            status: status,
          },
        });
        setSuccessMessage(response?.message ?? 'Post saved successfully');
      } catch (error) {
        setErrorMessage(
          error instanceof Error ? error.message : 'Saving post failed'
        );
      }
    },
    [trigger, categories, topics, content, slug, postId, setErrorMessage, setSuccessMessage]
  );

  return (
    <>
      <Head>
        <title>Update Post</title>
      </Head>
      <>
        <Editor
          onSave={editorSaveHandler}
          content={content}
          slug={slug}
          topics={topics}
          categories={categories}
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

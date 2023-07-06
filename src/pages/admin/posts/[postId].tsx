import { useCallback } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Loading from '@/components/admin/UI/Loading';

import dynamic from 'next/dynamic';
import { usePostData, useGetData } from '@/hooks/data-hook';
import { SnackError, SnackSuccess } from '@/components/admin/UI/SnackBar';
import usePost from '@/hooks/editor-hook';
import type { Post } from '@/types/content-types';

const Editor = dynamic(() => import('@/components/admin/Editor'), {
  ssr: false,
  loading: () => <Loading />
});

export default function EditPostPage() {

  const router = useRouter();
  const postId = router.query.postId;

  const { data, isLoading } = useGetData<{ post: Post }>(
    `posts/${postId}?include=categories,topics`
  );
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
  } = usePost({
    initTitle: data?.post?.title,
    initCategories: data?.post?.categories,
    initTopics: data?.post?.topics,
    initContent:data?.post?.content,
    initSlug: data?.post?.slug,
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

      try {
        const response = await trigger({
          method: 'PATCH',
          data: {
            id: postId,
            title,
            content,
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
    [trigger, categories, topics, title, content, slug, postId, setErrorMessage, setSuccessMessage]
  );

  return (
    <>
      <Head>
        <title>Update Post</title>
      </Head>
      <>
        <Editor
          onSave={editorSaveHandler}
          title={title}
          content={content}
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

import { useState, useContext } from 'react';
import Head from 'next/head';
import dynamic from 'next/dynamic';
import { usePostData } from '@/hooks/data-hook';
import type { EditorValue } from '@/types/editor-types';
import AuthContext from '@/context/auth-context';
import { SnackError, SnackSuccess } from '@/components/admin/UI/SnackBar';

export default function NewPostPage() {
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const { accessToken } = useContext(AuthContext);
  const Editor = dynamic(() => import('@/components/admin/Editor/Index'), {
    ssr: false,
  });

  const { trigger } = usePostData('posts');

  const editorSaveHandler = async (value: EditorValue) => {
    try {
      const response = await trigger({
        method: 'POST',
        token: accessToken,
        data: {
          rawContent: value.content,
          slug: value.slug,
          categoryId: value.categories,
          topicId: value.topics,
          status: value.status,
        },
      });
      setSuccessMessage(response?.message ?? 'Post saved successfully');
    } catch (error) {
      setErrorMessage(
        error instanceof Error ? error.message : 'Saving post failed'
      );
    }
  };

  return (
    <>
      <Head>
        <title>Create Post</title>
      </Head>
      <>
        {errorMessage && (
          <SnackError
            open={true}
            onClose={() => setErrorMessage(null)}
            content={errorMessage}
          />
        )}
        {successMessage && (
          <SnackSuccess
            open={true}
            onClose={() => setSuccessMessage(null)}
            content={successMessage}
          />
        )}
        <Editor onSave={editorSaveHandler} />
      </>
    </>
  );
}

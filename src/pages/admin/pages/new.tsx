import { useCallback } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import dynamic from 'next/dynamic';
import { usePostData } from '@/hooks/data-hook';
import { SnackError, SnackSuccess } from '@/components/admin/UI/SnackBar';
import useEditor from '@/hooks/editor-hook';
import Loading from '@/components/admin/UI/Loading';
const Editor = dynamic(() => import('@/components/admin/Editor'), {
  ssr: false,
  loading: () => <Loading />
});

export default function NewPagePage() {
  const router = useRouter()
  const {
    title,
    content,
    slug,

    titleChangeHandler,
    contentChangeHandler,
    slugChangeHandler,

    categoriesChangeHandler,
    errorMessage,
    setErrorMessage,
    successMessage,
    setSuccessMessage,
  } = useEditor();

  const { trigger } = usePostData('pages');

  const editorSaveHandler = useCallback(
    async (status: 'published' | 'draft') => {
      setErrorMessage('');
      setSuccessMessage('');


      try {
        const response = await trigger({
          method: 'POST',
          data: {
            title,
            content,
            description: 'test',
            slug,
            status: status,
          },
        });
        setSuccessMessage(response?.message || 'Post saved successfully');
        setTimeout(() => {
          router.push(`/admin/pages/[pageId]`, `/admin/pages/${response.page.id}`, {
            shallow: true,
          })
        }, 2000)
      } catch (error) {
        setErrorMessage(
          error instanceof Error ? error.message : 'Saving post failed'
        );
      }
    },
    [trigger, title, content, slug, setErrorMessage, setSuccessMessage, router]
  );

  return (
    <>
      <Head>
        <title>Create Page</title>
      </Head>
      <>
        <Editor
          onSave={editorSaveHandler}
          content={content}
          title={title}
          slug={slug}
          titleChangeHandler={titleChangeHandler}
          contentChangeHandler={contentChangeHandler}
          slugChangeHandler={slugChangeHandler}
          categoriesChangeHandler={categoriesChangeHandler}
          isPage
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

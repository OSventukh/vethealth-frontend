import { useCallback } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import dynamic from 'next/dynamic';
import { usePostData, useGetData } from '@/hooks/data-hook';
import { SnackError, SnackSuccess } from '@/components/admin/UI/SnackBar';
import useEditor from '@/hooks/editor-hook';
import Loading from '@/components/admin/UI/Loading';
import type { Page } from '@/types/content-types';
import { GetServerSidePropsContext } from 'next';
import { getServerSession } from 'next-auth';
import { nextAuthOptions } from '@/pages/api/auth/[...nextauth]';
import { UserRole } from '@/utils/constants/users.enum';
import { General } from '@/utils/constants/general.enum';

const Editor = dynamic(() => import('@/components/admin/Editor'), {
  ssr: false,
  loading: () => <Loading />,
});

export default function EditPagePage() {
  const router = useRouter();
  const pageId = router.query.pageId;

  const { data, isLoading } = useGetData<{ page: Page}>(
    `pages/${pageId}`
  );

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
  } = useEditor({
    initTitle: data?.page?.title,
    initContent: data?.page?.content,
    initSlug: data?.page?.slug,
  });

  const { trigger } = usePostData('pages');

  const editorSaveHandler = useCallback(
    async (status: 'published' | 'draft') => {
      setErrorMessage('');
      setSuccessMessage('');

      try {
        const response = await trigger({
          method: 'PATCH',
          data: {
            id: pageId,
            title,
            content,
            description: 'test',
            slug,
            status: status,
          },
        });
        setSuccessMessage(response?.message || 'Post saved successfully');
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
        <title>{`Update Page | ${General.SiteTitle}`}</title>
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

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const session = await getServerSession(
    context.req,
    context.res,
    nextAuthOptions
  );
  
  if (
    session &&
    (session?.user?.role !== UserRole.SuperAdmin &&
      session?.user?.role !== UserRole.Admin)
  ) {
    return {
      redirect: {
        destination: '/admin',
        permanent: false,
      },
    };
  }
  return {
    props: {
      session: session,
    },
  };
}
import { FormEvent } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import dynamic from 'next/dynamic';
import Loading from '@/components/admin/UI/Loading';
import { GetServerSidePropsContext } from 'next';
import { getServerSession } from 'next-auth';
import { nextAuthOptions } from '@/pages/api/auth/[...nextauth]';
import { UserRole } from '@/utils/constants/users.enum';
import { General } from '@/utils/constants/general.enum';

const EditCategory = dynamic(
  () => import('@/components/admin/Category/EditCategory'),
  {
    loading: () => <Loading />,
    ssr: false,
  }
);

import useCategory from '@/hooks/category-hook';
import { usePostData, useGetData } from '@/hooks/data-hook';
import { useSWRConfig } from 'swr';
import type { Category } from '@/types/content-types';

export default function EditCategoryPage() {
  const router = useRouter();
  const categoryId = router.query.categoryId;

  const { mutate } = useSWRConfig();
  const { trigger } = usePostData('categories');

  const { data } = useGetData<{ category: Category }>(
    `categories/${categoryId}?include=parent,children`
  );

  const {
    name,
    slug,
    parentCategory,
    clearInputs,
    nameChangeHandler,
    slugChangeHandler,
    parentCategoryChangeHandler,
    successMessage,
    errorMessage,
    setErrorMessage,
    setSuccessMessage,
  } = useCategory({
    initName: data?.category?.name,
    initSlug: data?.category?.slug,
    initParentCategory: data?.category?.parent,
  });

  const getDataHandler = async (event: FormEvent) => {
    event.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);
    if (!name || name.trim().length == 0) {
      setErrorMessage('Title should not be an empty');
      return;
    }

    try {
      const response = await trigger({
        method: 'PATCH',
        data: {
          id: categoryId,
          name,
          slug,
          parentId: parentCategory?.id,
        },
      });
      clearInputs();
      mutate(
        (key: any) =>
          key &&
          typeof key === 'object' &&
          'key' in key &&
          key.key === '#categories',
        undefined,
        { revalidate: false }
      );
      setSuccessMessage(response.message);
    } catch (error) {
      setErrorMessage(
        error instanceof Error ? error.message : 'Something went wrong'
      );
    }
  };
  return (
    <>
      <Head>
        <title>{`Update Category | ${General.SiteTitle}`}</title>
      </Head>
      <EditCategory
        id={categoryId?.toString()}
        edit
        categorySubmitHandler={getDataHandler}
        name={name}
        slug={slug}
        parentCategory={parentCategory}
        childrenCategory={data?.category?.children}
        nameChangeHandler={nameChangeHandler}
        slugChangeHandler={slugChangeHandler}
        parentCategoryChangeHandler={parentCategoryChangeHandler}
        errorMessage={errorMessage}
        successMessage={successMessage}
      />
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

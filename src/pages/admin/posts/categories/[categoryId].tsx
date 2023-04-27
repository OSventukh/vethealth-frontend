import { FormEvent, useContext } from 'react';
import { useRouter } from 'next/router';
import dynamic from 'next/dynamic';
import CircularProgress from '@mui/material/CircularProgress';

const EditCategory = dynamic(() => import('@/components/admin/Category'), {
  loading: () => <CircularProgress />,
  ssr: false,
})
import AuthContext from '@/context/auth-context';
import useCategory from '@/hooks/category-hook';
import { usePostData, useGetData } from '@/hooks/data-hook';
import { useSWRConfig } from 'swr';

export default function EditCategoryPage() {
  const router = useRouter();
  const categoryId = router.query.categoryId;

  const { mutate } = useSWRConfig();
  const { trigger } = usePostData('categories');

  const { data } = useGetData(`categories/${categoryId}?include=parent`);

  const { accessToken } = useContext(AuthContext);
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
    initName: data?.categories[0]?.name,
    initSlug: data?.categories[0]?.slug,
    initParentCategory: data?.categories[0]?.parent,
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
        token: accessToken,
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
    <EditCategory
      edit
      categorySubmitHandler={getDataHandler}
      name={name}
      slug={slug}
      parentCategory={parentCategory}
      nameChangeHandler={nameChangeHandler}
      slugChangeHandler={slugChangeHandler}
      parentCategoryChangeHandler={parentCategoryChangeHandler}
      errorMessage={errorMessage}
      successMessage={successMessage}
    />
  );
}

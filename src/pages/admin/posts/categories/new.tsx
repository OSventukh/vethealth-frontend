import { FormEvent, useContext } from 'react';
import dynamic from 'next/dynamic';
import Loading from '@/components/admin/UI/Loading';

const EditCategory = dynamic(() => import('@/components/admin/Category'), {
  loading: () => <Loading />,
  ssr: false,
})

import useCategory from '@/hooks/category-hook';
import { usePostData } from '@/hooks/data-hook';
import { useSWRConfig } from 'swr';

export default function NewCategoryPage() {
  const { mutate } = useSWRConfig();
  const { trigger } = usePostData('categories');

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
  } = useCategory();

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
        method: 'POST',
        data: {
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
    <EditCategory
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

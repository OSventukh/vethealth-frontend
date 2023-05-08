import { useRouter } from 'next/router';
import { FormEvent, useContext } from 'react';
import dynamic from 'next/dynamic';
import Loading from '@/components/admin/UI/Loading';
import { useSWRConfig } from 'swr';
import AuthContext from '@/context/auth-context';
import useTopic from '@/hooks/topic-hook';
import { usePostData, useGetData } from '@/hooks/data-hook';

const EditTopic = dynamic(() => import('@/components/admin/Topics'), {
  ssr: false,
  loading: () => <Loading />,
});

export default function EditTopicPage() {
  const router = useRouter();
  const { topicId } = router.query;
  const { data, isLoading } = useGetData(
    `topics/${topicId}?include=categories,parent`,
    {
      revalidation: false,
    }
  );
  const { mutate } = useSWRConfig();
  const { trigger } = usePostData(`topics/${topicId}`);
  const { accessToken } = useContext(AuthContext);
  const {
    title,
    description,
    slug,
    activeStatus,
    image,
    categories,
    parentTopic,
    titleChangeHandler,
    descriptionChangeHandler,
    slugChangeHandler,
    categoryChangeHandler,
    parentTopicChangeHandler,
    setActiveStatus,
    setImage,
    errorMessage,
    successMessage,
    setErrorMessage,
    setSuccessMessage,
  } = useTopic({
    initTitle: data?.topics[0]?.title,
    initSlug: data?.topics[0]?.slug,
    initDescription: data?.topics[0]?.description,
    initActiveStatus: data?.topics[0]?.status === 'active',
    initImage: data?.topics[0]?.image,
    initCategories: data?.topics[0]?.categories,
    initParentTopic: data?.topics[0]?.parent,
  });

  const getDataHandler = async (event: FormEvent) => {
    event.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);
    const formData = new FormData();
    title && formData.append('title', title.trim());
    slug && formData.append('slug', slug.trim());
    description && formData.append('description', description.trim());
    parentTopic && formData.append('parentId', parentTopic.id.toString());
    categories &&
      categories.length > 0 &&
      categories.forEach((category) =>
        formData.append('categoryId', category.id.toString())
      );
    formData.append('status', activeStatus ? 'active' : 'inactive');
    image instanceof File && formData.append('topic-image', image);
    image === '' && formData.append('image', image);
    try {
      const response = await trigger({
        method: 'PATCH',
        data: formData,
        token: accessToken,
      });
      mutate(
        (key: any) =>
          key &&
          typeof key === 'object' &&
          'key' in key &&
          key.key === '#topics',
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
    <EditTopic
      topicSubmitHandler={getDataHandler}
      title={title}
      slug={slug}
      description={description}
      categories={categories}
      parentTopic={parentTopic}
      activeStatus={activeStatus}
      image={image}
      titleChangeHandler={titleChangeHandler}
      slugChangeHandler={slugChangeHandler}
      descriptionChangeHandler={descriptionChangeHandler}
      categoryChangeHandler={categoryChangeHandler}
      parentTopicChangeHandler={parentTopicChangeHandler}
      setActiveStatus={setActiveStatus}
      setImage={setImage}
      errorMessage={errorMessage}
      successMessage={successMessage}
      edit
    />
  );
}

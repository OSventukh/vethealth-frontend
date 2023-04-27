import { FormEvent, useContext } from 'react';
import dynamic from 'next/dynamic';
import CircularProgress from '@mui/material/CircularProgress';
import AuthContext from '@/context/auth-context';
import useTopic from '@/hooks/topic-hook';
import { usePostData } from '@/hooks/data-hook';
import { useSWRConfig } from 'swr';

const EditTopic = dynamic(() => import('@/components/admin/Topics/EditTopic'), {
  ssr: false,
  loading: () => <CircularProgress />
});

export default function NewTopicPage() {
  const { mutate } = useSWRConfig();
  const { trigger } = usePostData('topics');
  const { accessToken } = useContext(AuthContext);
  const {
    title,
    description,
    slug,
    activeStatus,
    image,
    clearInputs,
    titleChangeHandler,
    descriptionChangeHandler,
    slugChangeHandler,
    setActiveStatus,
    setImage,
    successMessage,
    errorMessage,
    setErrorMessage,
    setSuccessMessage,
  } = useTopic();

  const getDataHandler = async (event: FormEvent) => {
    event.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);
    if (!title || title.trim().length == 0) {
      setErrorMessage('Title should not be an empty');
      return;
    }
    const formData = new FormData();
    title && formData.append('title', title.trim());
    slug && formData.append('slug', slug.trim());
    description && formData.append('description', description.trim());
    formData.append('status', activeStatus ? 'active' : 'inactive');
    image && formData.append('topic-image', image);

    try {
      const response = await trigger({
        method: 'POST',
        data: formData,
        token: accessToken,
      });
      clearInputs();
      mutate(
        (key: any) => key && typeof key === 'object' && 'key' in key && key.key === '#topics',
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
      activeStatus={activeStatus}
      image={image}
      titleChangeHandler={titleChangeHandler}
      slugChangeHandler={slugChangeHandler}
      descriptionChangeHandler={descriptionChangeHandler}
      setActiveStatus={setActiveStatus}
      setImage={setImage}
      errorMessage={errorMessage}
      successMessage={successMessage}
    />
  );
}

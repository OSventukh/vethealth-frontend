import { FormEvent, useContext } from 'react';
import dynamic from 'next/dynamic';
import Head from 'next/head';
import Loading from '@/components/admin/UI/Loading';
import useTopic from '@/hooks/topic-hook';
import { usePostData } from '@/hooks/data-hook';
import { useSWRConfig } from 'swr';
import { GetServerSidePropsContext } from 'next';
import { getServerSession } from 'next-auth';
import { nextAuthOptions } from '@/pages/api/auth/[...nextauth]';
import { UserRole } from '@/utils/constants/users.enum';
import { General } from '@/utils/constants/general.enum';

const EditTopic = dynamic(() => import('@/components/admin/Topics/EditTopic'), {
  ssr: false,
  loading: () => <Loading />,
});

export default function NewTopicPage() {
  const { mutate } = useSWRConfig();
  const { trigger } = usePostData('topics');
  const {
    title,
    description,
    slug,
    activeStatus,
    image,
    categories,
    parentTopic,
    content,
    page,
    contentChangeHandler,
    pageChangeHandler,
    clearInputs,
    titleChangeHandler,
    descriptionChangeHandler,
    categoryChangeHandler,
    parentTopicChangeHandler,
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
    parentTopic && formData.append('parentId', parentTopic.id.toString());
    categories &&
      formData.append(
        'categoryId',
        JSON.stringify(categories.map((categories) => categories.id))
      );
    image && formData.append('topic-image', image);
    content && formData.append('content', content);
    page && formData.append('pageId', page.id.toString());

    try {
      const response = await trigger({
        method: 'POST',
        data: formData,
      });
      clearInputs();
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
    <>
      <Head>
        <title>{`New Topic | ${General.SiteTitle}`}</title>
      </Head>
      <EditTopic
        topicSubmitHandler={getDataHandler}
        title={title}
        slug={slug}
        description={description}
        activeStatus={activeStatus}
        image={image}
        categories={categories}
        parentTopic={parentTopic}
        content={content}
        page={page}
        contentChangeHandler={contentChangeHandler}
        pageChangeHandler={pageChangeHandler}
        titleChangeHandler={titleChangeHandler}
        slugChangeHandler={slugChangeHandler}
        descriptionChangeHandler={descriptionChangeHandler}
        categoryChangeHandler={categoryChangeHandler}
        parentTopicChangeHandler={parentTopicChangeHandler}
        setActiveStatus={setActiveStatus}
        setImage={setImage}
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

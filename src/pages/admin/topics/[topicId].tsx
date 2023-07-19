import Head from 'next/head';
import { useRouter } from 'next/router';
import { FormEvent, useMemo } from 'react';
import dynamic from 'next/dynamic';
import Loading from '@/components/admin/UI/Loading';
import { useSWRConfig } from 'swr';
import useTopic from '@/hooks/topic-hook';
import { usePostData, useGetData } from '@/hooks/data-hook';
import type { Topic, Category } from '@/types/content-types';
import { GetServerSidePropsContext } from 'next';
import { getServerSession } from 'next-auth';
import { nextAuthOptions } from '@/pages/api/auth/[...nextauth]';
import { UserRole } from '@/utils/constants/users.enum';
import { General } from '@/utils/constants/general.enum';

const EditTopic = dynamic(() => import('@/components/admin/Topics/EditTopic'), {
  ssr: false,
  loading: () => <Loading />,
});

export default function EditTopicPage() {
  const router = useRouter();
  const { topicId } = router.query;
  const { data } = useGetData<{ topic: Topic }>(
    `topics/${topicId}?include=categories,parent,page,children`
  );

  const { mutate } = useSWRConfig();
  const { trigger } = usePostData(`topics/${topicId}`);

  const initTitle = data?.topic?.title;
  const initSlug = data?.topic?.slug;
  const initDescription = data?.topic?.description;
  const initActiveStatus = data?.topic?.status === 'active';
  const initImage = data?.topic?.image;
  //display only high level category
  const initCategories = useMemo(
    () =>
      data &&
      data?.topic?.categories &&
      data.topic.categories.filter(
        (category: Category) => category.parentId === null
      ),
    [data]
  );
  const initParentTopic = data?.topic?.parent;
  const initContent = data?.topic?.content;
  const initPage = data?.topic?.page;

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
    content,
    page,
    contentChangeHandler,
    pageChangeHandler,
    setImage,
    errorMessage,
    successMessage,
    setErrorMessage,
    setSuccessMessage,
  } = useTopic({
    initTitle,
    initSlug,
    initDescription,
    initActiveStatus,
    initImage,
    initCategories,
    initParentTopic,
    initContent,
    initPage,
  });

  const topicSubmitHandler = async (event: FormEvent) => {
    event.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);
    const formData = new FormData();
    title && formData.append('title', title.trim());
    slug && formData.append('slug', slug.trim());
    formData.append('description', description ? description.trim() : '');
    formData.append('parentId', parentTopic ? parentTopic.id.toString() : '');
    formData.append('content', content ? content : '');
    formData.append('pageId', page ? page.id.toString() : '');
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
    <>
      <Head>
        <title>{`Update Topic | ${General.SiteTitle}`}</title>
      </Head>
      <EditTopic
        id={topicId?.toString()}
        topicSubmitHandler={topicSubmitHandler}
        title={title}
        slug={slug}
        description={description}
        categories={categories}
        parentTopic={parentTopic}
        activeStatus={activeStatus}
        image={image}
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
        childrenTopic={data?.topic?.children}
        errorMessage={errorMessage}
        successMessage={successMessage}
        edit
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

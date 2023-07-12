import Head from 'next/head';
import dynamic from 'next/dynamic';
import useUser from '@/hooks/user-hook';
import { FormEvent } from 'react';
import { usePostData } from '@/hooks/data-hook';
import Loading from '@/components/admin/UI/Loading';
import { GetServerSidePropsContext } from 'next';
import { getServerSession } from 'next-auth';
import { nextAuthOptions } from '@/pages/api/auth/[...nextauth]';
import { UserRole } from '@/utils/constants/users.enum';
import { General } from '@/utils/constants/general.enum';

const EditUser = dynamic(() => import('@/components/admin/User/EditUser'), {
  loading: () => <Loading />,
  ssr: false,
});

export default function NewUserPage() {
  const {
    firstname,
    lastname,
    email,
    status,
    topics,
    role,
    firstnameChangeHandler,
    lastnameChangeHandler,
    emailChangeHandler,
    statusChangeHandler,
    topicsChangeHandler,
    roleChangeHandler,
    errorMessage,
    successMessage,
    setErrorMessage,
    setSuccessMessage,
  } = useUser();

  const { trigger } = usePostData('users');
  const userSubmitHandler = async (event: FormEvent) => {
    event.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);
    try {
      const response = await trigger({
        method: 'POST',
        data: {
          firstname,
          lastname,
          email,
          status,
          topicId: topics?.map((topic) => topic.id),
          roleId: role?.id,
        },
      });
      setSuccessMessage(response?.message || 'User was successfull created');
    } catch (error) {
      setErrorMessage(
        error instanceof Error ? error.message : 'Something went wrong'
      );
    }
  };

  return (
    <>
      <Head>
        <title>{`New User | ${General.SiteTitle}`}</title>
      </Head>
      <EditUser
        firstname={firstname}
        lastname={lastname}
        email={email}
        status={status}
        topics={topics}
        role={role}
        firstnameChangeHandler={firstnameChangeHandler}
        lastnameChangeHandler={lastnameChangeHandler}
        emailChangeHandler={emailChangeHandler}
        statusChangeHandler={statusChangeHandler}
        topicsChangeHandler={topicsChangeHandler}
        roleChangeHandler={roleChangeHandler}
        userSubmit={userSubmitHandler}
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

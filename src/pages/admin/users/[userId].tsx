import { useState } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import dynamic from 'next/dynamic';
import useUser from '@/hooks/user-hook';
import { FormEvent } from 'react';
import { usePostData, useGetData } from '@/hooks/data-hook';
import Loading from '@/components/admin/UI/Loading';
import type { User } from '@/types/auth-types';
import { useSession } from 'next-auth/react';
import { GetServerSidePropsContext } from 'next';
import { getServerSession } from 'next-auth';
import { nextAuthOptions } from '@/pages/api/auth/[...nextauth]';
import { UserRole } from '@/utils/constants/users.enum';
import { General } from '@/utils/constants/general.enum';

const Modal = dynamic(() => import('@/components/admin/UI/Modal'), {
  ssr: false,
});

const EditUser = dynamic(() => import('@/components/admin/User/EditUser'), {
  loading: () => <Loading />,
  ssr: false,
});

export default function EditUserPage() {
  const { data: session, update } = useSession();
  const router = useRouter();
  const userId = router.query.userId;
  const [showModal, setShowModal] = useState(false);
  const { data } = useGetData<{ user: User }>(
    userId && `users/${userId}?include=role,topics`
  );
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
  } = useUser({
    initFirstname: data?.user.firstname,
    initLastname: data?.user.lastname,
    initEmail: data?.user.email,
    initRole: data?.user.role,
    initStatus: data?.user.status,
    initTopics: data?.user.topics,
  });

  const { trigger } = usePostData('users');
  const { trigger: passwordRessetTrigger } = usePostData('reset-password');

  const userSubmitHandler = async (event: FormEvent) => {
    event.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);
    try {
      const response = await trigger({
        method: 'PATCH',
        data: {
          id: userId,
          firstname,
          lastname,
          email,
          status,
          topicId: topics?.map((topic) => topic.id),
          roleId: role?.id,
        },
      });

      if (session?.user.id === response.user.id) {
        update({ ...session, user: response?.user });
      }
      setSuccessMessage(response?.message || 'User was successfully updated');
    } catch (error) {
      setErrorMessage(
        error instanceof Error ? error.message : 'Something went wrong'
      );
    }
  };

  const changePasswordHandler = async () => {
    try {
      const response = await passwordRessetTrigger({
        method: 'POST',
        data: {
          email,
        },
      });
      setShowModal(false);
      setSuccessMessage(
        response.message ||
          'A confirmation link has been sent to your email address'
      );
    } catch (error) {
      setErrorMessage(
        error instanceof Error ? error.message : 'Something went wrong'
      );
    }
  };

  return (
    <>
      <Head>
        <title>{`Update User | ${General.SiteTitle}`}</title>
      </Head>
      <EditUser
        edit
        id={Array.isArray(userId) ? userId[0] : userId}
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
        changePasswordHandler={() => setShowModal(true)}
        errorMessage={errorMessage}
        successMessage={successMessage}
      />
      <Modal
        open={showModal}
        content="Are you sure you want to change your password?"
        onAgree={changePasswordHandler}
        setOpen={setShowModal}
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
    session?.user?.role !== UserRole.SuperAdmin &&
    session?.user?.role !== UserRole.Admin
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

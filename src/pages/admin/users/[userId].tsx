import { useState } from 'react';
import { useRouter } from 'next/router';
import dynamic from 'next/dynamic';
import useUser from '@/hooks/user-hook';
import { FormEvent } from 'react';
import { usePostData, useGetData } from '@/hooks/data-hook';
import Loading from '@/components/admin/UI/Loading';
import type { User } from '@/types/auth-types';
import type { Role } from '@/types/auth-types';

const Modal = dynamic(() => import('@/components/admin/UI/Modal'), {
  ssr: false,
});

const EditUser = dynamic(() => import('@/components/admin/User/EditUser'), {
  loading: () => <Loading />,
  ssr: false,
});

export default function EditUserPage() {
  const router = useRouter();
  const userId = router.query.userId;
  const [showModal, setShowModal] = useState(false);
  const { data } = useGetData<{ user: User}>(userId && `users/${userId}?include=role,topics`);
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
          topicIds: topics?.map((topic) => topic.id),
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

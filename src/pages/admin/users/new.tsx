import { useContext } from 'react';
import dynamic from 'next/dynamic';
import useUser from '@/hooks/user-hook';
import { FormEvent } from 'react';
import { usePostData } from '@/hooks/data-hook';
import Loading from '@/components/admin/UI/Loading';

const EditUser = dynamic(() => import('@/components/admin/User'), {
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
  );
}

import { useContext } from 'react';
import { useRouter } from 'next/router';
import dynamic from 'next/dynamic';
import useUser from '@/hooks/user-hook';
import { FormEvent } from 'react';
import { usePostData, useGetData } from '@/hooks/data-hook';
import AuthContext from '@/context/auth-context';
const EditUser = dynamic(() => import('@/components/admin/User'));

export default function EditUserPage() {
  const router = useRouter();
  const userId = router.query.userId;

  const { data } = useGetData(`users/${userId}?include=role,topics`);
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
    initFirstname: data?.users[0]?.firstname,
    initLastname: data?.users[0]?.lastname,
    initEmail: data?.users[0]?.email,
    initRole: data?.users[0]?.role,
    initStatus: data?.users[0]?.status,
    initTopics: data?.users[0]?.topics,
  });

  const { trigger } = usePostData('users');

  const { accessToken } = useContext(AuthContext);
  const userSubmitHandler = async (event: FormEvent) => {
    event.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);
    try {
      const response = await trigger({
        method: 'PATCH',
        token: accessToken,
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

  return (
    <EditUser
      edit
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

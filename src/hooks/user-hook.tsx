import {
  useState,
  ChangeEvent,
  useEffect,
  useCallback,
  useMemo,
  SyntheticEvent,
} from 'react';
import type { SelectChangeEvent } from '@mui/material';
import type { UseUser } from '@/types/props-types';
import { Topic } from '@/types/content-types';
import { Role } from '@/types/auth-types';


export default function useUser({
  initFirstname,
  initLastname,
  initEmail,
  initStatus,
  initTopics,
  initRole,
}: UseUser = {}) {
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [firstname, setFirstname] = useState<string>('');
  const [lastname, setLastname] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [status, setStatus] = useState<string>('');
  const [topics, setTopics] = useState<Topic[] | null>(
    null
  );
  const [role, setRole] = useState<Role | null>(null);

  useEffect(() => {
    initFirstname && setFirstname(initFirstname);
    initLastname && setLastname(initLastname);
    initEmail && setEmail(initEmail);
    initStatus && setStatus(initStatus);
    initTopics && setTopics(initTopics);
    initRole && setRole(initRole);
  }, [
    initFirstname,
    initLastname,
    initEmail,
    initStatus,
    initTopics,
    initRole,
  ]);

  const firstnameChangeHandler = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      event.preventDefault();
      setErrorMessage(null);
      setSuccessMessage(null);
      const enteredfirstname = event.target.value;
      setFirstname(enteredfirstname);
    },
    []
  );

  const lastnameChangeHandler = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      event.preventDefault();
      setErrorMessage(null);
      setSuccessMessage(null);
      const enteredLastname = event.target.value;
      setLastname(enteredLastname);
    },
    []
  );

  const emailChangeHandler = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      event.preventDefault();
      setErrorMessage(null);
      setSuccessMessage(null);
      const enteredEmail = event.target.value;
      setEmail(enteredEmail);
    },
    []
  );

  const statusChangeHandler = useCallback((event: SelectChangeEvent<string>) => {
    event.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);
    const enteredStatus = event.target.value;
    setStatus(enteredStatus);
  }, []);

  const topicsChangeHandler = useCallback((
    event: SyntheticEvent,
    value: Topic[] | null
  ) => {
    setTopics(value);
  }, []);

  const roleChangeHandler = useCallback((
    event: SyntheticEvent,
    value: Role | null
  ) => {
    setRole(value);
  }, []);

  const clearInputs: () => void = useCallback(() => {
    setFirstname('');
    setLastname('');
    setEmail('');
    setStatus('');
    setTopics(null);
    setRole(null);
  }, []);

  const value = useMemo(
    () => ({
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
      clearInputs,
      successMessage,
      setSuccessMessage,
      errorMessage,
      setErrorMessage,
    }),
    [
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
      clearInputs,
      successMessage,
      setSuccessMessage,
      errorMessage,
      setErrorMessage,
    ]
  );

  return value;
}

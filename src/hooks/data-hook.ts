import useSWR from 'swr';
import useSWRMutation from 'swr/mutation';
import { useContext } from 'react';
import AuthContext from '@/context/auth-context';
import type { ArgData } from '@/types/fetch-types';

export const api = 'http://localhost:5000';


async function getFetch(url: string, { token = '' }: {token?: string | null } = {}) {
  const response = await fetch(url, {
    method: 'GET',
    credentials: 'include',
    headers: {
      ...(token && { authorization: `Bearer ${token}` }),
      'Content-Type': 'application/json' 
    },
  });
  const result = await response.json();
  if (!response.ok) {
    throw new Error(result?.message || 'Something went wrong');
  }
  
  return result;
};

async function postFetch(url: string, { arg }: { arg?: ArgData } = {}) {
  const response = await fetch(url, {
    method: arg?.method,
    credentials: 'include',
    headers: {
      ...(arg?.token && { authorization: `Bearer ${arg?.token}` }),
      ...(arg?.data instanceof FormData
        ? {}
        : { 'Content-Type': 'application/json' }),
    },
    ...(arg?.method !== 'GET' &&
      arg?.data && {
        body:
          arg?.data instanceof FormData ? arg?.data : JSON.stringify(arg?.data),
      }),
  });

  const result = await response.json();
  if (!response.ok) {
    throw new Error(result?.message || 'Something went wrong');
  }

  return result;
}

export function usePostData(url: string) {
  return useSWRMutation(`${api}/${url}`, postFetch);
}

export function useGetData(
  url: string,
  {
    revalidation = true,
    shouldRetryOnError = true,
  }: { revalidation?: boolean; shouldRetryOnError?: boolean } = {}
) {
  const { accessToken } = useContext(AuthContext);
  return useSWR(
    `${api}/${url}`,
    () => getFetch(`${api}/${url}`, { token: accessToken }),
    {
      revalidateIfStale: revalidation,
      revalidateOnFocus: revalidation,
      revalidateOnReconnect: revalidation,
      shouldRetryOnError: shouldRetryOnError,
    }
  );
}

import useSWR from 'swr';
import useSWRMutation from 'swr/mutation';
import { getSession } from 'next-auth/react';
import type { ArgData } from '@/types/fetch-types';

export const api = 'http://localhost:5000';


async function getFetch<T>(url: string): Promise<T> {
  const session = await getSession();
  const response = await fetch(url, {
    method: 'GET',
    credentials: 'include',
    headers: {
      authorization: `Bearer ${session?.accessToken}`,
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
  const session = await getSession();

  const response = await fetch(url, {
    method: arg?.method,
    credentials: 'include',
    headers: {
      authorization: `Bearer ${session?.accessToken}`,
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

export function useGetData<T>(
  url: string | object | undefined,
  {
    revalidation = false,
    shouldRetryOnError = false,
    revalidateOnMount = true,
    refreshInterval,
  }: { revalidation?: boolean; shouldRetryOnError?: boolean, revalidateOnMount?: boolean, refreshInterval?: number } = {}
) {

  return useSWR(
    typeof url === 'string' ? `${api}/${url}` : url,
    typeof url === 'string' ? () => getFetch<T>(`${api}/${url}`) : ({ path }: { path: string}) => getFetch<T>(`${api}/${path}`),
    {
      revalidateIfStale: revalidation,
      revalidateOnFocus: revalidation,
      revalidateOnReconnect: revalidation,
      revalidateOnMount: revalidateOnMount,
      shouldRetryOnError: shouldRetryOnError,
      ...refreshInterval && { refreshInterval },
    }
  );
}

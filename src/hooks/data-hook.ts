import useSWR from 'swr';
import useSWRMutation from 'swr/mutation';
import type { UseData } from '@/types/fetch-types';

const api = 'http://localhost:5000';

const fetcher = async (
  url: string,
  token?: string,
  credentials?: RequestCredentials
) => {
  try {
    const response = await fetch(url, {
      headers: {
        'Content-type': 'application/json',
        ...(token && { authorization: `Bearer ${token}` }),
      },
      ...(credentials && { credentials}),
    });

    if (!response.ok && response.status === 401) {
      throw new Error('ПОмилка');
    }

    if (!response.ok) {
      const error = new Error('An error occurred while fetching the data.');
      // Attach extra info to the error object.
      throw error;
    }
    return await response.json();
  } catch (error) {
    throw error;
  }
};

export function useData(
  url: string,
  { token, credentials }: UseData = {},
  revalidation: boolean = true
) {
  const { data, error, isLoading, mutate } = useSWR(
    `${api}/${url}`,
    () => fetcher(`${api}/${url}`, token, credentials),
    {
      revalidateIfStale: revalidation,
      revalidateOnFocus: revalidation,
      revalidateOnReconnect: revalidation,  
      shouldRetryOnError: false,    
    }
  );
  return {
    data,
    error,
    isLoading,
    mutate,
  };
}

import useSWR from 'swr';

const api = 'http://localhost:5000';

const fetcher: (...args: [input: RequestInfo, init?: RequestInit]) => Promise<any> = (...args) =>
  fetch(...args).then((res) => res.json());

export default function useData(url: string) {
  const { data, error, isLoading } = useSWR(`${api}/${url}`, fetcher);

  return {
    data,
    error,
    isLoading,
  }
}
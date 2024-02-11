import { routes } from './routes';

type Url = (typeof routes)[keyof typeof routes];

type PostRequest = {
  url: Url;
  query?: string;
  data?: unknown;
  token?: string;
  method?: 'POST' | 'PATCH';
};

export const post = async <Response>({
  url,
  query,
  data,
  token,
  method,
}: PostRequest): Promise<Response> => {
  const response = await fetch(url + (query || ''), {
    method: method || 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });

  const result = await response.json();
  if (!response.ok) {
    throw new Error(result.message);
  }

  return result;
};

type GetRequest = {
  url: Url;
  id?: string;
  query?: string;
  token?: string;
  revalidate?: number | false;
  tags?: string[];
};

export const get = async <Response>({
  url,
  id,
  query,
  token,
  tags,
  revalidate,
}: GetRequest): Promise<Response | null> => {
  try {
    const response = await fetch(url + (id ? `/${id}` : '') + (query || ''), {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      next: {
        tags,
        revalidate,
      },
    });
    const result = await response.json();
    if (!response.ok) {
      throw new Error(result.message);
    }

    return result;
  } catch (error) {
    return null
  }
};

type DeleteRequest = {
  url: Url;
  id: string;
  token: string;
};

export const remove = async <Response>({
  url,
  id,
  token,
}: DeleteRequest): Promise<Response> => {
  const response = await fetch(url + id, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error('Failed to fetch');
  }

  return await response.json();
};

type SendFileRequest = {
  url: Url;
  data: FormData;
  token: string;
};

export const sendFile = async <Response>({
  url,
  data,
  token,
}: SendFileRequest): Promise<Response> => {
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: data,
  });
  if (!response.ok) {
    throw new Error('Failed to fetch');
  }

  const result = await response.json();
  return result.path;
};

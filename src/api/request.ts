import { routes } from './routes';

type Url = (typeof routes)[keyof typeof routes];

type PostRequest = {
  url: Url;
  query?: string;
  data?: unknown;
  token?: string;
  method?: 'POST' | 'PATCH';
};

const parseResponse = async (response: Response): Promise<unknown> => {
  if (response.status === 204) {
    return null;
  }

  const contentType = response.headers.get('content-type') || '';

  if (contentType.includes('application/json')) {
    return response.json();
  }

  const text = await response.text();

  try {
    return JSON.parse(text);
  } catch {
    return text;
  }
};

export const post = async <Response>({
  url,
  query,
  data,
  token,
  method,
}: PostRequest): Promise<Response> => {
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    'x-lang': 'ua',
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const response = await fetch(url + (query || ''), {
    method: method || 'POST',
    headers,
    body: JSON.stringify(data),
  });

  const result = (await parseResponse(response)) as {
    message?: string;
  } | null;

  if (!response.ok) {
    throw new Error(result?.message || 'Request failed');
  }

  return result as Response;
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
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    };

    const isAuthenticated = Boolean(token);

    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }

    const nextOptions =
      !isAuthenticated && (tags || revalidate !== undefined)
        ? {
            next: {
              tags,
              revalidate,
            },
          }
        : {};

    const response = await fetch(url + (id ? `/${id}` : '') + (query || ''), {
      method: 'GET',
      headers,
      cache: isAuthenticated || revalidate === false ? 'no-store' : 'force-cache',
      ...nextOptions,
    });
    const result = (await parseResponse(response)) as Response;

    if (!response.ok) {
      return null;
    }

    return result;
  } catch {
    return null;
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
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const response = await fetch(url + id, {
    method: 'DELETE',
    headers,
  });

  if (!response.ok) {
    if (typeof window === 'undefined') {
      const { default: logger } = await import('@/logger');
      logger.error(await response.text());
    }
    throw new Error('Failed to fetch');
  }

  return (await parseResponse(response)) as Response;
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
  const headers: HeadersInit = {};

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const response = await fetch(url, {
    method: 'POST',
    headers,
    body: data,
  });
  if (!response.ok) {
    if (typeof window === 'undefined') {
      const { default: logger } = await import('@/logger');
      logger.error(await response.text());
    }
    throw new Error('Failed to fetch');
  }

  return (await parseResponse(response)) as Response;
};

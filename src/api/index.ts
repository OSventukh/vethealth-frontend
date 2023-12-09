import { post, get, sendFile } from './request';
import { routes } from './routes';
import type {
  ConfirmData,
  FileUploadResponse,
  ForgotData,
  LoginData,
  LoginResponse,
  RefreshResponse,
  RegisterData,
} from './types/auth.type';
import {
  CategoryGetManyParams,
  CategoryGetOneParams,
  CategoryResponse,
} from './types/categories.type';
import { Pagination } from './types/general.type';
import {
  PostGetManyParams,
  PostGetOneParams,
  PostResponse,
} from './types/posts.type';
import {
  TopicGetManyParams,
  TopicGetOneParams,
  TopicResponse,
} from './types/topics.type';

const queryObjectToString = (query?: unknown) => {
  if (!query) {
    return '';
  }

  return (
    '?' +
    Object.entries(query)
      .filter(([, value]) => value !== undefined)
      .map(([key, value]) => `${key}=${value}`)
      .join('&')
  );
};

export const api = {
  auth: {
    register: (data: RegisterData) =>
      post<LoginResponse>({ url: routes.register, data }),
    login: (data: LoginData) =>
      post<LoginResponse>({ url: routes.login, data }),
    logout: (accessToken: string) =>
      post({ url: routes.logout, token: accessToken }),
    refresh: (refreshToken: string) =>
      post<RefreshResponse>({ url: routes.refresh, token: refreshToken }),
    forgot: (data: ForgotData) => post<void>({ url: routes.forgot, data }),
    confirm: (data: ConfirmData, hash: string) =>
      post<void>({ url: routes.confirm, data, query: hash }),
  },
  file: {
    upload: (data: FormData, token: string) =>
      sendFile<FileUploadResponse>({ url: routes.fileUpload, data, token }),
  },
  posts: {
    getOne: ({ slug, token, query, revalidate, tags }: PostGetOneParams) =>
      get<PostResponse>({
        url: routes.posts,
        query: queryObjectToString({ ...query, slug }),
        token,
        revalidate,
        tags,
      }),
    getMany: ({ query, token, revalidate, tags }: PostGetManyParams) =>
      get<Pagination<PostResponse>>({
        url: routes.posts,
        query: queryObjectToString(query),
        token,
        revalidate,
        tags,
      }),
  },
  topics: {
    getOne: ({ slug, token }: TopicGetOneParams) =>
      get<TopicResponse>({
        url: routes.topics,
        query: `?slug=${slug}`,
        token,
      }),
    getMany: ({ query, token }: TopicGetManyParams) =>
      get<Pagination<TopicResponse>>({
        url: routes.topics,
        query: queryObjectToString(query),
        token,
      }),
  },
  categories: {
    getOne: ({ slug, token }: CategoryGetOneParams) =>
      get<CategoryResponse>({
        url: routes.categories,
        query: `?slug=${slug}`,
        token,
      }),
    getMany: ({ query, token }: CategoryGetManyParams) =>
      get<Pagination<CategoryResponse>>({
        url: routes.categories,
        query: queryObjectToString(query),
        token,
      }),
  },
} as const;

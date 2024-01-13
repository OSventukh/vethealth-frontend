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
import { PageResponse } from './types/pages.type';
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
import {
  UserGetManyParams,
  UserGetOneParams,
  UserResponse,
} from './types/user.type';

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
    getOne: ({ slug, query, token, revalidate, tags }: TopicGetOneParams) =>
      get<TopicResponse>({
        url: routes.topics,
        query: queryObjectToString({ ...query, slug }),
        token,
        revalidate,
        tags,
      }),
    getMany: ({ query, token, revalidate, tags }: TopicGetManyParams) =>
      get<Pagination<TopicResponse>>({
        url: routes.topics,
        query: queryObjectToString(query),
        token,
        revalidate,
        tags,
      }),
  },
  categories: {
    getOne: ({ slug, query, token, revalidate, tags }: CategoryGetOneParams) =>
      get<CategoryResponse>({
        url: routes.categories,
        query: queryObjectToString({ ...query, slug }),
        token,
        revalidate,
        tags,
      }),
    getMany: ({ query, token, revalidate, tags }: CategoryGetManyParams) =>
      get<Pagination<CategoryResponse>>({
        url: routes.categories,
        query: queryObjectToString(query),
        token,
        revalidate,
        tags,
      }),
  },
  pages: {
    getOne: ({ slug, token, query, revalidate, tags }: PostGetOneParams) =>
      get<PageResponse>({
        url: routes.pages,
        query: queryObjectToString({ ...query, slug }),
        token,
        revalidate,
        tags,
      }),
    getMany: ({ query, token, revalidate, tags }: PostGetManyParams) =>
      get<Pagination<PageResponse>>({
        url: routes.pages,
        query: queryObjectToString(query),
        token,
        revalidate,
        tags,
      }),
  },
  users: {
    getOne: ({ token, id, query, revalidate, tags }: UserGetOneParams) =>
      get<UserResponse>({
        url: routes.users,
        id: id,
        query: queryObjectToString(query),
        token,
        revalidate,
        tags,
      }),
    getMany: ({ token, query, revalidate, tags }: UserGetManyParams) =>
      get<Pagination<UserResponse>>({
        url: routes.users,
        query: queryObjectToString(query),
        token,
        revalidate,
        tags,
      }),
  },
} as const;

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
import { PostResponse } from './types/posts.type';

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
    getOne: (slug: string, token?: string) =>
      get<PostResponse>({ url: routes.posts, query: `?slug=${slug}`, token }),
    getMany: (query?: string, token?: string) =>
      get<{ items: PostResponse[] }>({ url: routes.posts, query, token }),
  },
} as const;

import { post } from './request';
import { routes } from './routes';
import type {
  ConfirmData,
  ForgotData,
  LoginData,
  LoginResponse,
  RegisterData,
} from './types/auth';

export const api = {
  auth: {
    register: (data: RegisterData) =>
      post<LoginResponse>({ url: routes.register, data }),
    login: (data: LoginData) => post({ url: routes.login, data }),
    logout: (accessToken: string) =>
      post({ url: routes.logout, token: accessToken }),
    refresh: (refreshToken: string) =>
      post<LoginResponse>({ url: routes.refresh, token: refreshToken }),
    forgot: (data: ForgotData) => post<void>({ url: routes.forgot, data }),
    confirm: (data: ConfirmData, hash: string) =>
      post<void>({ url: routes.confirm, data, query: hash }),
  },
} as const;

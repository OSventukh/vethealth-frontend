import { Relation } from './general.type';
import { User } from '@/utils/types/user.type';

export type RegisterData = {
  firstname: string;
  lastname?: string | null;
  email: string;
  role: Relation;
  topics?: Relation[] | null;
};

export type LoginData = {
  email: string;
  password: string;
};

export type ForgotData = {
  email: string;
};

export type ConfirmData = {
  password: string;
  confirmPassword: string;
};

export type Tokens = {
  token: string;
  refreshToken: string;
  tokenExpires: number;
};

export type LoginResponse = {
  user: User;
} & Tokens;

export type FileUploadResponse = {
  id: string;
  path: string;
};

export type RefreshResponse = Tokens;

export type PendingUserResponse = {
  firstname: string;
  email: string;
};

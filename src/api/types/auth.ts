import { Relation } from './general';

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
  email: string;
  passport: string;
};

export type LoginResponse = {
  token: string;
  refreshToken: string;
  tokenExpires: number;
  user: unknown;
};

import { Relation } from './general.type';

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

export type User = {
  id: string;
  firstname: string;
  lastname?: string;
  email: string;
  role: string;
  status: string;
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date;
};

export type Tokens = {
  token: string;
  refreshToken: string;
  tokenExpires: number;
};

export type LoginResponse = {
  user: User;
} & Tokens;

export type RefreshResponse = Tokens;

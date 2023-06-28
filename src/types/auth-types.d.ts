import { UserStatus, UserRole } from "@/utils/constants/users.enum";

export type Role = {
  id: number;
  name: UserRole
}

export interface User {
  id: string;
  firstname: string;
  lastname: string;
  email: string;
  createdAt: Date,
  role: Role,
  status: UserStatus;
  topics: Topic[];
}

export interface Auth {
  accessToken: string | null;
  isAuth: boolean;
  isLoading: boolean;
  user: User | null;
  login: () => void;
  logout: () => void;
}

export interface Token {
  token: string;
  expirationDate: Date;
}

export interface AuthHandlerArgs {
  firstname?: string;
  lastname?: string;
  email: string;
  password: string;
}

export interface AuthComponentsProps {
  onAuth: (AuthHandlerArgs) => void;
  authError: string | null;
  message?: string | null;
  resetPasswordMode?: boolean;
  setResetPasswordMode?: () => void;
}

export interface ConfirmHandlerArgs {
  password: string;
  confirmPassword: string;
}

export interface ConfirmComponentsProps {
  onConfirm: (ConfirmHandlerArgs) => void;
  confirmError: string | null;
  user: {
    name: string,
    email: string,
  };
}


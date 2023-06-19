export interface User {
  id: string;
  firstname: string;
  lastname: string | null;
  email: string;
  createdAt: Date,
  role: string | null,
  [key: string]: any,
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


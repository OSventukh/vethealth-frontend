export interface UserData {
  id: string | null;
  firstname: string | null;
  lastname: string | null;
  email: string | null;
  createdAt: Date | null,
  role: string | null,
}

export interface Auth {
  accessToken: string | null;
  isAuth: boolean;
  isLoading: boolean;
  user: UserData | null;
  login: ({ user: UserData, accessToken: Token}) => void;
  logout: () => void;
}

export interface Token {
  token: string;
  expirationDate: Date;
}


import { UserRoleEnum, UserStatusEnum } from '../enums/user.enum';

export type Role = {
  id: string;
  name: UserRoleEnum;
};

export type Status = {
  id: string;
  name: UserStatusEnum;
};

export type User = {
  id: string;
  firstname: string;
  lastname?: string;
  email: string;
  role: Role;
  status: Status;
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date;
};

export type UserSession = Pick<
  User,
  'id' | 'firstname' | 'lastname' | 'role' | 'status'
>;

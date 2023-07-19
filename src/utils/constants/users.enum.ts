import { Role } from "@/types/auth-types";
export enum UserRole {
  SuperAdmin = 'Super Administrator',
  Admin = 'Administrator',
  Moder = 'Moderator',
  Writer = 'Writer',
}

export enum UserStatus {
  Active = 'Active',
  Pending = 'Pending',
  Blocked = 'Blocked',
}
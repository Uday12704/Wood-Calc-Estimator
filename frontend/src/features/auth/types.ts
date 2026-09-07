export type PlatformRole =
  | "ADMIN"
  | "SUBSCRIBER";

export type ProfileRole =
  | "OWNER"
  | "USER";

export interface SubscriptionAccount {
  id: string;
  email: string;
  password: string;
  platformRole: PlatformRole;
  active: boolean;
  createdAt: string;
}

export interface AppProfile {
  id: string;
  accountId: string;
  name: string;
  role: ProfileRole;
  active: boolean;
  createdAt: string;
}

export interface AuthUser {
  accountId: string;
  profileId: string;
  name: string;
  email: string;
  platformRole: PlatformRole;
  profileRole: ProfileRole;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface AuthSession {
  accountId: string;
  profileId: string;
}
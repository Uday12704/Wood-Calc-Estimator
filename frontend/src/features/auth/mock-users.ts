import type {
  AppProfile,
  SubscriptionAccount,
} from "./types";

export const mockAccounts: SubscriptionAccount[] = [
  {
    id: "account-001",
    email: "user@woodcalc.com",
    password: "user123",
    platformRole: "SUBSCRIBER",
    active: true,
    createdAt: "2026-01-01T00:00:00.000Z",
  },
  {
    id: "account-002",
    email: "user2@woodcalc.com",
    password: "user123",
    platformRole: "SUBSCRIBER",
    active: true,
    createdAt: "2026-01-01T00:00:00.000Z",
  },

  {
    id: "account-admin-001",
    email: "admin@woodcalc.com",
    password: "admin123",
    platformRole: "ADMIN",
    active: true,
    createdAt: "2026-01-01T00:00:00.000Z",
  },
];

export const mockProfiles: AppProfile[] = [
  {
    id: "profile-001",
    accountId: "account-001",
    name: "Uday",
    role: "OWNER",
    active: true,
    createdAt: "2026-01-01T00:00:00.000Z",
  },
  {
    id: "profile-002",
    accountId: "account-001",
    name: "Darshan",
    role: "USER",
    active: true,
    createdAt: "2026-01-01T00:00:00.000Z",
  },
  {
    id: "profile-003",
    accountId: "account-001",
    name: "User 3",
    role: "USER",
    active: true,
    createdAt: "2026-01-01T00:00:00.000Z",
  },
  {
    id: "profile-001",
    accountId: "account-002",
    name: "Uday 2",
    role: "OWNER",
    active: true,
    createdAt: "2026-01-01T00:00:00.000Z",
  },
  {
    id: "profile-002",
    accountId: "account-002",
    name: "Daeshan 2",
    role: "USER",
    active: true,
    createdAt: "2026-01-01T00:00:00.000Z",
  },
];
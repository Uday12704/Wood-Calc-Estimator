import type { AuthUser } from "./types";

export interface MockUser extends AuthUser {
  password: string;
}

export const mockUsers: MockUser[] = [
  {
    id: "user-001",
    name: "Demo User",
    email: "user@woodcalc.com",
    password: "user123",
    role: "USER",
  },
  {
    id: "admin-001",
    name: "Wood Calc Admin",
    email: "admin@woodcalc.com",
    password: "admin123",
    role: "ADMIN",
  },
];
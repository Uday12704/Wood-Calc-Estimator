import {
  createContext,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";

import type {
  AuthUser,
  LoginCredentials,
} from "./types";
import { mockUsers } from "./mock-users";

interface AuthContextValue {
  user: AuthUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (credentials: LoginCredentials) => Promise<AuthUser>;
  logout: () => void;
}

const AuthContext =
  createContext<AuthContextValue | undefined>(
    undefined,
  );

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({
  children,
}: AuthProviderProps) {
  const [user, setUser] =
    useState<AuthUser | null>(null);

  const [isLoading, setIsLoading] =
    useState(false);

  async function login(
  credentials: LoginCredentials,
) {
  setIsLoading(true);

  try {
    await new Promise((resolve) =>
      setTimeout(resolve, 800),
    );

    const normalizedEmail =
      credentials.email.trim().toLowerCase();

    const mockUser = mockUsers.find(
      (user) =>
        user.email === normalizedEmail &&
        user.password === credentials.password,
    );

    if (!mockUser) {
      throw new Error(
        "Invalid email or password.",
      );
    }

    const authenticatedUser: AuthUser = {
      id: mockUser.id,
      name: mockUser.name,
      email: mockUser.email,
      role: mockUser.role,
    };

    setUser(authenticatedUser);
    return authenticatedUser
  } finally {
    setIsLoading(false);
  }
}

  function logout() {
    setUser(null);
  }

  const value = useMemo(
    () => ({
      user,
      isAuthenticated: user !== null,
      isLoading,
      login,
      logout,
    }),
    [user, isLoading],
  );

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context =
    useContext(AuthContext);

  if (!context) {
    throw new Error(
      "useAuth must be used inside AuthProvider",
    );
  }

  return context;
}
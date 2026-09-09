import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

import type {
  AppProfile,
  AuthUser,
  LoginCredentials,
  SubscriptionAccount,
} from "./types";
import { clearPendingAccountId, clearSession, getAccounts, getPendingAccountId, getProfiles, getStoredSession, savePendingAccountId, saveSession } from "./auth-storage";
import { getSecuritySettings } from "../settings/services/settings-storage";

interface AuthContextValue {
  user: AuthUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;

  login: (
    credentials: LoginCredentials,
  ) => Promise<AuthUser | null>;

  selectProfile: (
    profileId: string,
    pin?: string,
  ) => AuthUser;

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
  
  const [user, setUser] = useState<AuthUser | null>(null);

  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const session = getStoredSession();

    if (!session) {
      setIsLoading(false);
      return;
    }

    const account = getAccounts().find(
      (item) =>
        item.id === session.accountId &&
        item.active,
    );

    if (!account) {
      clearSession();
      setIsLoading(false);
      return;
    }

    // Admin accounts don't have a real subscriber profile.
    // We create the same synthetic admin profile used during login.
    if (account.platformRole === "ADMIN") {
      const adminProfile: AppProfile = {
        id: `admin-profile-${account.id}`,
        accountId: account.id,
        name: "Administrator",
        role: "OWNER",
        active: true,
        createdAt: account.createdAt,
      };

      setUser(
        createAuthUser(
          account,
          adminProfile,
        ),
      );

      setIsLoading(false);
      return;
    }

    const profile = getProfiles().find(
      (item) =>
        item.id === session.profileId &&
        item.accountId === account.id &&
        item.active,
    );

    if (!profile) {
      clearSession();
      setIsLoading(false);
      return;
    }

    setUser(
      createAuthUser(
        account,
        profile,
      ),
    );

    setIsLoading(false);
  }, []);

  function createAuthUser(
    account: SubscriptionAccount,
    profile: AppProfile,
  ): AuthUser {
    return {
      accountId: account.id,
      profileId: profile.id,
      name: profile.name,
      email: account.email,
      platformRole: account.platformRole,
      profileRole: profile.role,
    };
  }

  async function login(
  credentials: LoginCredentials,
): Promise<AuthUser | null> {
  setIsLoading(true);

  try {
    await new Promise((resolve) =>
      setTimeout(resolve, 800),
    );

    const normalizedEmail =
      credentials.email.trim().toLowerCase();

    const accounts = getAccounts();

    const account = accounts.find(
      (item) =>
        item.email.toLowerCase() ===
          normalizedEmail &&
        item.password ===
          credentials.password &&
        item.active,
    );

    if (!account) {
      throw new Error(
        "Invalid email or password.",
      );
    }

    // ----------------------------------
    // ADMIN
    // ----------------------------------

    if (
      account.platformRole === "ADMIN"
    ) {
      const adminProfile: AppProfile = {
        id: `admin-profile-${account.id}`,
        accountId: account.id,
        name: "Administrator",
        role: "OWNER",
        active: true,
        createdAt:
          new Date().toISOString(),
      };

      const authenticatedUser =
        createAuthUser(
          account,
          adminProfile,
        );

      setUser(authenticatedUser);

      saveSession({
        accountId: account.id,
        profileId: adminProfile.id,
      });

      return authenticatedUser;
    }

    // ----------------------------------
    // SUBSCRIBER
    // ----------------------------------

    const profiles = getProfiles().filter(
        (profile) =>
          profile.accountId === account.id &&
          profile.active,
      );

      if (profiles.length === 0) {
        throw new Error(
          "No active user profiles are available for this account.",
        );
      }

      // One profile → login directly
      if (profiles.length === 1) {
        const authenticatedUser =
          createAuthUser(
            account,
            profiles[0],
          );

        setUser(authenticatedUser);

        saveSession({
          accountId: account.id,
          profileId: profiles[0].id,
        });

        return authenticatedUser;
      }

      // Multiple profiles → UI will ask
      // the user to select a profile.
      savePendingAccountId(account.id);

      return null;
    } finally {
      setIsLoading(false);
    }
  }

  function selectProfile(
    profileId: string,
    pin?: string,
  ): AuthUser {
    const accountId =
      user?.accountId ??
      getPendingAccountId() ??
      getStoredSession()?.accountId;

    if (!accountId) {
      throw new Error(
        "No subscription account is waiting for profile selection.",
      );
    }

    const account = getAccounts().find(
      (item) =>
        item.id === accountId &&
        item.active,
    );

    if (!account) {
      throw new Error(
        "Subscription account not found.",
      );
    }

    const profile = getProfiles().find(
      (item) =>
        item.id === profileId &&
        item.accountId === account.id &&
        item.active,
    );

    if (!profile) {
      throw new Error(
        "Selected user profile is not available.",
      );
    }

    /* ---------------------------------- */
    /* ADMIN */
    /* ---------------------------------- */

    if (account.platformRole === "ADMIN") {
      const authenticatedUser =
        createAuthUser(account, profile);

      setUser(authenticatedUser);

      saveSession({
        accountId: account.id,
        profileId: profile.id,
      });

      clearPendingAccountId();

      return authenticatedUser;
    }

    /* ---------------------------------- */
    /* PROFILE PIN */
    /* ---------------------------------- */

    const securitySettings =
      getSecuritySettings(account.id);

    if (securitySettings.pinEnabled) {
      const expectedPin =
        securitySettings.profilePins[
          profile.id
        ];

      if (!expectedPin) {
        throw new Error(
          "A PIN has not been configured for this profile.",
        );
      }

      if (!pin) {
        throw new Error(
          "PIN_REQUIRED",
        );
      }

      if (pin !== expectedPin) {
        throw new Error(
          "Incorrect PIN.",
        );
      }
    }

    /* ---------------------------------- */
    /* CREATE SESSION */
    /* ---------------------------------- */

    const authenticatedUser =
      createAuthUser(account, profile);

    setUser(authenticatedUser);

    saveSession({
      accountId: account.id,
      profileId: profile.id,
    });

    clearPendingAccountId();

    return authenticatedUser;
  }

  function logout() {
    clearSession();
    clearPendingAccountId();
    setUser(null);
  }

  const value = useMemo(
    () => ({
      user,
      isAuthenticated:
        user !== null,
      isLoading,
      login,
      selectProfile,
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
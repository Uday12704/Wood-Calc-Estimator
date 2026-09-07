import type {
  AppProfile,
  AuthSession,
  SubscriptionAccount,
} from "./types";

import {
  mockAccounts,
  mockProfiles,
} from "./mock-users";

const ACCOUNTS_STORAGE_KEY =
  "wood-calc-auth-accounts";

const PROFILES_STORAGE_KEY =
  "wood-calc-auth-profiles";

const SESSION_STORAGE_KEY =
  "wood-calc-auth-session";

const PENDING_ACCOUNT_KEY =
  "wood-calc-auth-pending-account";

/* ---------------------------------- */
/* Accounts */
/* ---------------------------------- */

export function getAccounts(): SubscriptionAccount[] {
  const stored = localStorage.getItem(
    ACCOUNTS_STORAGE_KEY,
  );

  if (!stored) {
    localStorage.setItem(
      ACCOUNTS_STORAGE_KEY,
      JSON.stringify(mockAccounts),
    );

    return mockAccounts;
  }

  try {
    return JSON.parse(
      stored,
    ) as SubscriptionAccount[];
  } catch {
    localStorage.setItem(
      ACCOUNTS_STORAGE_KEY,
      JSON.stringify(mockAccounts),
    );

    return mockAccounts;
  }
}

export function saveAccounts(
  accounts: SubscriptionAccount[],
): void {
  localStorage.setItem(
    ACCOUNTS_STORAGE_KEY,
    JSON.stringify(accounts),
  );
}

/* ---------------------------------- */
/* Profiles */
/* ---------------------------------- */

export function getProfiles(): AppProfile[] {
  const stored = localStorage.getItem(
    PROFILES_STORAGE_KEY,
  );

  if (!stored) {
    localStorage.setItem(
      PROFILES_STORAGE_KEY,
      JSON.stringify(mockProfiles),
    );

    return mockProfiles;
  }

  try {
    return JSON.parse(stored) as AppProfile[];
  } catch {
    localStorage.setItem(
      PROFILES_STORAGE_KEY,
      JSON.stringify(mockProfiles),
    );

    return mockProfiles;
  }
}

export function saveProfiles(
  profiles: AppProfile[],
): void {
  localStorage.setItem(
    PROFILES_STORAGE_KEY,
    JSON.stringify(profiles),
  );
}

/* ---------------------------------- */
/* Session */
/* ---------------------------------- */

export function getStoredSession(): AuthSession | null {
  const stored = localStorage.getItem(
    SESSION_STORAGE_KEY,
  );

  if (!stored) {
    return null;
  }

  try {
    return JSON.parse(
      stored,
    ) as AuthSession;
  } catch {
    localStorage.removeItem(
      SESSION_STORAGE_KEY,
    );

    return null;
  }
}

export function saveSession(
  session: AuthSession,
): void {
  localStorage.setItem(
    SESSION_STORAGE_KEY,
    JSON.stringify(session),
  );
}

export function clearSession(): void {
  localStorage.removeItem(
    SESSION_STORAGE_KEY,
  );
}

export function getPendingAccountId(): string | null {
  return localStorage.getItem(
    PENDING_ACCOUNT_KEY,
  );
}

export function savePendingAccountId(
  accountId: string,
): void {
  localStorage.setItem(
    PENDING_ACCOUNT_KEY,
    accountId,
  );
}

export function clearPendingAccountId(): void {
  localStorage.removeItem(
    PENDING_ACCOUNT_KEY,
  );
}
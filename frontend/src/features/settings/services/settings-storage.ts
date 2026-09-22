import type {
  BusinessSettings,
  PrintSettings,
  SecuritySettings,
  SettingsData,
  WoodCategory,
} from "../types";

const STORAGE_KEY = "wood-calc-settings";

const DEFAULT_SETTINGS: Omit<SettingsData, "accountId"> = {
  business: {
    businessName: "PRAGATHI TIMBER",
    phone: "",
    address: "",
    gstin: "",
    logo: "",
  },

  woodCategories: [],

  print: {
    termsAndConditions: "",
    businessNameFont: "Helvetica",
  },

  security: {
    pinEnabled: false,
    profilePins: {},
    recoveryEmail: "",
    recoveryEmailVerified: false,
  },
};

/**
 * Get all account settings stored in localStorage.
 */
function getAllSettings(): SettingsData[] {
  const stored = localStorage.getItem(STORAGE_KEY);

  if (!stored) {
    return [];
  }

  try {
    const parsed = JSON.parse(stored);

    if (Array.isArray(parsed)) {
      return parsed as SettingsData[];
    }

    return [];
  } catch {
    return [];
  }
}

/**
 * Save all account settings.
 */
function saveAllSettings(
  settings: SettingsData[],
): void {
  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify(settings),
  );
}

/**
 * Get settings for a specific subscriber account.
 */
function getSettings(
  accountId: string,
): SettingsData {
  const allSettings = getAllSettings();

  const existingSettings = allSettings.find(
    (settings) =>
      settings.accountId === accountId,
  );

  if (existingSettings) {
    return {
      accountId,

      business: {
        ...DEFAULT_SETTINGS.business,
        ...existingSettings.business,
      },

      woodCategories:
        existingSettings.woodCategories ??
        DEFAULT_SETTINGS.woodCategories,

      print: {
        termsAndConditions:
          existingSettings.print?.termsAndConditions ?? "",
        businessNameFont:
          existingSettings.print?.businessNameFont ?? "Helvetica",
      },

      security: {
        ...DEFAULT_SETTINGS.security,
        ...existingSettings.security,
        profilePins:
          existingSettings.security?.profilePins ??
          DEFAULT_SETTINGS.security.profilePins,
      },
    };
  }

  return {
    accountId,
    ...DEFAULT_SETTINGS,
  };
}

/**
 * Save settings for a specific subscriber account.
 */
function saveSettings(
  accountId: string,
  settings: SettingsData,
): void {
  const allSettings = getAllSettings();

  const settingsWithAccount: SettingsData = {
    ...settings,
    accountId,
  };

  const existingIndex = allSettings.findIndex(
    (item) =>
      item.accountId === accountId,
  );

  if (existingIndex >= 0) {
    allSettings[existingIndex] =
      settingsWithAccount;
  } else {
    allSettings.push(settingsWithAccount);
  }

  saveAllSettings(allSettings);
}

/* ---------------------------------- */
/* Business Settings */
/* ---------------------------------- */

export function getBusinessSettings(
  accountId: string,
): BusinessSettings {
  return getSettings(accountId).business;
}

export function saveBusinessSettings(
  accountId: string,
  business: BusinessSettings,
): void {
  const settings = getSettings(accountId);

  saveSettings(accountId, {
    ...settings,
    business,
  });
}

/* ---------------------------------- */
/* Wood Categories */
/* ---------------------------------- */

export function getWoodCategories(
  accountId: string,
): WoodCategory[] {
  return getSettings(accountId).woodCategories;
}

export function saveWoodCategories(
  accountId: string,
  woodCategories: WoodCategory[],
): void {
  const settings = getSettings(accountId);

  saveSettings(accountId, {
    ...settings,
    woodCategories,
  });
}

/* ---------------------------------- */
/* Security Settings */
/* ---------------------------------- */

export function getSecuritySettings(
  accountId: string,
): SecuritySettings {
  return getSettings(accountId).security;
}

export function saveSecuritySettings(
  accountId: string,
  security: SecuritySettings,
): void {
  const settings = getSettings(accountId);

  saveSettings(accountId, {
    ...settings,
    security,
  });
}

export function getPrintSettings(
  accountId: string,
): PrintSettings {
  return getSettings(accountId).print;
}

export function savePrintSettings(
  accountId: string,
  print: PrintSettings,
): void {
  const settings = getSettings(accountId);

  saveSettings(accountId, {
    ...settings,
    print,
  });
}
import type {
  BusinessSettings,
  PrintSettings,
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
    defaultLayout: "A4",
    showGstRow: true,
    showDiscountRow: true,
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
        ...DEFAULT_SETTINGS.print,
        ...existingSettings.print,
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
/* Print Settings */
/* ---------------------------------- */

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
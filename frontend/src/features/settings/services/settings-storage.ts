import type {
  BusinessSettings,
  PrintSettings,
  SettingsData,
  WoodCategory,
} from "../types";

const STORAGE_KEY = "wood-calc-settings";

const DEFAULT_SETTINGS: SettingsData = {
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

function getSettings(): SettingsData {
  const stored = localStorage.getItem(
    STORAGE_KEY,
  );

  if (!stored) {
    return DEFAULT_SETTINGS;
  }

  try {
    const parsed = JSON.parse(
      stored,
    ) as Partial<SettingsData>;

    return {
      ...DEFAULT_SETTINGS,

      ...parsed,

      business: {
        ...DEFAULT_SETTINGS.business,
        ...parsed.business,
      },

      woodCategories:
        parsed.woodCategories ??
        DEFAULT_SETTINGS.woodCategories,

      print: {
        ...DEFAULT_SETTINGS.print,
        ...parsed.print,
      },
    };
  } catch {
    return DEFAULT_SETTINGS;
  }
}

function saveSettings(
  settings: SettingsData,
): void {
  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify(settings),
  );
}

/* ---------------------------------- */
/* Business Settings */
/* ---------------------------------- */

export function getBusinessSettings(): BusinessSettings {
  return getSettings().business;
}

export function saveBusinessSettings(
  business: BusinessSettings,
): void {
  const settings = getSettings();

  saveSettings({
    ...settings,
    business,
  });
}

/* ---------------------------------- */
/* Wood Categories */
/* ---------------------------------- */

export function getWoodCategories(): WoodCategory[] {
  return getSettings().woodCategories;
}

export function saveWoodCategories(
  woodCategories: WoodCategory[],
): void {
  const settings = getSettings();

  saveSettings({
    ...settings,
    woodCategories,
  });
}

/* ---------------------------------- */
/* Print Settings */
/* ---------------------------------- */

export function getPrintSettings(): PrintSettings {
  return getSettings().print;
}

export function savePrintSettings(
  print: PrintSettings,
): void {
  const settings = getSettings();

  saveSettings({
    ...settings,
    print,
  });
}
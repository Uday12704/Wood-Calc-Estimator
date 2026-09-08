export type CalculationMode =
  | "CFT"
  | "SQFT";

export interface WoodCategory {
  id: string;
  name: string;
  calculationMode: CalculationMode;
}

export interface BusinessSettings {
  businessName: string;
  phone: string;
  address: string;
  gstin: string;
  logo: string;
}

export type PrintLayout =
  | "A4"
  | "HALF_A4_LANDSCAPE";

export interface PrintSettings {
  defaultLayout: PrintLayout;
  showGstRow: boolean;
  showDiscountRow: boolean;
}

export interface SettingsData {
  accountId: string;
  business: BusinessSettings;
  woodCategories: WoodCategory[];
  print: PrintSettings;
}
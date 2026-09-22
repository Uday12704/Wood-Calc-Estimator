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

export interface SecuritySettings {
  pinEnabled: boolean;
  profilePins: Record<string, string>;
  recoveryEmail: string;
  recoveryEmailVerified: boolean;
}

export interface SettingsData {
  accountId: string;
  business: BusinessSettings;
  woodCategories: WoodCategory[];
  security: SecuritySettings;
  print: PrintSettings;
}


export type BusinessNameFont =
  | "Helvetica"
  | "Times-Roman"
  | "Courier"
  | "Helvetica-Bold"
  | "Times-Bold"
  | "Courier-Bold"
  | "Helvetica-Oblique"
  | "Times-Italic"
  | "Courier-Oblique"
  | "Helvetica-BoldOblique";

export interface PrintSettings {
  termsAndConditions: string;
  businessNameFont: BusinessNameFont;
}
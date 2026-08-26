export type EstimateType =
  | "CUT_SIZE"
  | "ROUND_SIZE";

export type EstimateStatus =
  | "ON_HOLD"
  | "CONFIRMED";

export type CalculationMode =
  | "CFT"
  | "SQFT";
  
export interface EstimateTypeOption {
  type: EstimateType;
  title: string;
  description: string;
  image: string;
}

export interface EstimateHeader {
  documentTitle: string;
  estimateNumber: string;
  date: string;
  partyName: string;
  contactNumber: string;
  reference: string;
  status: EstimateStatus;
}

export interface WoodCategory {
  id: string;
  name: string;
  calculationMode: CalculationMode;
}

export interface WoodItem {
  id: string;

  breadth: number | "";
  height: number | "";

  woodType: string;

  pricePerUnit: number | "";

  length: number | "";
  quantity: number | "";

  note: string;

  total: number;
  lineTotal: number;
}

export interface OtherCharge {
  id: string;
  name: string;
  amount: number;
}

export interface SavedEstimate {
  id: string;

  estimateNumber: string;
  documentTitle: string;
  date: string;

  partyName: string;
  contactNumber: string;
  reference: string;

  status:
    | "ON_HOLD"
    | "CONFIRMED";

  type:
    | "CUT_SIZE"
    | "ROUND_SIZE";

  items: WoodItem[];

  otherCharges: OtherCharge[];

  gstEnabled: boolean;
  gstRate: number;

  discountType:
    | "flat"
    | "percentage";

  discountValue: number;

  advancePaid: number;

  notes: string;

  totals: {
    subtotal: number;
    gstAmount: number;
    totalOtherCharges: number;
    discountAmount: number;
    grandTotal: number;
    balanceDue: number;
    totalCft: number;
    totalSqft: number;
  };

  createdAt: string;
  updatedAt: string;
}
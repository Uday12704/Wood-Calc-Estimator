import type {
  EstimateStatus,
  EstimateType,
} from "@/features/estimate/types";

export interface CustomerEstimate {
  id: string;
  estimateNumber: string;
  type: EstimateType;
  status: EstimateStatus;

  date: string;
  createdAt: string;

  partyName: string;
  contactNumber: string;
  reference: string;

  profileId: string;
  profileName: string;

  grandTotal: number;
  advancePaid: number;
  balanceDue: number;
}

export interface CustomerProfileSummary {
  profileId: string;
  profileName: string;

  totalEstimates: number;

  cutSizeCount: number;
  roundSizeCount: number;
  customCount: number;

  totalSales: number;
  totalAdvancePaid: number;
  totalBalanceDue: number;

  estimates: CustomerEstimate[];
}

export interface CustomerSummary {
  phone: string;
  name: string;
  reference: string;

  totalEstimates: number;

  totalSales: number;
  totalAdvancePaid: number;
  totalBalanceDue: number;

  estimates: CustomerEstimate[];
}
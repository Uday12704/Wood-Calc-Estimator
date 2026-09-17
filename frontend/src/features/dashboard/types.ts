export interface DashboardStats {
  totalEstimates: number;
  totalCutSizeEstimates: number;
  totalRoundSizeEstimates: number;
  totalCustomEstimates: number;
  totalSales: number;
  totalAdvanceReceived: number;
  pendingBalance: number;
  subscriptionExpiryDate: string;
  subscriptionStatus: "active" | "expiring" | "expired";
}

export interface SalesData {
  month: string;
  sales: number;
}

export interface RecentEstimate {
  id: string;
  estimateNumber: string;
  date: string;
  partyName: string;
  type: "cut-size" | "round-size" | "custom";
  status: "on-hold" | "confirmed";
  grandTotal: number;
  balanceDue: number;
}
export interface DashboardStats {
  totalEstimates: number;
  totalCutSizeEstimates: number;
  totalRoundSizeEstimates: number;
  totalSales: number;
  totalAdvanceReceived: number;
  pendingBalance: number;
  subscriptionExpiryDate: string;
  subscriptionStatus: "active" | "expiring" | "expired";
}

export const mockDashboardStats: DashboardStats = {
  totalEstimates: 128,
  totalCutSizeEstimates: 96,
  totalRoundSizeEstimates: 32,
  totalSales: 1845000,
  totalAdvanceReceived: 720000,
  pendingBalance: 1125000,
  subscriptionExpiryDate: "2027-08-31",
  subscriptionStatus: "active",
};
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

export interface SalesData {
  month: string;
  sales: number;
}

export interface RecentEstimate {
  id: string;
  estimateNumber: string;
  date: string;
  partyName: string;
  type: "cut-size" | "round-size";
  status: "on-hold" | "confirmed";
  grandTotal: number;
  balanceDue: number;
}

export const mockDashboardStats: DashboardStats = {
  totalEstimates: 128,
  totalCutSizeEstimates: 96,
  totalRoundSizeEstimates: 32,
  totalSales: 1845000,
  totalAdvanceReceived: 720000,
  pendingBalance: 1125000,
  subscriptionExpiryDate: "2027-07-31",
  subscriptionStatus: "active",
};

export const mockSalesData: SalesData[] = [
  {
    month: "Jan",
    sales: 210000,
  },
  {
    month: "Feb",
    sales: 265000,
  },
  {
    month: "Mar",
    sales: 320000,
  },
  {
    month: "Apr",
    sales: 280000,
  },
  {
    month: "May",
    sales: 390000,
  },
  {
    month: "Jun",
    sales: 380000,
  },
];

export const mockRecentEstimates: RecentEstimate[] = [
  {
    id: "1",
    estimateNumber: "EST-00128",
    date: "2026-08-15",
    partyName: "ABC Timber Traders",
    type: "cut-size",
    status: "confirmed",
    grandTotal: 45000,
    balanceDue: 20000,
  },
  {
    id: "2",
    estimateNumber: "EST-00127",
    date: "2026-08-14",
    partyName: "Sharma Wood Works",
    type: "round-size",
    status: "confirmed",
    grandTotal: 32500,
    balanceDue: 12500,
  },
  {
    id: "3",
    estimateNumber: "EST-00126",
    date: "2026-08-13",
    partyName: "Patel Furniture",
    type: "cut-size",
    status: "on-hold",
    grandTotal: 18200,
    balanceDue: 18200,
  },
  {
    id: "4",
    estimateNumber: "EST-00125",
    date: "2026-08-12",
    partyName: "Royal Interiors",
    type: "cut-size",
    status: "confirmed",
    grandTotal: 67500,
    balanceDue: 27500,
  },
  {
    id: "5",
    estimateNumber: "EST-00124",
    date: "2026-08-10",
    partyName: "Modern Furniture",
    type: "round-size",
    status: "confirmed",
    grandTotal: 52800,
    balanceDue: 12800,
  },
];
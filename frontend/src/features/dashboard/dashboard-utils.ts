import type {
  SavedEstimate,
  SavedRoundSizeEstimate,
  SavedCustomEstimate,
} from "@/features/estimate/types";

import type {
  DashboardStats,
  RecentEstimate,
  SalesData,
} from "./types";

type AnyEstimate =
  | SavedEstimate
  | SavedRoundSizeEstimate
  | SavedCustomEstimate;

function isConfirmed(
  estimate: AnyEstimate,
): boolean {
  return estimate.status === "CONFIRMED";
}

function getEstimateType(
  estimate: AnyEstimate,
): RecentEstimate["type"] {
  switch (estimate.type) {
    case "CUT_SIZE":
      return "cut-size";

    case "ROUND_SIZE":
      return "round-size";

    case "CUSTOM":
      return "custom";
  }
}

function toRecentEstimate(
  estimate: AnyEstimate,
): RecentEstimate {
  return {
    id: estimate.id,
    estimateNumber:
      estimate.estimateNumber,
    date: estimate.date,
    partyName: estimate.partyName,
    type: getEstimateType(estimate),
    status:
      estimate.status === "CONFIRMED"
        ? "confirmed"
        : "on-hold",
    grandTotal: estimate.totals.grandTotal,
    balanceDue: estimate.totals.balanceDue,
  };
}

export function getDashboardStats(
  estimates: AnyEstimate[],
  subscriptionExpiryDate: string,
  subscriptionStatus:
    | "active"
    | "expiring"
    | "expired",
): DashboardStats {
  const confirmedEstimates =
    estimates.filter(isConfirmed);

  const totalSales =
    confirmedEstimates.reduce(
      (total, estimate) =>
        total + estimate.totals.grandTotal,
      0,
    );

  const totalAdvanceReceived =
    confirmedEstimates.reduce(
      (total, estimate) =>
        total + estimate.totals.advancePaid,
      0,
    );

  const pendingBalance =
    confirmedEstimates.reduce(
      (total, estimate) =>
        total + estimate.totals.balanceDue,
      0,
    );

  return {
    totalEstimates: estimates.length,

    totalCutSizeEstimates:
      estimates.filter(
        (estimate) =>
          estimate.type === "CUT_SIZE",
      ).length,

    totalRoundSizeEstimates:
      estimates.filter(
        (estimate) =>
          estimate.type === "ROUND_SIZE",
      ).length,

    totalCustomEstimates:
      estimates.filter(
        (estimate) =>
          estimate.type === "CUSTOM",
      ).length,

    totalSales,

    totalAdvanceReceived,

    pendingBalance,

    subscriptionExpiryDate,

    subscriptionStatus,
  };
}

export function getRecentEstimates(
  estimates: AnyEstimate[],
): RecentEstimate[] {
  return [...estimates]
    .sort(
      (a, b) =>
        new Date(b.createdAt).getTime() -
        new Date(a.createdAt).getTime(),
    )
    .slice(0, 5)
    .map(toRecentEstimate);
}

export function getSalesData(
  estimates: AnyEstimate[],
): SalesData[] {
  const confirmedEstimates =
    estimates.filter(isConfirmed);

  const monthlySales =
    new Map<string, number>();

  for (const estimate of confirmedEstimates) {
    const date = new Date(
      estimate.date,
    );

    const month = date.toLocaleString(
      "en-IN",
      {
        month: "short",
      },
    );

    const current =
      monthlySales.get(month) ?? 0;

    monthlySales.set(
      month,
      current + estimate.totals.grandTotal,
    );
  }

  return Array.from(
    monthlySales.entries(),
  ).map(
    ([month, sales]) => ({
      month,
      sales,
    }),
  );
}
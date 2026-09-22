
import type { Subscription } from "./types";

export const ESTIMATE_LIMIT = 2000;

export type SubscriptionAccessReason =
  | "ACTIVE"
  | "ESTIMATE_LIMIT_REACHED"
  | "EXPIRED"
  | "NO_SUBSCRIPTION";

export interface SubscriptionAccessResult {
  allowed: boolean;
  reason: SubscriptionAccessReason;
  estimateCount: number;
  estimateLimit: number;
  remainingEstimates: number;
  expiryDate: string | null;
  daysRemaining: number | null;
}

interface CheckSubscriptionAccessParams {
  subscription: Subscription | null;
  estimateCount: number;
  estimateLimit?: number;
  now?: Date;
}

export function checkSubscriptionAccess({
  subscription,
  estimateCount,
  estimateLimit = ESTIMATE_LIMIT,
  now = new Date(),
}: CheckSubscriptionAccessParams): SubscriptionAccessResult {
  const safeEstimateCount = Math.max(0, estimateCount);
  const safeEstimateLimit = Math.max(
    0,
    Math.floor(estimateLimit),
  );

  const remainingEstimates = Math.max(
    0,
    safeEstimateLimit - safeEstimateCount,
  );

  if (!subscription) {
    return {
      allowed: false,
      reason: "NO_SUBSCRIPTION",
      estimateCount: safeEstimateCount,
      estimateLimit: safeEstimateLimit,
      remainingEstimates,
      expiryDate: null,
      daysRemaining: null,
    };
  }

  const expiry = new Date(subscription.expiryDate);

  // Treat an invalid expiry date as expired to avoid granting access.
  if (Number.isNaN(expiry.getTime())) {
    return {
      allowed: false,
      reason: "EXPIRED",
      estimateCount: safeEstimateCount,
      estimateLimit: safeEstimateLimit,
      remainingEstimates,
      expiryDate: subscription.expiryDate,
      daysRemaining: null,
    };
  }

  // Compare calendar dates: valid through expiry date,
  // then expires the following day.
  const today = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate(),
  );

  const expiryDay = new Date(
    expiry.getFullYear(),
    expiry.getMonth(),
    expiry.getDate(),
  );

  const millisecondsPerDay = 1000 * 60 * 60 * 24;

  const daysRemaining = Math.ceil(
    (expiryDay.getTime() - today.getTime()) /
      millisecondsPerDay,
  );

  if (daysRemaining < 0) {
    return {
      allowed: false,
      reason: "EXPIRED",
      estimateCount: safeEstimateCount,
      estimateLimit: safeEstimateLimit,
      remainingEstimates,
      expiryDate: subscription.expiryDate,
      daysRemaining,
    };
  }

  if (safeEstimateCount >= safeEstimateLimit) {
    return {
      allowed: false,
      reason: "ESTIMATE_LIMIT_REACHED",
      estimateCount: safeEstimateCount,
      estimateLimit: safeEstimateLimit,
      remainingEstimates: 0,
      expiryDate: subscription.expiryDate,
      daysRemaining,
    };
  }

  return {
    allowed: true,
    reason: "ACTIVE",
    estimateCount: safeEstimateCount,
    estimateLimit: safeEstimateLimit,
    remainingEstimates,
    expiryDate: subscription.expiryDate,
    daysRemaining,
  };
}

import type { Subscription } from "./types";
import { checkSubscriptionAccess } from "./subscription-access";
import { generateEstimateNumber } from "../estimate/utils/estimate-number";
import { getSubscription } from "./subscription-storage";
import { getEstimateUsage, saveEstimateUsage } from "./subscription-usage-storage";

export interface EstimateCreationResult {
  estimateNumber: string;
  periodStartDate: string;
  nextUsage: number;
}

/**
 * Checks whether an account can create an estimate and allocates
 * its next estimate number.
 *
 * This function does not save the estimate itself. The caller should
 * save the estimate first, then call commitEstimateUsage().
 */
export function prepareEstimateCreation(
  accountId: string,
): EstimateCreationResult {
  const subscription: Subscription | null = getSubscription(accountId);

  if (!subscription) {
    throw new Error("No subscription was found for this account.");
  }

  const usage = getEstimateUsage(accountId, subscription.startDate);

  const access = checkSubscriptionAccess({
    subscription,
    estimateCount: usage.used,
    estimateLimit: usage.limit,
  });

  if (!access.allowed) {
    throw new Error(
      access.reason === "ESTIMATE_LIMIT_REACHED"
        ? "Your estimate limit has been reached. Please contact the administrator to increase it or renew your subscription."
        : access.reason === "EXPIRED"
          ? "Your subscription has expired. Please renew to create estimates."
          : "An active subscription is required to create estimates.",
    );
  }

  const nextSequence = usage.lastSequence + 1;

  return {
    estimateNumber: generateEstimateNumber(
      nextSequence,
      subscription.startDate,
    ),
    periodStartDate: subscription.startDate,
    nextUsage: usage.used + 1,
  };
}

/**
 * Records the usage after the estimate has been saved successfully.
 */
export function commitEstimateUsage(
  accountId: string,
  periodStartDate: string,
): void {
  const usage = getEstimateUsage(accountId, periodStartDate);

  if (usage.used >= usage.limit) {
    throw new Error("The estimate limit has been reached.");
  }

  saveEstimateUsage({
    ...usage,
    used: usage.used + 1,
    lastSequence: usage.lastSequence + 1,
  });
}

export function previewEstimateNumber(accountId: string): string {
  const subscription = getSubscription(accountId);

  if (!subscription) {
    return "";
  }

  const usage = getEstimateUsage(accountId, subscription.startDate);

  const access = checkSubscriptionAccess({
    subscription,
    estimateCount: usage.used,
    estimateLimit: usage.limit,
  });

  if (!access.allowed) {
    return "";
  }

  return generateEstimateNumber(
    usage.lastSequence + 1,
    subscription.startDate,
  );
}
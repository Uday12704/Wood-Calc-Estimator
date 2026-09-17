import type {
  Subscription,
  SubscriptionStatus,
} from "./types";

const STORAGE_KEY = "wood-calc-subscriptions";

function getAllSubscriptions(): Subscription[] {
  const stored = localStorage.getItem(STORAGE_KEY);

  if (!stored) {
    return [];
  }

  try {
    const parsed = JSON.parse(stored);

    return Array.isArray(parsed)
      ? parsed
      : [];
  } catch {
    return [];
  }
}

function saveAllSubscriptions(
  subscriptions: Subscription[],
): void {
  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify(subscriptions),
  );
}

export function getSubscription(
  accountId: string,
): Subscription | null {
  return (
    getAllSubscriptions().find(
      (subscription) =>
        subscription.accountId === accountId,
    ) ?? null
  );
}

export function saveSubscription(
  accountId: string,
  subscription: Omit<
    Subscription,
    "accountId"
  >,
): void {
  const subscriptions =
    getAllSubscriptions();

  const updatedSubscription: Subscription = {
    ...subscription,
    accountId,
  };

  const existingIndex =
    subscriptions.findIndex(
      (item) =>
        item.accountId === accountId,
    );

  if (existingIndex >= 0) {
    subscriptions[existingIndex] =
      updatedSubscription;
  } else {
    subscriptions.push(
      updatedSubscription,
    );
  }

  saveAllSubscriptions(subscriptions);
}

export function calculateSubscriptionStatus(
  expiryDate: string,
): SubscriptionStatus {
  const today = new Date();
  const expiry = new Date(expiryDate);

  const difference =
    expiry.getTime() - today.getTime();

  const daysRemaining = Math.ceil(
    difference /
      (1000 * 60 * 60 * 24),
  );

  if (daysRemaining <= 0) {
    return "expired";
  }

  if (daysRemaining <= 30) {
    return "expiring";
  }

  return "active";
}
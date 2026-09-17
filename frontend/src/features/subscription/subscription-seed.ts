import {
  getSubscription,
  saveSubscription,
  calculateSubscriptionStatus,
} from "./subscription-storage";

export function initializeSubscription(
  accountId: string,
): void {
  const existing =
    getSubscription(accountId);

  if (existing) {
    return;
  }

  const createdAt =
    new Date().toISOString();

  const expiryDate =
    "2027-07-31";

  saveSubscription(
    accountId,
    {
      planName: "Pro",
      startDate: createdAt,
      expiryDate,
      status:
        calculateSubscriptionStatus(
          expiryDate,
        ),
      createdAt,
      updatedAt: createdAt,
    },
  );
}
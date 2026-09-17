import {
  getSubscription,
  saveSubscription,
  calculateSubscriptionStatus,
} from "./subscription-storage";

const TEST_ACCOUNT_ID =
  "account-001";

export function initializeSubscription(): void {
  const existing =
    getSubscription(TEST_ACCOUNT_ID);

  if (existing) {
    return;
  }

  const startDate =
    new Date().toISOString();

  const expiryDate =
    "2027-07-31";

  saveSubscription(
    TEST_ACCOUNT_ID,
    {
      planName: "Pro",
      startDate,
      expiryDate,
      status:
        calculateSubscriptionStatus(
          expiryDate,
        ),
      createdAt: startDate,
      updatedAt: startDate,
    },
  );
}
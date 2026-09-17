export type SubscriptionStatus =
  | "active"
  | "expiring"
  | "expired";

export interface Subscription {
  accountId: string;

  planName: string;

  startDate: string;
  expiryDate: string;

  status: SubscriptionStatus;

  createdAt: string;
  updatedAt: string;
}
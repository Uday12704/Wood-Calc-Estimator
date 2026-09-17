import { getSavedCustomEstimates, getSavedEstimates, getSavedRoundEstimates } from "../estimate/services/estimate-storage";
import type { SavedCustomEstimate, SavedEstimate, SavedRoundSizeEstimate } from "../estimate/types";
import {
  createNotification,
  getNotifications,
  saveNotification,
} from "./notification-storage";

import type {
  Notification,
} from "./types";

export function getUnreadNotificationCount(
  accountId: string,
): number {
  return getNotifications(accountId).filter(
    (notification) =>
      !notification.isRead,
  ).length;
}

export function hasNotification(
  accountId: string,
  notificationKey: string,
): boolean {
  return getNotifications(accountId).some(
    (notification) =>
      notification.notificationKey ===
      notificationKey,
  );
}

export function createSubscriptionExpiryNotification(
  accountId: string,
  daysRemaining: number,
): Notification | null {
  const notificationKey =
    `subscription-expiry-${accountId}-${daysRemaining}`;

  if (
    hasNotification(
      accountId,
      notificationKey,
    )
  ) {
    return null;
  }

  let title: string;
  let message: string;

  switch (daysRemaining) {
    case 30:
      title = "Subscription Expiring Soon";
      message =
        "Your subscription will expire in 30 days. Please renew your subscription to continue using the application.";
      break;

    case 7:
      title = "Subscription Expiring Soon";
      message =
        "Your subscription will expire in 7 days. Please renew your subscription to avoid interruption.";
      break;

    case 3:
      title = "Subscription Expiring Soon";
      message =
        "Your subscription will expire in 3 days. Please renew your subscription.";
      break;

    case 1:
      title =
        "Subscription Expires Tomorrow";
      message =
        "Your subscription will expire tomorrow. Please renew your subscription to continue using the application.";
      break;

    case 0:
      title = "Subscription Expired";
      message =
        "Your subscription has expired. Please contact the administrator to renew your subscription.";
      break;

    default:
      return null;
  }

  return createNotification({
    accountId,
    createdBy: null,
    title,
    message,
    type: "SUBSCRIPTION",
    priority:
      daysRemaining <= 3
        ? "HIGH"
        : "NORMAL",
    notificationKey,
  });
}

export function checkSubscriptionExpiryNotification(
  accountId: string,
  expiryDate: string,
): Notification | null {
  const today = new Date();
  const expiry = new Date(expiryDate);

  const difference =
    expiry.getTime() - today.getTime();

  const daysRemaining = Math.ceil(
    difference / (1000 * 60 * 60 * 24),
  );

  return createSubscriptionExpiryNotification(
    accountId,
    daysRemaining,
  );
}

export function createAndSaveSubscriptionExpiryNotification(
  accountId: string,
  expiryDate: string,
): void {
  const notification =
    checkSubscriptionExpiryNotification(
      accountId,
      expiryDate,
    );

  if (!notification) {
    return;
  }

  saveNotification(notification);
}

type AnyEstimate =
  | SavedEstimate
  | SavedRoundSizeEstimate
  | SavedCustomEstimate;

function getPreviousSevenDayRange(
  today: Date,
): {
  start: Date;
  end: Date;
} {
  const end = new Date(today);
  end.setHours(23, 59, 59, 999);

  const start = new Date(today);
  start.setDate(start.getDate() - 7);
  start.setHours(0, 0, 0, 0);

  return {
    start,
    end,
  };
}

export function createWeeklyOnHoldEstimateNotification(
  accountId: string,
  today = new Date(),
): Notification | null {
  const {
    start,
    end,
  } = getPreviousSevenDayRange(today);

  const cutEstimates =
    getSavedEstimates(accountId);

  const roundEstimates =
    getSavedRoundEstimates(accountId);

  const customEstimates =
    getSavedCustomEstimates(accountId);

  const allEstimates: AnyEstimate[] = [
    ...cutEstimates,
    ...roundEstimates,
    ...customEstimates,
  ];

  const onHoldEstimates =
    allEstimates.filter((estimate) => {
      if (estimate.status !== "ON_HOLD") {
        return false;
      }

      const createdAt = new Date(
        estimate.createdAt,
      );

      return (
        createdAt >= start &&
        createdAt <= end
      );
    });

  if (onHoldEstimates.length === 0) {
    return null;
  }

  const weekKey =
    start.toISOString().slice(0, 10);

  const notificationKey =
    `on-hold-weekly-${accountId}-${weekKey}`;

  if (
    hasNotification(
      accountId,
      notificationKey,
    )
  ) {
    return null;
  }

  const estimateList =
    onHoldEstimates
      .sort(
        (a, b) =>
          new Date(
            b.createdAt,
          ).getTime() -
          new Date(
            a.createdAt,
          ).getTime(),
      )
      .map(
        (estimate) =>
          `• ${estimate.estimateNumber} — ${estimate.partyName || "Unnamed customer"}`,
      )
      .join("\n");

  const message =
    `You have ${onHoldEstimates.length} estimate${
      onHoldEstimates.length === 1
        ? ""
        : "s"
    } that are currently ON_HOLD from the previous 7 days.\n\n${estimateList}`;

  return createNotification({
    accountId,
    createdBy: null,
    title: "Pending Estimates Reminder",
    message,
    type: "SYSTEM",
    priority: "NORMAL",
    notificationKey,
  });
}

export function checkWeeklyOnHoldEstimateNotification(
  accountId: string,
  today = new Date(),
): Notification | null {
  const dayOfWeek = today.getDay();

  if (dayOfWeek !== 1) {
    return null;
  }

  return createWeeklyOnHoldEstimateNotification(
    accountId,
    today,
  );
}
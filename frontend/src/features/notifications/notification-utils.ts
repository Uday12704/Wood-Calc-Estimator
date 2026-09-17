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
      title = "Subscription Expires Tomorrow";
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
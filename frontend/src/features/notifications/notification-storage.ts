import type { Notification } from "./types";

const STORAGE_KEY =
  "wood-calc-notifications";

function readNotifications(): Notification[] {
  try {
    const stored =
      localStorage.getItem(STORAGE_KEY);

    if (!stored) {
      return [];
    }

    const parsed = JSON.parse(stored);

    if (!Array.isArray(parsed)) {
      return [];
    }

    return parsed as Notification[];
  } catch {
    return [];
  }
}

function writeNotifications(
  notifications: Notification[],
): void {
  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify(notifications),
  );
}

/**
 * Get notifications belonging to one subscriber account.
 */
export function getNotifications(
  accountId: string,
): Notification[] {
  return readNotifications()
    .filter(
      (notification) =>
        notification.accountId === accountId,
    )
    .sort(
      (a, b) =>
        new Date(b.createdAt).getTime() -
        new Date(a.createdAt).getTime(),
    );
}

/**
 * Get a single notification belonging
 * to the specified account.
 */
export function getNotificationById(
  accountId: string,
  notificationId: string,
): Notification | undefined {
  return getNotifications(accountId).find(
    (notification) =>
      notification.id === notificationId,
  );
}

/**
 * Save a notification.
 */
export function saveNotification(
  notification: Notification,
): void {
  const notifications =
    readNotifications();

  const existingIndex =
    notifications.findIndex(
      (item) =>
        item.id === notification.id &&
        item.accountId ===
          notification.accountId,
    );

  if (existingIndex >= 0) {
    notifications[existingIndex] =
      notification;
  } else {
    notifications.push(notification);
  }

  writeNotifications(notifications);
}

/**
 * Create and save a new notification.
 */
export function createNotification(
  notification: Omit<
    Notification,
    "id" | "createdAt" | "isRead"
  >,
): Notification {
  const newNotification: Notification = {
    ...notification,
    id: crypto.randomUUID(),
    isRead: false,
    createdAt:
      new Date().toISOString(),
  };

  saveNotification(
    newNotification,
  );

  return newNotification;
}

/**
 * Mark one notification as read.
 */
export function markNotificationAsRead(
  accountId: string,
  notificationId: string,
): void {
  const notifications =
    readNotifications();

  const index =
    notifications.findIndex(
      (notification) =>
        notification.id ===
          notificationId &&
        notification.accountId ===
          accountId,
    );

  if (index === -1) {
    return;
  }

  notifications[index] = {
    ...notifications[index],
    isRead: true,
  };

  writeNotifications(notifications);
}

/**
 * Mark all notifications for an account as read.
 */
export function markAllNotificationsAsRead(
  accountId: string,
): void {
  const notifications =
    readNotifications();

  const updated =
    notifications.map(
      (notification) => {
        if (
          notification.accountId !==
          accountId
        ) {
          return notification;
        }

        return {
          ...notification,
          isRead: true,
        };
      },
    );

  writeNotifications(updated);
}

/**
 * Delete one notification.
 */
export function deleteNotification(
  accountId: string,
  notificationId: string,
): void {
  const notifications =
    readNotifications();

  const filtered =
    notifications.filter(
      (notification) =>
        !(
          notification.id ===
            notificationId &&
          notification.accountId ===
            accountId
        ),
    );

  writeNotifications(filtered);
}

/**
 * Delete all notifications for an account.
 */
export function clearNotifications(
  accountId: string,
): void {
  const notifications =
    readNotifications();

  const filtered =
    notifications.filter(
      (notification) =>
        notification.accountId !==
        accountId,
    );

  writeNotifications(filtered);
}
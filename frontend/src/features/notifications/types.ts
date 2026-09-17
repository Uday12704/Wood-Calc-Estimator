export type NotificationType =
  | "SUBSCRIPTION"
  | "ANNOUNCEMENT"
  | "SYSTEM"
  | "SUPPORT";

export type NotificationPriority =
  | "LOW"
  | "NORMAL"
  | "HIGH";

export interface Notification {
  id: string;

  // Ownership
  accountId: string | null;

  // Who created/sent it
  createdBy: string | null;

  title: string;
  message: string;

  type: NotificationType;
  priority: NotificationPriority;

  isRead: boolean;

  createdAt: string;

  notificationKey?: string;

  // Optional expiration for temporary notifications
  expiresAt?: string;
}
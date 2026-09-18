export type SupportCategory =
  | "GENERAL"
  | "ACCOUNT"
  | "SUBSCRIPTION"
  | "ESTIMATE"
  | "PRINTING"
  | "SETTINGS"
  | "TECHNICAL"
  | "OTHER";

export type SupportPriority =
  | "LOW"
  | "NORMAL"
  | "HIGH";

export type SupportStatus =
  | "OPEN"
  | "IN_PROGRESS"
  | "WAITING_FOR_USER"
  | "RESOLVED"
  | "CLOSED";

export interface SupportRequest {
  id: string;
  requestNumber: string;

  accountId: string;
  createdBy: string;

  subject: string;
  category: SupportCategory;
  priority: SupportPriority;
  message: string;

  status: SupportStatus;

  createdAt: string;
  updatedAt: string;
}

export interface SupportMessage {
  id: string;
  requestId: string;
  accountId: string;
  senderType: "USER" | "ADMIN";
  senderId: string;
  message: string;
  createdAt: string;
}
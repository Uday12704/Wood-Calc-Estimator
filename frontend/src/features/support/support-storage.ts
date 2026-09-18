import type {
  SupportMessage,
  SupportRequest,
} from "./types";

const REQUESTS_STORAGE_KEY =
  "wood-calc-support-requests";

const MESSAGES_STORAGE_KEY =
  "wood-calc-support-messages";

// ─────────────────────────────────────────────
// Support Requests
// ─────────────────────────────────────────────

function getAllRequests(): SupportRequest[] {
  const stored = localStorage.getItem(
    REQUESTS_STORAGE_KEY,
  );

  if (!stored) {
    return [];
  }

  try {
    return JSON.parse(stored) as SupportRequest[];
  } catch {
    return [];
  }
}

function saveAllRequests(
  requests: SupportRequest[],
): void {
  localStorage.setItem(
    REQUESTS_STORAGE_KEY,
    JSON.stringify(requests),
  );
}

export function getSupportRequests(
  accountId: string,
): SupportRequest[] {
  return getAllRequests()
    .filter(
      (request) =>
        request.accountId === accountId,
    )
    .sort(
      (a, b) =>
        new Date(b.createdAt).getTime() -
        new Date(a.createdAt).getTime(),
    );
}

export function getSupportRequestById(
  accountId: string,
  requestId: string,
): SupportRequest | null {
  return (
    getAllRequests().find(
      (request) =>
        request.id === requestId &&
        request.accountId === accountId,
    ) ?? null
  );
}

export function saveSupportRequest(
  accountId: string,
  request: SupportRequest,
): void {
  const requests = getAllRequests();

  const updatedRequest: SupportRequest = {
    ...request,
    accountId,
  };

  const existingIndex = requests.findIndex(
    (item) =>
      item.id === request.id &&
      item.accountId === accountId,
  );

  if (existingIndex >= 0) {
    requests[existingIndex] = updatedRequest;
  } else {
    requests.push(updatedRequest);
  }

  saveAllRequests(requests);
}

export function deleteSupportRequest(
  accountId: string,
  requestId: string,
): void {
  const requests = getAllRequests().filter(
    (request) =>
      !(
        request.id === requestId &&
        request.accountId === accountId
      ),
  );

  saveAllRequests(requests);

  // Also remove messages belonging to this request.
  const messages = getAllMessages().filter(
    (message) =>
      !(
        message.requestId === requestId &&
        message.accountId === accountId
      ),
  );

  saveAllMessages(messages);
}

// ─────────────────────────────────────────────
// Support Messages
// ─────────────────────────────────────────────

function getAllMessages(): SupportMessage[] {
  const stored = localStorage.getItem(
    MESSAGES_STORAGE_KEY,
  );

  if (!stored) {
    return [];
  }

  try {
    return JSON.parse(stored) as SupportMessage[];
  } catch {
    return [];
  }
}

function saveAllMessages(
  messages: SupportMessage[],
): void {
  localStorage.setItem(
    MESSAGES_STORAGE_KEY,
    JSON.stringify(messages),
  );
}

export function getSupportMessages(
  accountId: string,
  requestId: string,
): SupportMessage[] {
  return getAllMessages()
    .filter(
      (message) =>
        message.accountId === accountId &&
        message.requestId === requestId,
    )
    .sort(
      (a, b) =>
        new Date(a.createdAt).getTime() -
        new Date(b.createdAt).getTime(),
    );
}

export function saveSupportMessage(
  accountId: string,
  message: SupportMessage,
): void {
  const messages = getAllMessages();

  const updatedMessage: SupportMessage = {
    ...message,
    accountId,
  };

  const existingIndex = messages.findIndex(
    (item) =>
      item.id === message.id &&
      item.accountId === accountId,
  );

  if (existingIndex >= 0) {
    messages[existingIndex] = updatedMessage;
  } else {
    messages.push(updatedMessage);
  }

  saveAllMessages(messages);
}
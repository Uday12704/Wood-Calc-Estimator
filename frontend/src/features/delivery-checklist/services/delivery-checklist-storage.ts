import type { DeliveryChecklist } from "../types";

const STORAGE_KEY = "wood-calc-delivery-checklists";

/**
 * Get all saved delivery checklists for a subscriber account.
 */
export function getDeliveryChecklists(
  accountId: string,
): DeliveryChecklist[] {
  const stored = localStorage.getItem(STORAGE_KEY);

  if (!stored) {
    return [];
  }

  try {
    const checklists = JSON.parse(stored) as DeliveryChecklist[];

    return checklists.filter(
      (checklist) => checklist.accountId === accountId,
    );
  } catch {
    return [];
  }
}

/**
 * Get the delivery checklist for a specific estimate
 * belonging to the current subscriber account.
 */
export function getDeliveryChecklistByEstimateId(
  accountId: string,
  estimateId: string,
): DeliveryChecklist | null {
  const checklists = getDeliveryChecklists(accountId);

  return (
    checklists.find(
      (checklist) =>
        checklist.accountId === accountId &&
        checklist.estimateId === estimateId,
    ) ?? null
  );
}

/**
 * Save or update a delivery checklist.
 */
export function saveDeliveryChecklist(
  accountId: string,
  checklist: DeliveryChecklist,
): void {
  const stored = localStorage.getItem(STORAGE_KEY);

  let checklists: DeliveryChecklist[] = [];

  if (stored) {
    try {
      checklists = JSON.parse(stored) as DeliveryChecklist[];
    } catch {
      checklists = [];
    }
  }

  /*
   * Always enforce the account ownership from the
   * authenticated account.
   */
  const checklistWithAccount = {
    ...checklist,
    accountId,
  };

  const existingIndex = checklists.findIndex(
    (item) =>
      item.accountId === accountId &&
      item.estimateId === checklist.estimateId,
  );

  if (existingIndex >= 0) {
    checklists[existingIndex] = checklistWithAccount;
  } else {
    checklists.push(checklistWithAccount);
  }

  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify(checklists),
  );
}

/**
 * Delete the delivery checklist for a specific estimate
 * belonging to the current subscriber account.
 */
export function deleteDeliveryChecklist(
  accountId: string,
  estimateId: string,
): void {
  const stored = localStorage.getItem(STORAGE_KEY);

  if (!stored) {
    return;
  }

  let checklists: DeliveryChecklist[] = [];

  try {
    checklists = JSON.parse(stored) as DeliveryChecklist[];
  } catch {
    return;
  }

  const filteredChecklists = checklists.filter(
    (checklist) =>
      !(
        checklist.accountId === accountId &&
        checklist.estimateId === estimateId
      ),
  );

  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify(filteredChecklists),
  );
}

/**
 * Get delivery progress for an estimate
 * belonging to the current subscriber account.
 *
 * Delivery progress is stored separately from the estimate itself.
 */
export function getDeliveryProgress(
  accountId: string,
  estimateId: string,
  totalItems: number,
): {
  deliveredItems: number;
  totalItems: number;
  isDelivered: boolean;
  percentage: number;
} {
  if (totalItems <= 0) {
    return {
      deliveredItems: 0,
      totalItems: 0,
      isDelivered: false,
      percentage: 0,
    };
  }

  const checklist = getDeliveryChecklistByEstimateId(
    accountId,
    estimateId,
  );

  if (!checklist) {
    return {
      deliveredItems: 0,
      totalItems,
      isDelivered: false,
      percentage: 0,
    };
  }

  const deliveredItems =
    checklist.items.filter(
      (item) => item.delivered,
    ).length +
    checklist.additionalItems.filter(
      (item) => item.delivered,
    ).length;

  const percentage = Math.round(
    (deliveredItems / totalItems) * 100,
  );

  return {
    deliveredItems,
    totalItems,
    isDelivered:
      deliveredItems === totalItems,
    percentage,
  };
}
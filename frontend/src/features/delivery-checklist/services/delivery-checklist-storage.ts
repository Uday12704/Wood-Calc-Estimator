import type { DeliveryChecklist } from "../types";

const STORAGE_KEY = "wood-calc-delivery-checklists";

/**
 * Get all saved delivery checklists.
 */
export function getDeliveryChecklists(): DeliveryChecklist[] {
  const stored = localStorage.getItem(STORAGE_KEY);

  if (!stored) {
    return [];
  }

  try {
    return JSON.parse(stored) as DeliveryChecklist[];
  } catch {
    return [];
  }
}

/**
 * Get the delivery checklist for a specific estimate.
 */
export function getDeliveryChecklistByEstimateId(
  estimateId: string,
): DeliveryChecklist | null {
  const checklists = getDeliveryChecklists();

  return (
    checklists.find(
      (checklist) =>
        checklist.estimateId === estimateId,
    ) ?? null
  );
}

/**
 * Save or update a delivery checklist.
 */
export function saveDeliveryChecklist(
  checklist: DeliveryChecklist,
): void {
  const checklists = getDeliveryChecklists();

  const existingIndex = checklists.findIndex(
    (item) =>
      item.estimateId === checklist.estimateId,
  );

  if (existingIndex >= 0) {
    checklists[existingIndex] = checklist;
  } else {
    checklists.push(checklist);
  }

  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify(checklists),
  );
}

/**
 * Delete the delivery checklist for a specific estimate.
 */
export function deleteDeliveryChecklist(
  estimateId: string,
): void {
  const checklists = getDeliveryChecklists();

  const filteredChecklists = checklists.filter(
    (checklist) =>
      checklist.estimateId !== estimateId,
  );

  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify(filteredChecklists),
  );
}

/**
 * Get delivery progress for an estimate.
 *
 * Delivery progress is stored separately from the estimate itself.
 */
export function getDeliveryProgress(
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

  const checklist =
    getDeliveryChecklistByEstimateId(estimateId);

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
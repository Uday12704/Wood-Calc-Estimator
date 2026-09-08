import type {
  SavedCustomEstimate,
  SavedEstimate,
  SavedRoundSizeEstimate,
} from "../types";

const STORAGE_KEY_CUT = "wood-calc-cut-estimates";
const STORAGE_KEY_ROUND = "wood-calc-round-estimates";
const STORAGE_KEY_CUSTOM = "wood-calc-custom-estimates";

/* -------------------------------------------------------------------------- */
/* Helpers                                                                    */
/* -------------------------------------------------------------------------- */

function loadFromStorage<T>(key: string): T[] {
  try {
    const stored = localStorage.getItem(key);

    if (!stored) {
      return [];
    }

    return JSON.parse(stored) as T[];
  } catch (error) {
    console.error(`Failed to load data from ${key}:`, error);
    return [];
  }
}

function saveToStorage<T>(key: string, data: T[]): void {
  localStorage.setItem(key, JSON.stringify(data));
}

/* -------------------------------------------------------------------------- */
/* Cut Size Estimates                                                         */
/* -------------------------------------------------------------------------- */

export function getSavedEstimates(
  accountId: string,
): SavedEstimate[] {
  const estimates =
    loadFromStorage<SavedEstimate>(STORAGE_KEY_CUT);

  return estimates.filter(
    (estimate) =>
      estimate.accountId === accountId,
  );
}

export function getEstimateById(
  accountId: string,
  id: string,
): SavedEstimate | null {
  const estimates =
    getSavedEstimates(accountId);

  return (
    estimates.find(
      (estimate) =>
        estimate.id === id &&
        estimate.accountId === accountId,
    ) ?? null
  );
}

export function saveEstimate(
  accountId: string,
  estimate: SavedEstimate,
): void {
  const estimates =
    loadFromStorage<SavedEstimate>(
      STORAGE_KEY_CUT,
    );

  const estimateWithAccount: SavedEstimate = {
    ...estimate,
    accountId,
  };

  const existingIndex =
    estimates.findIndex(
      (item) =>
        item.id === estimate.id &&
        item.accountId === accountId,
    );

  if (existingIndex >= 0) {
    estimates[existingIndex] =
      estimateWithAccount;
  } else {
    estimates.push(
      estimateWithAccount,
    );
  }

  saveToStorage(
    STORAGE_KEY_CUT,
    estimates,
  );
}

export function deleteEstimate(
  accountId: string,
  id: string,
): void {
  const estimates =
    loadFromStorage<SavedEstimate>(
      STORAGE_KEY_CUT,
    );

  const updatedEstimates =
    estimates.filter(
      (estimate) =>
        !(
          estimate.id === id &&
          estimate.accountId === accountId
        ),
    );

  saveToStorage(
    STORAGE_KEY_CUT,
    updatedEstimates,
  );
}

/* -------------------------------------------------------------------------- */
/* Round Size Estimates                                                       */
/* -------------------------------------------------------------------------- */

export function getSavedRoundEstimates(
  accountId: string,
): SavedRoundSizeEstimate[] {
  const estimates =
    loadFromStorage<SavedRoundSizeEstimate>(
      STORAGE_KEY_ROUND,
    );

  return estimates.filter(
    (estimate) =>
      estimate.accountId === accountId,
  );
}

export function getRoundEstimateById(
  accountId: string,
  id: string,
): SavedRoundSizeEstimate | null {
  const estimates =
    getSavedRoundEstimates(accountId);

  return (
    estimates.find(
      (estimate) =>
        estimate.id === id &&
        estimate.accountId === accountId,
    ) ?? null
  );
}

export function saveRoundEstimate(
  accountId: string,
  estimate: SavedRoundSizeEstimate,
): void {
  const estimates =
    loadFromStorage<SavedRoundSizeEstimate>(
      STORAGE_KEY_ROUND,
    );

  const estimateWithAccount: SavedRoundSizeEstimate = {
    ...estimate,
    accountId,
  };

  const existingIndex =
    estimates.findIndex(
      (item) =>
        item.id === estimate.id &&
        item.accountId === accountId,
    );

  if (existingIndex >= 0) {
    estimates[existingIndex] =
      estimateWithAccount;
  } else {
    estimates.push(
      estimateWithAccount,
    );
  }

  saveToStorage(
    STORAGE_KEY_ROUND,
    estimates,
  );
}

export function deleteRoundEstimate(
  accountId: string,
  id: string,
): void {
  const estimates =
    loadFromStorage<SavedRoundSizeEstimate>(
      STORAGE_KEY_ROUND,
    );

  const updatedEstimates =
    estimates.filter(
      (estimate) =>
        !(
          estimate.id === id &&
          estimate.accountId === accountId
        ),
    );

  saveToStorage(
    STORAGE_KEY_ROUND,
    updatedEstimates,
  );
}

/* -------------------------------------------------------------------------- */
/* Custom Estimates                                                           */
/* -------------------------------------------------------------------------- */

export function getSavedCustomEstimates(
  accountId: string,
): SavedCustomEstimate[] {
  const estimates =
    loadFromStorage<SavedCustomEstimate>(
      STORAGE_KEY_CUSTOM,
    );

  return estimates.filter(
    (estimate) =>
      estimate.accountId === accountId,
  );
}

export function getCustomEstimateById(
  accountId: string,
  id: string,
): SavedCustomEstimate | null {
  const estimates =
    getSavedCustomEstimates(accountId);

  return (
    estimates.find(
      (estimate) =>
        estimate.id === id &&
        estimate.accountId === accountId,
    ) ?? null
  );
}

export function saveCustomEstimate(
  accountId: string,
  estimate: SavedCustomEstimate,
): void {
  const estimates =
    loadFromStorage<SavedCustomEstimate>(
      STORAGE_KEY_CUSTOM,
    );

  const estimateWithAccount: SavedCustomEstimate = {
    ...estimate,
    accountId,
  };

  const existingIndex =
    estimates.findIndex(
      (item) =>
        item.id === estimate.id &&
        item.accountId === accountId,
    );

  if (existingIndex >= 0) {
    estimates[existingIndex] =
      estimateWithAccount;
  } else {
    estimates.push(
      estimateWithAccount,
    );
  }

  saveToStorage(
    STORAGE_KEY_CUSTOM,
    estimates,
  );
}

export function deleteCustomEstimate(
  accountId: string,
  id: string,
): void {
  const estimates =
    loadFromStorage<SavedCustomEstimate>(
      STORAGE_KEY_CUSTOM,
    );

  const updatedEstimates =
    estimates.filter(
      (estimate) =>
        !(
          estimate.id === id &&
          estimate.accountId === accountId
        ),
    );

  saveToStorage(
    STORAGE_KEY_CUSTOM,
    updatedEstimates,
  );
}

/* -------------------------------------------------------------------------- */
/* Clear                                                                      */
/* -------------------------------------------------------------------------- */

export function clearAllEstimates(): void {
  localStorage.removeItem(
    STORAGE_KEY_CUT,
  );

  localStorage.removeItem(
    STORAGE_KEY_ROUND,
  );

  localStorage.removeItem(
    STORAGE_KEY_CUSTOM,
  );
}
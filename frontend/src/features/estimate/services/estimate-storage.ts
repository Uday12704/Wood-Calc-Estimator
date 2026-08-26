import type { SavedEstimate } from "../types";

const STORAGE_KEY =
  "wood-calc-estimates";

export function getSavedEstimates(): SavedEstimate[] {
  try {
    const stored =
      localStorage.getItem(STORAGE_KEY);

    if (!stored) {
      return [];
    }

    return JSON.parse(stored) as SavedEstimate[];
  } catch (error) {
    console.error(
      "Failed to load estimates:",
      error,
    );

    return [];
  }
}

export function getEstimateById(
  id: string,
): SavedEstimate | null {
  const estimates =
    getSavedEstimates();

  return (
    estimates.find(
      (estimate) =>
        estimate.id === id,
    ) ?? null
  );
}

export function saveEstimate(
  estimate: SavedEstimate,
): void {
  const estimates =
    getSavedEstimates();

  const existingIndex =
    estimates.findIndex(
      (item) =>
        item.id === estimate.id,
    );

  if (existingIndex >= 0) {
    estimates[existingIndex] =
      estimate;
  } else {
    estimates.push(estimate);
  }

  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify(estimates),
  );
}

export function deleteEstimate(
  id: string,
): void {
  const estimates =
    getSavedEstimates();

  const updatedEstimates =
    estimates.filter(
      (estimate) =>
        estimate.id !== id,
    );

  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify(
      updatedEstimates,
    ),
  );
}

export function clearAllEstimates(): void {
  localStorage.removeItem(
    STORAGE_KEY,
  );
}
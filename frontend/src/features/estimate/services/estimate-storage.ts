import type { SavedCustomEstimate, SavedEstimate, SavedRoundSizeEstimate } from "../types";

const STORAGE_KEY_CUT = "wood-calc-cut-estimates";
const STORAGE_KEY_ROUND = "wood-calc-round-estimates";
const STORAGE_KEY_CUSTOM = "wood-calc-custom-estimates";

export function getSavedEstimates(): SavedEstimate[] {
  try {
    const stored = localStorage.getItem(STORAGE_KEY_CUT);

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

export function getSavedRoundEstimates(): SavedRoundSizeEstimate[] {
  try {
    const stored = localStorage.getItem(STORAGE_KEY_ROUND);

    if (!stored) {
      return [];
    }

    return JSON.parse(stored) as SavedRoundSizeEstimate[];
  } catch (error) {
    console.error(
      "Failed to load estimates:",
      error,
    );

    return [];
  }
}

export function getSavedCustomEstimates(): SavedCustomEstimate[] {
  try {
    const stored = localStorage.getItem(STORAGE_KEY_CUSTOM);

    if (!stored) {
      return [];
    }

    return JSON.parse(stored) as SavedCustomEstimate[];
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

export function getRoundEstimateById(
  id: string,
): SavedRoundSizeEstimate | null {
  const estimates =
    getSavedRoundEstimates();

  return (
    estimates.find(
      (estimate) =>
        estimate.id === id,
    ) ?? null
  );
}

export function getCustomEstimateById(
  id: string,
): SavedCustomEstimate | null {
  const estimates =
    getSavedCustomEstimates();

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
    STORAGE_KEY_CUT,
    JSON.stringify(estimates),
  );
}

export function saveRoundEstimate(
  estimate: SavedRoundSizeEstimate,
): void {
  const estimates =
    getSavedRoundEstimates();

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
    STORAGE_KEY_ROUND,
    JSON.stringify(estimates),
  );
}

export function saveCustomEstimate(
  estimate: SavedCustomEstimate,
): void {
  const estimates =
    getSavedCustomEstimates();

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
    STORAGE_KEY_CUSTOM,
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
    STORAGE_KEY_CUT,
    JSON.stringify(
      updatedEstimates,
    ),
  );
}

export function deleteRoundEstimate(
  id: string,
): void {
  const estimates =
    getSavedRoundEstimates();

  const updatedEstimates =
    estimates.filter(
      (estimate) =>
        estimate.id !== id,
    );

  localStorage.setItem(
    STORAGE_KEY_ROUND,
    JSON.stringify(
      updatedEstimates,
    ),
  );
}

export function deleteCustomEstimate(
  id: string,
): void {
  const estimates =
    getSavedCustomEstimates();

  const updatedEstimates =
    estimates.filter(
      (estimate) =>
        estimate.id !== id,
    );

  localStorage.setItem(
    STORAGE_KEY_CUSTOM,
    JSON.stringify(
      updatedEstimates,
    ),
  );
}

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
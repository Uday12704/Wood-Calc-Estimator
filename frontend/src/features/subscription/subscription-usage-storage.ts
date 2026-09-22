
const STORAGE_KEY = "wood-calc-estimate-usage";

export interface EstimateUsage {
  accountId: string;
  periodStartDate: string;
  used: number;
  limit: number;
  lastSequence: number;
}

type UsageRecord = EstimateUsage[];

function readUsage(): UsageRecord {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return [];

    const parsed: unknown = JSON.parse(stored);
    return Array.isArray(parsed) ? (parsed as UsageRecord) : [];
  } catch {
    return [];
  }
}

function writeUsage(records: UsageRecord): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(records));
}

export function getEstimateUsage(
  accountId: string,
  periodStartDate: string,
): EstimateUsage {
  const records = readUsage();

  return (
    records.find(
      (record) =>
        record.accountId === accountId &&
        record.periodStartDate === periodStartDate,
    ) ?? {
      accountId,
      periodStartDate,
      used: 0,
      limit: 2000,
      lastSequence: 0,
    }
  );
}

export function saveEstimateUsage(
  usage: EstimateUsage,
): void {
  const records = readUsage();

  const index = records.findIndex(
    (record) =>
      record.accountId === usage.accountId &&
      record.periodStartDate === usage.periodStartDate,
  );

  if (index >= 0) {
    records[index] = usage;
  } else {
    records.push(usage);
  }

  writeUsage(records);
}

export function updateEstimateLimit(
  accountId: string,
  periodStartDate: string,
  newLimit: number,
): EstimateUsage {
  if (!Number.isInteger(newLimit) || newLimit < 0) {
    throw new Error("Estimate limit must be a non-negative whole number.");
  }

  const current = getEstimateUsage(accountId, periodStartDate);

  if (newLimit < current.used) {
    throw new Error(
      `The limit cannot be lower than the ${current.used} estimates already used.`,
    );
  }

  const updated = {
    ...current,
    limit: newLimit,
  };

  saveEstimateUsage(updated);
  return updated;
}

export function generateEstimateNumber(
  sequence: number,
  periodStartDate: string,
): string {
  if (!Number.isInteger(sequence) || sequence < 1) {
    throw new Error("Estimate sequence must be a positive whole number.");
  }

  const date = new Date(`${periodStartDate}T00:00:00`);

  if (Number.isNaN(date.getTime())) {
    throw new Error("Invalid subscription period start date.");
  }

  const year = date.getFullYear();
  // const month = String(date.getMonth() + 1).padStart(2, "0");
  // const day = String(date.getDate()).padStart(2, "0");
  // const period = `${year}${month}${day}`;
  const paddedSequence = String(sequence).padStart(4, "0");

  return `EST-${year}-${paddedSequence}`;
}
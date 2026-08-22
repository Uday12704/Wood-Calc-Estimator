export function generateEstimateNumber(): string {
  const now = new Date();

  const year = now.getFullYear();

  const randomPart = Math.floor(
    1000 + Math.random() * 9000,
  );

  return `EST-${year}-${randomPart}`;
}
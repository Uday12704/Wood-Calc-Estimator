import { getSavedCustomEstimates, getSavedEstimates, getSavedRoundEstimates } from "../estimate/services/estimate-storage";


export function getAccountEstimateCount(accountId: string): number {
  const cutEstimates = getSavedEstimates(accountId);
  const roundEstimates = getSavedRoundEstimates(accountId);
  const customEstimates = getSavedCustomEstimates(accountId);

  return (
    cutEstimates.length +
    roundEstimates.length +
    customEstimates.length
  );
}
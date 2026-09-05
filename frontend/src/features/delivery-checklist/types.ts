import type { SavedCustomEstimate, SavedEstimate, SavedRoundSizeEstimate } from "../estimate/types";

export type DeliveryEstimate =
  | SavedEstimate
  | SavedRoundSizeEstimate
  | SavedCustomEstimate;

export interface DeliveryItemStatus {
  itemId: string;
  delivered: boolean;
}

export interface DeliveryChecklist {
  estimateId: string;
  items: DeliveryItemStatus[];
  additionalItems: DeliveryItemStatus[];
  updatedAt: string;
}
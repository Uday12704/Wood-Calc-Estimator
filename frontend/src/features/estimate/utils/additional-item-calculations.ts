import type { CutSizeAdditionalItem } from "../types";

export function calculateAdditionalItem(
  pricePerUnit: number | "",
  quantity: number | "",
) {
  const price =
    pricePerUnit === ""
      ? 0
      : Number(pricePerUnit);

  const qty =
    quantity === ""
      ? 0
      : Number(quantity);

  const lineTotal =
    price * qty;

  return {
    lineTotal: Number(
      lineTotal.toFixed(2),
    ),
  };
}

export function calculateAdditionalItemsSubtotal(
  items: CutSizeAdditionalItem[],
) {
  return Number(
    items
      .reduce(
        (sum, item) =>
          sum + item.lineTotal,
        0,
      )
      .toFixed(2),
  );
}
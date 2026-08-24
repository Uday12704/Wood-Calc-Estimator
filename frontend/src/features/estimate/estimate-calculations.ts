export type DiscountType =
  | "flat"
  | "percentage";

export interface CalculateEstimateParams {
  items: {
    lineTotal: number;
    totalCft: number;
  }[];

  otherCharges: {
    amount: number;
  }[];

  gstEnabled: boolean;
  gstRate: number;

  discountType: DiscountType;
  discountValue: number;

  advancePaid: number;
}

export function calculateEstimateTotals({
  items,
  otherCharges,
  gstEnabled,
  gstRate,
  discountType,
  discountValue,
  advancePaid,
}: CalculateEstimateParams) {
  const subtotal = items.reduce(
    (sum, item) => sum + item.lineTotal,
    0,
  );

  const totalCft = items.reduce(
    (sum, item) => sum + item.totalCft,
    0,
  );

  const totalOtherCharges = otherCharges.reduce(
    (sum, charge) => sum + charge.amount,
    0,
  );

  // GST applies ONLY to subtotal
  const gstAmount = gstEnabled
    ? (subtotal * gstRate) / 100
    : 0;

  let discountAmount = 0;

  if (discountType === "percentage") {
    discountAmount =
      (subtotal * discountValue) / 100;
  } else {
    discountAmount = discountValue;
  }

  const grandTotal =
    subtotal +
    gstAmount +
    totalOtherCharges -
    discountAmount;

  const balanceDue =
    grandTotal - advancePaid;

  return {
    subtotal,
    gstAmount,
    totalOtherCharges,
    discountAmount,
    grandTotal,
    advancePaid,
    balanceDue,
    totalCft,
  };
}
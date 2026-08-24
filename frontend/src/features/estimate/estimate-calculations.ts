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

  const gstAmount = gstEnabled
    ? (subtotal * gstRate) / 100
    : 0;

  let discountAmount = 0;

  if (discountType === "percentage") {
    const percentage = Math.min(
      Math.max(discountValue, 0),
      100,
    );

    discountAmount =
      (subtotal * percentage) / 100;
  } else {
    discountAmount = Math.min(
      Math.max(discountValue, 0),
      subtotal,
    );
  }

  const grandTotal = Math.max(
    0,
    subtotal +
      gstAmount +
      totalOtherCharges -
      discountAmount,
  );

  const validAdvancePaid = Math.min(
    Math.max(advancePaid, 0),
    grandTotal,
  );

  const balanceDue =
    grandTotal - validAdvancePaid;

  return {
    subtotal,
    gstAmount,
    totalOtherCharges,
    discountAmount,
    grandTotal,
    advancePaid: validAdvancePaid,
    balanceDue,
    totalCft,
  };
}
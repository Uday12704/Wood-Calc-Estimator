import type { CalculationMode } from "../types";

export type DiscountType =
  | "flat"
  | "percentage";

export interface CalculateEstimateParams {
  items: {
    lineTotal: number;
    total: number;
    calculationMode: CalculationMode;
  }[];

  additionalItems: {
    lineTotal: number;
  }[];

  additionalGstEnabled: boolean;
  additionalGstRate: number;

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
  additionalItems,
  otherCharges,
  gstEnabled,
  gstRate,
  additionalGstEnabled,
  additionalGstRate,
  discountType,
  discountValue,
  advancePaid,
}: CalculateEstimateParams) {
  /*
   * ----------------------------------------
   * SUBTOTAL
   * ----------------------------------------
   */

  const subtotal = items.reduce(
    (sum, item) =>
      sum + item.lineTotal,
    0,
  );

  const additionalSubtotal = additionalItems.reduce(
    (sum, item) =>
      sum + item.lineTotal,
    0,
  );

  /*
   * ----------------------------------------
   * TOTAL CFT
   * ----------------------------------------
   *
   * Only add rows whose calculation mode
   * is CFT.
   */

  const totalCft = items.reduce(
    (sum, item) => {
      if (
        item.calculationMode === "CFT"
      ) {
        return sum + item.total;
      }

      return sum;
    },
    0,
  );

  /*
   * ----------------------------------------
   * TOTAL SQFT
   * ----------------------------------------
   *
   * Only add rows whose calculation mode
   * is SQFT.
   */

  const totalSqft = items.reduce(
    (sum, item) => {
      if (
        item.calculationMode === "SQFT"
      ) {
        return sum + item.total;
      }

      return sum;
    },
    0,
  );

  /*
   * ----------------------------------------
   * OTHER CHARGES
   * ----------------------------------------
   */

  const totalOtherCharges =
    otherCharges.reduce(
      (sum, charge) =>
        sum + charge.amount,
      0,
    );

  /*
   * ----------------------------------------
   * GST
   * ----------------------------------------
   *
   * GST is applied ONLY to subtotal.
   *
   * Other charges are NOT included.
   */

  const gstAmount = gstEnabled
    ? (subtotal * gstRate) / 100
    : 0;

  const additionalGstAmount =
    additionalGstEnabled
    ? (additionalSubtotal * additionalGstRate) / 100
    : 0;

  const additionalTotal = additionalSubtotal + additionalGstAmount;

  /*
   * ----------------------------------------
   * DISCOUNT
   * ----------------------------------------
   */

  let discountAmount = 0;

  if (
    discountType ===
    "percentage"
  ) {
    const percentage = Math.min(
      Math.max(
        discountValue,
        0,
      ),
      100,
    );

    discountAmount =
      (subtotal * percentage) /
      100;
  } else {
    discountAmount = Math.min(
      Math.max(
        discountValue,
        0,
      ),
      subtotal,
    );
  }

  /*
   * ----------------------------------------
   * GRAND TOTAL
   * ----------------------------------------
   */

  const grandTotal = Math.max(
  0,
  subtotal +
    gstAmount +
    additionalTotal +
    totalOtherCharges -
    discountAmount,
);

  /*
   * ----------------------------------------
   * ADVANCE PAYMENT
   * ----------------------------------------
   */

  const validAdvancePaid =
    Math.min(
      Math.max(
        advancePaid,
        0,
      ),
      grandTotal,
    );

  /*
   * ----------------------------------------
   * BALANCE DUE
   * ----------------------------------------
   */

  const balanceDue =
    grandTotal -
    validAdvancePaid;

  return {
    subtotal,

    gstAmount,

    additionalSubtotal,

    additionalGstAmount,

    additionalTotal,

    totalOtherCharges,

    discountAmount,

    grandTotal,

    advancePaid:
      validAdvancePaid,

    balanceDue,

    totalCft:
      Number(
        totalCft.toFixed(2),
      ),

    totalSqft:
      Number(
        totalSqft.toFixed(2),
      ),
  };
}
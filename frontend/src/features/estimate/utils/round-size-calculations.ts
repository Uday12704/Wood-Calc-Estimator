
interface RoundSizeCalculationInput {
  length: number | "";
  girth: number | "";
}

export function calculateRoundSizeItem(
  input: RoundSizeCalculationInput,
) {
  const length =
    input.length === ""
      ? 0
      : Number(input.length);

  const girth =
    input.girth === ""
      ? 0
      : Number(input.girth)/100;

  if (
    length <= 0 ||
    girth <= 0
  ) {
    return {
      cbm: 0,
      cft: 0,
    };
  }

  const cbm =
    (girth * girth * length) /
    16;

  const cft =
    cbm * 35.315;

  return {
    cbm: Number(cbm.toFixed(3)),
    cft: Number(cft.toFixed(2)),
  };
}

export type DiscountType =
  | "flat"
  | "percentage";

export interface CalculateRoundSizeEstimateParams {
  items: {
    cbm: number;
    cft: number;
    girth: number | "";
  }[];

  pricePerCbm: number | "";

  cftEnabled: boolean;

  otherCharges: {
    amount: number;
  }[];

  gstEnabled: boolean;
  gstRate: number;

  discountType: DiscountType;
  discountValue: number;

  advancePaid: number;
}

export function calculateRoundSizeEstimateTotals({
  items,
  pricePerCbm,
  cftEnabled,
  otherCharges,
  gstEnabled,
  gstRate,
  discountType,
  discountValue,
  advancePaid,
}: CalculateRoundSizeEstimateParams) {

  /*
   * ----------------------------------------
   * TOTAL CBM
   * ----------------------------------------
   */

  const totalCbm =
    items.reduce(
      (sum, item) =>
        sum + item.cbm,
      0,
    );

  /*
   * ----------------------------------------
   * TOTAL CFT
   * ----------------------------------------
   *
   * Only calculate/use it when
   * CFT is enabled.
   */

  const totalCft = cftEnabled
    ? items.reduce(
        (sum, item) =>
          sum + item.cft,
        0,
      )
    : 0;

  /*
   * ----------------------------------------
   * AVERAGE GIRTH
   * ----------------------------------------
   */

  const validGirths =
    items
      .map((item) =>
        item.girth === ""
          ? 0
          : Number(item.girth),
      )
      .filter(
        (girth) => girth > 0,
      );

  const avgGirth =
    validGirths.length > 0
      ? validGirths.reduce(
          (sum, girth) =>
            sum + girth,
          0,
        ) /
        validGirths.length
      : 0;

  /*
   * ----------------------------------------
   * PRICE / CBM
   * ----------------------------------------
   */

  const validPrice =
    pricePerCbm === ""
      ? 0
      : Math.max(
          Number(pricePerCbm),
          0,
        );

  /*
   * ----------------------------------------
   * SUBTOTAL
   * ----------------------------------------
   *
   * Total CBM × Price / CBM
   */

  const subtotal =
    totalCbm * validPrice;

  /*
   * ----------------------------------------
   * OTHER CHARGES
   * ----------------------------------------
   */

  const totalOtherCharges =
    otherCharges.reduce(
      (sum, charge) =>
        sum + Math.max(
          Number(charge.amount),
          0,
        ),
      0,
    );

  /*
   * ----------------------------------------
   * GST
   * ----------------------------------------
   *
   * GST applies ONLY to subtotal.
   */

  const gstAmount = gstEnabled
    ? (subtotal * gstRate) / 100
    : 0;

  /*
   * ----------------------------------------
   * DISCOUNT
   * ----------------------------------------
   *
   * Discount applies to subtotal.
   * Same behavior as Cut Size.
   */

  let discountAmount = 0;

  if (
    discountType ===
    "percentage"
  ) {
    const percentage =
      Math.min(
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
    discountAmount =
      Math.min(
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

  const grandTotal =
    Math.max(
      0,
      subtotal +
        gstAmount +
        totalOtherCharges -
        discountAmount,
    );

  /*
   * ----------------------------------------
   * ADVANCE
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
    totalCbm: Number(
      totalCbm.toFixed(3),
    ),

    totalCft: Number(
      totalCft.toFixed(2),
    ),

    avgGirth: Number(
      avgGirth.toFixed(2),
    ),

    pricePerCbm:
      validPrice,

    subtotal: Number(
      subtotal.toFixed(2),
    ),

    gstAmount: Number(
      gstAmount.toFixed(2),
    ),

    totalOtherCharges:
      Number(
        totalOtherCharges.toFixed(2),
      ),

    discountAmount:
      Number(
        discountAmount.toFixed(2),
      ),

    grandTotal: Number(
      grandTotal.toFixed(2),
    ),

    advancePaid:
      Number(
        validAdvancePaid.toFixed(2),
      ),

    balanceDue:
      Number(
        balanceDue.toFixed(2),
      ),
  };
}
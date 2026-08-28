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
      : Number(input.girth);

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

export interface RoundSizeTotalsParams {
  items: {
    cbm: number;
    cft: number;
    girth: number | "";
  }[];

  pricePerCbm: number | "";

  cftEnabled: boolean;
}

export function calculateRoundSizeTotals({
  items,
  pricePerCbm,
  cftEnabled,
}: RoundSizeTotalsParams) {
  const totalCbm =
    items.reduce(
      (sum, item) =>
        sum + item.cbm,
      0,
    );

  const totalCft = cftEnabled
    ? items.reduce(
        (sum, item) =>
          sum + item.cft,
        0,
      )
    : 0;

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
        ) / validGirths.length
      : 0;

  const price =
    pricePerCbm === ""
      ? 0
      : Number(pricePerCbm);

  /*
   * TOTAL CBM × PRICE / CBM
   */

  const subtotal =
    totalCbm * price;

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

    pricePerCbm: price,

    subtotal: Number(
      subtotal.toFixed(2),
    ),
  };
}
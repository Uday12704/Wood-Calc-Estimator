import type {
  CalculationMode,
} from "../types";

interface WoodCalculationInput {
  width: number | "";
  height: number | "";
  length: number | "";
  quantity: number | "";
  pricePerUnit: number | "";
  calculationMode: CalculationMode;
}

function toNumber(
  value: number | "",
): number {
  return value === "" ? 0 : Number(value);
}

export function calculateWoodItem(
  input: WoodCalculationInput,
) {
  const width = toNumber(input.width);
  const height = toNumber(input.height);
  const length = toNumber(input.length);
  const quantity = toNumber(input.quantity);
  const price = toNumber(input.pricePerUnit);

  if (
    width <= 0 ||
    height <= 0 ||
    length <= 0 ||
    quantity <= 0
  ) {
    return {
      total: 0,
      lineTotal: 0,
    };
  }

  let total = 0;

  if (input.calculationMode === "CFT") {
    /*
     * CFT
     *
     * Width(in) × Height(in) × Length(ft)
     * --------------------------------------
     *                 144
     *
     * × Quantity
     */

    total =
      (width *
        height *
        length *
        quantity) /
      144;
  }

  if (input.calculationMode === "SQFT") {
    /*
     * SqFt
     *
     * Width(in) × Height(in) × Length(ft)
     * --------------------------------------
     *                 12
     *
     * × Quantity
     */

    total =
      (width *
        height *
        length *
        quantity) /
      12;
  }

  const lineTotal =
    total * price;

  return {
    total: Number(total.toFixed(2)),
    lineTotal: Number(lineTotal.toFixed(2)),
  };
}
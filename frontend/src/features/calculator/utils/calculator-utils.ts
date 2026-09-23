// ============================================================
// UNIT CONVERTER
// ============================================================

export type UnitCategory =
  | "LENGTH"
  | "AREA"
  | "VOLUME";

export interface Unit {
  value: string;
  label: string;
  shortLabel: string;
  factor: number;
}

export const units: Record<
  UnitCategory,
  Unit[]
> = {
  LENGTH: [
    {
      value: "inch",
      label: "Inch",
      shortLabel: "in",
      factor: 0.0254,
    },
    {
      value: "ft",
      label: "Feet",
      shortLabel: "ft",
      factor: 0.3048,
    },
    {
      value: "mm",
      label: "Millimeter",
      shortLabel: "mm",
      factor: 0.001,
    },
    {
      value: "cm",
      label: "Centimeter",
      shortLabel: "cm",
      factor: 0.01,
    },
    {
      value: "m",
      label: "Meter",
      shortLabel: "m",
      factor: 1,
    },
  ],

  AREA: [
    {
      value: "sqinch",
      label: "Square Inch",
      shortLabel: "sq in",
      factor: 0.00064516,
    },
    {
      value: "sqft",
      label: "Square Feet",
      shortLabel: "sq ft",
      factor: 0.09290304,
    },
    {
      value: "sqm",
      label: "Square Meter",
      shortLabel: "sq m",
      factor: 1,
    },
  ],

  VOLUME: [
    {
      value: "cuinch",
      label: "Cubic Inch",
      shortLabel: "cu in",
      factor: 0.000016387064,
    },
    {
      value: "cft",
      label: "Cubic Feet",
      shortLabel: "CFT",
      factor: 0.028316846592,
    },
    {
      value: "cbm",
      label: "Cubic Meter",
      shortLabel: "CBM",
      factor: 1,
    },
  ],
};

export const categoryOptions = [
  {
    value: "LENGTH" as const,
    label: "Length",
  },
  {
    value: "AREA" as const,
    label: "Area",
  },
  {
    value: "VOLUME" as const,
    label: "Volume",
  },
];

export function convertUnit(
  value: number,
  fromUnit: Unit,
  toUnit: Unit,
): number {
  if (
    !Number.isFinite(value) ||
    !Number.isFinite(fromUnit.factor) ||
    !Number.isFinite(toUnit.factor)
  ) {
    return 0;
  }

  return (
    (value * fromUnit.factor) /
    toUnit.factor
  );
}

export function formatCalculatorNumber(
  value: number,
): string {
  if (!Number.isFinite(value)) {
    return "0";
  }

  return new Intl.NumberFormat("en-IN", {
    maximumFractionDigits: 8,
  }).format(value);
}


// ============================================================
// CFT CALCULATOR
// ============================================================

export interface CftCalculationInput {
  width: number;
  height: number;
  length: number;
  quantity: number;
}

export function calculateCft({
  width,
  height,
  length,
  quantity,
}: CftCalculationInput): number {
  if (
    !Number.isFinite(width) ||
    !Number.isFinite(height) ||
    !Number.isFinite(length) ||
    !Number.isFinite(quantity)
  ) {
    return 0;
  }

  if (
    width <= 0 ||
    height <= 0 ||
    length <= 0 ||
    quantity <= 0
  ) {
    return 0;
  }

  return (
    (width *
      height *
      length *
      quantity) /
    144
  );
}


// ============================================================
// NUMERIC CALCULATOR
// ============================================================

export const numericOperators = [
  "+",
  "-",
  "x",
  "÷",
];

export interface CalculationResult {
  value: number;
  formatted: string;
}

function getOperatorPrecedence(
  operator: string,
): number {
  if (
    operator === "x" ||
    operator === "÷"
  ) {
    return 2;
  }

  if (
    operator === "+" ||
    operator === "-"
  ) {
    return 1;
  }

  return 0;
}

function applyNumericOperation(
  values: number[],
  operators: string[],
): void {
  const operator = operators.pop();
  const right = values.pop();
  const left = values.pop();

  if (
    operator === undefined ||
    left === undefined ||
    right === undefined
  ) {
    throw new Error(
      "Invalid expression",
    );
  }

  switch (operator) {
    case "+":
      values.push(left + right);
      break;

    case "-":
      values.push(left - right);
      break;

    case "x":
      values.push(left * right);
      break;

    case "÷":
      if (right === 0) {
        throw new Error(
          "Cannot divide by zero",
        );
      }

      values.push(left / right);
      break;

    default:
      throw new Error(
        "Invalid operator",
      );
  }
}

export function evaluateExpression(
  expression: string,
): CalculationResult {
  if (!expression.trim()) {
    throw new Error(
      "Invalid expression",
    );
  }

  const sanitized = expression
    .replace(/%/g, "/100");

  if (
    !/^[0-9+\-x÷().%\s]+$/.test(
      sanitized,
    )
  ) {
    throw new Error(
      "Invalid expression",
    );
  }

  const tokens = sanitized.match(
    /(\d+(?:\.\d+)?|[+\-x÷()/%])/g,
  );

  if (!tokens) {
    throw new Error(
      "Invalid expression",
    );
  }

  const values: number[] = [];
  const operators: string[] = [];

  for (const token of tokens) {
    if (!Number.isNaN(Number(token))) {
      values.push(Number(token));
      continue;
    }

    if (token === "%") {
      operators.push("/");
      values.push(100);
      continue;
    }

    if (token === "(") {
      operators.push(token);
      continue;
    }

    if (token === ")") {
      while (
        operators.length > 0 &&
        operators[
          operators.length - 1
        ] !== "("
      ) {
        applyNumericOperation(
          values,
          operators,
        );
      }

      if (
        operators.pop() !== "("
      ) {
        throw new Error(
          "Invalid parentheses",
        );
      }

      continue;
    }

    while (
      operators.length > 0 &&
      operators[
        operators.length - 1
      ] !== "(" &&
      getOperatorPrecedence(
        operators[
          operators.length - 1
        ],
      ) >=
        getOperatorPrecedence(token)
    ) {
      applyNumericOperation(
        values,
        operators,
      );
    }

    operators.push(token);
  }

  while (operators.length > 0) {
    if (
      operators[
        operators.length - 1
      ] === "("
    ) {
      throw new Error(
        "Invalid parentheses",
      );
    }

    applyNumericOperation(
      values,
      operators,
    );
  }

  if (values.length !== 1) {
    throw new Error(
      "Invalid expression",
    );
  }

  const calculatedValue =
    values[0];

  if (
    !Number.isFinite(
      calculatedValue,
    )
  ) {
    throw new Error(
      "Invalid result",
    );
  }

  const formatted =
    Number(
      calculatedValue.toFixed(10),
    ).toString();

  return {
    value: calculatedValue,
    formatted,
  };
}

export function replaceTrailingOperator(
  expression: string,
  value: string,
): string {
  if (
    !numericOperators.includes(value)
  ) {
    return expression + value;
  }

  const lastCharacter =
    expression.slice(-1);

  if (
    numericOperators.includes(
      lastCharacter,
    )
  ) {
    return (
      expression.slice(0, -1) +
      value
    );
  }

  return expression + value;
}
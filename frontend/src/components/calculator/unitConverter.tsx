import { useMemo, useState } from "react";
import { ArrowDownUp, RotateCcw } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { categoryOptions, convertUnit, formatCalculatorNumber, units } from "@/features/calculator/utils/calculator-utils";
import type { UnitCategory } from "@/features/calculator/types";


export default function UnitConverter() {
  const [category, setCategory] =
    useState<UnitCategory>("LENGTH");

  const [fromUnit, setFromUnit] =
    useState("ft");

  const [toUnit, setToUnit] =
    useState("m");

  const [value, setValue] = useState("");

  const currentUnits = units[category];

  const from = currentUnits.find(
    (unit) => unit.value === fromUnit,
  );

  const to = currentUnits.find(
    (unit) => unit.value === toUnit,
  );

  const result = useMemo(() => {
    if (
      value === "" ||
      !from ||
      !to
    ) {
      return null;
    }

    const numericValue = Number(value);

    if (
      !Number.isFinite(numericValue)
    ) {
      return null;
    }

    return convertUnit(
        numericValue,
        from,
        to,
    );
  }, [value, from, to]);

  function handleCategoryChange(
    newCategory: UnitCategory,
  ) {
    setCategory(newCategory);

    const newUnits = units[newCategory];

    setFromUnit(
      newUnits[0].value,
    );

    setToUnit(
      newUnits[1]?.value ??
        newUnits[0].value,
    );

    setValue("");
  }

  function handleSwap() {
    setFromUnit(toUnit);
    setToUnit(fromUnit);
  }

  function handleClear() {
    setValue("");
  }

  const fromUnitLabel =
    from?.shortLabel ?? "";

  const toUnitLabel =
    to?.shortLabel ?? "";

  return (
    <div className="space-y-5">
      {/* TITLE */}
      <div>
        <h3 className="text-base font-semibold">
          Unit Converter
        </h3>

        <p className="mt-1 text-sm text-muted-foreground">
          Convert measurements quickly.
        </p>
      </div>

      {/* CATEGORY */}
      <div className="grid grid-cols-3 gap-2">
        {categoryOptions.map(
          (option) => {
            const isActive =
              category === option.value;

            return (
              <button
                key={option.value}
                type="button"
                onClick={() =>
                  handleCategoryChange(
                    option.value,
                  )
                }
                className={[
                  "rounded-lg border px-3 py-2.5 text-sm font-medium transition-colors",
                  isActive
                    ? "border-primary bg-primary text-primary-foreground"
                    : "bg-background hover:bg-accent",
                ].join(" ")}
              >
                {option.label}
              </button>
            );
          },
        )}
      </div>

      {/* FROM */}
      <div className="space-y-2">
        <label className="text-sm font-medium">
          From
        </label>

        <div className="rounded-xl border bg-muted/20 p-3">
          <Input
            type="number"
            inputMode="decimal"
            min="0"
            step="any"
            placeholder="Enter value"
            value={value}
            onChange={(event) =>
              setValue(
                event.target.value,
              )
            }
            className="border-0 bg-transparent px-1 text-2xl font-semibold shadow-none focus-visible:ring-0"
          />

          <Select
            value={fromUnit}
            onValueChange={(value) => {
                if (value !== null) {
                setFromUnit(value);
                }
            }}
            >
            <SelectTrigger className="mt-1 border-0 bg-background shadow-none">
              <SelectValue />
            </SelectTrigger>

            <SelectContent>
              {currentUnits.map(
                (unit) => (
                  <SelectItem
                    key={unit.value}
                    value={unit.value}
                  >
                    {unit.label} (
                    {
                      unit.shortLabel
                    }
                    )
                  </SelectItem>
                ),
              )}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* SWAP */}
      <div className="flex justify-center">
        <Button
          type="button"
          variant="outline"
          size="icon"
          className="rounded-full"
          onClick={handleSwap}
        >
          <ArrowDownUp className="size-4" />

          <span className="sr-only">
            Swap units
          </span>
        </Button>
      </div>

      {/* TO */}
      <div>
        <label className="text-sm font-medium">
          To
        </label>

        <div className="rounded-xl border bg-muted/20 p-3">
          <div className="flex min-h-10 items-center px-1 text-2xl font-semibold">
            {result === null
              ? "0"
              : formatCalculatorNumber(result)}
          </div>

          <Select
            value={toUnit}
            onValueChange={(value) => {
                if (value !== null) {
                setToUnit(value);
                }
            }}
            >
            <SelectTrigger className="mt-1 border-0 bg-background shadow-none">
              <SelectValue />
            </SelectTrigger>

            <SelectContent>
              {currentUnits.map(
                (unit) => (
                  <SelectItem
                    key={unit.value}
                    value={unit.value}
                  >
                    {unit.label} (
                    {
                      unit.shortLabel
                    }
                    )
                  </SelectItem>
                ),
              )}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* RESULT SUMMARY */}
      {result !== null && (
        <div className="rounded-xl border bg-orange-100/20 p-4">
          <p className="text-xs text-muted-foreground">
            Conversion
          </p>

          <p className="mt-1 break-all text-sm font-medium">
            {formatCalculatorNumber(
              Number(value),
            )}{" "}
            {fromUnitLabel}{" "}
            <span className="text-muted-foreground">
              =
            </span>{" "}
            {formatCalculatorNumber(result)}{" "}
            {toUnitLabel}
          </p>
        </div>
      )}

      {/* CLEAR */}
      <Button
        type="button"
        variant="outline"
        className="w-full"
        onClick={handleClear}
        disabled={value === ""}
      >
        <RotateCcw className="mr-2 size-4" />
        Clear
      </Button>
    </div>
  );
}
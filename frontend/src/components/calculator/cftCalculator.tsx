import { useMemo, useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { calculateCft } from "@/features/calculator/utils/calculator-utils";

export default function CftCalculator() {
  const [breadth, setBreadth] = useState("");
  const [height, setHeight] = useState("");
  const [length, setLength] = useState("");
  const [quantity, setQuantity] = useState("1");

  const totalCft = useMemo(() => {
    return calculateCft({
      breadth: Number(breadth),
      height: Number(height),
      length: Number(length),
      quantity: Number(quantity),
    });
  }, [
    breadth,
    height,
    length,
    quantity,
  ]);

  function clearCalculator() {
    setBreadth("");
    setHeight("");
    setLength("");
    setQuantity("1");
  }

  return (
    <div className="space-y-5">
      <div>
        <h3 className="text-sm font-semibold">
          Cut Size CFT
        </h3>

        <p className="mt-1 text-sm text-muted-foreground">
          Calculate cubic feet for rectangular
          timber.
        </p>
      </div>

      <div className="space-y-2">
        <label
          htmlFor="cft-breadth"
          className="text-sm font-medium"
        >
          Breadth (in)
        </label>

        <Input
          id="cft-breadth"
          type="number"
          min="0"
          step="any"
          inputMode="decimal"
          placeholder="Enter breadth"
          value={breadth}
          onChange={(event) =>
            setBreadth(event.target.value)
          }
          className="bg-orange-100/30"
        />
      </div>

      <div className="space-y-2">
        <label
          htmlFor="cft-height"
          className="text-sm font-medium"
        >
          Height (in)
        </label>

        <Input
          id="cft-height"
          type="number"
          min="0"
          step="any"
          inputMode="decimal"
          placeholder="Enter height"
          value={height}
          onChange={(event) =>
            setHeight(event.target.value)
          }
          className="bg-orange-100/30"
        />
      </div>

      <div className="space-y-2">
        <label
          htmlFor="cft-length"
          className="text-sm font-medium"
        >
          Length (ft)
        </label>

        <Input
          id="cft-length"
          type="number"
          min="0"
          step="any"
          inputMode="decimal"
          placeholder="Enter length"
          value={length}
          onChange={(event) =>
            setLength(event.target.value)
          }
          className="bg-orange-100/30"
        />
      </div>

      <div className="space-y-2">
        <label
          htmlFor="cft-quantity"
          className="text-sm font-medium"
        >
          Quantity
        </label>

        <Input
          id="cft-quantity"
          type="number"
          min="1"
          step="1"
          inputMode="numeric"
          placeholder="Enter quantity"
          value={quantity}
          onChange={(event) =>
            setQuantity(event.target.value)
          }
          className="bg-orange-100/30"
        />
      </div>

      <div className="rounded-xl border bg-orange-100/30 p-5">
        <p className="text-sm text-muted-foreground">
          Total CFT
        </p>

        <p className="mt-2 text-3xl font-semibold">
          {totalCft.toFixed(3)} CFT
        </p>

        <p className="mt-2 text-xs text-muted-foreground">
          ({breadth || 0} x {height || 0} x{" "}
          {length || 0} x {quantity || 0}) ÷ 144
        </p>
      </div>

      <Button
        type="button"
        className="w-full bg-wood-primary cursor-pointer"
        onClick={clearCalculator}
      >
        Clear
      </Button>
    </div>
  );
}
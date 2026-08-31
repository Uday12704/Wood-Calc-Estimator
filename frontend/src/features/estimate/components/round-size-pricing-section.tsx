import { Input } from "@/components/ui/input";

interface RoundSizePricingSectionProps {
  totalCbm: number;
  pricePerCbm: number | "";
  subtotal: number;

  onPriceChange: (
    value: number | "",
  ) => void;
}

export function RoundSizePricingSection({
  totalCbm,
  pricePerCbm,
  subtotal,
  onPriceChange,
}: RoundSizePricingSectionProps) {
  return (
    <div className="rounded-xl border bg-card p-4">
      <div className="grid gap-4 sm:grid-cols-3">

        {/* TOTAL CBM */}

        <div className="space-y-1">
          <p className="text-sm text-muted-foreground">
            Total CBM
          </p>

          <p className="text-lg font-semibold">
            {totalCbm.toFixed(3)} CBM
          </p>
        </div>

        {/* PRICE / CBM */}

        <div className="space-y-1">
          <label
            htmlFor="price-per-cbm"
            className="text-sm text-muted-foreground"
          >
            Price / CBM
          </label>

          <Input
            id="price-per-cbm"
            type="number"
            min="0"
            step="0.01"
            value={pricePerCbm}
            onChange={(event) => {
              const value =
                event.target.value;

              onPriceChange(
                value === ""
                  ? ""
                  : Number(value),
              );
            }}
            placeholder="Enter price"
            className="h-9"
          />
        </div>

        {/* SUBTOTAL */}

        <div className="space-y-1">
          <p className="text-sm text-muted-foreground">
            Subtotal
          </p>

          <p className="text-lg font-semibold">
            ₹ {subtotal.toFixed(2)}
          </p>
        </div>

      </div>
    </div>
  );
}
import { formatCurrency } from "@/lib/formatters";

interface EstimateSummaryProps {
  subtotal: number;
  gstEnabled: boolean;
  gstRate: number;
  gstAmount: number;
  otherCharges: number;
  discountAmount: number;
  discountType: "flat" | "percentage";
  discountValue: number;
  grandTotal: number;
  advancePaid: number;
  balanceDue: number;

  totalCft: number;
  totalSqft: number;
}

export function EstimateSummary({
  subtotal,
  gstEnabled,
  gstRate,
  gstAmount,
  otherCharges,
  discountAmount,
  discountType,
  discountValue,
  grandTotal,
  advancePaid,
  balanceDue,
  totalCft,
  totalSqft,
}: EstimateSummaryProps) {
  return (
    <div className="rounded-xl border bg-card p-5">
      <h3 className="text-sm font-semibold uppercase tracking-wide">
        Summary
      </h3>

      <div className="mt-5 space-y-3 text-sm">

        {/* SUBTOTAL */}

        <div className="flex justify-between">
          <span className="text-muted-foreground">
            Subtotal
          </span>

          <span className="font-medium">
            {formatCurrency(subtotal)}
          </span>
        </div>

        {/* GST */}

        {gstEnabled && (
        <div className="space-y-2">
          <div className="flex justify-between">
            <span className="text-muted-foreground">
              GST ({gstRate}%)
            </span>

            <span>
              {formatCurrency(gstAmount)}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">
              Total
            </span>

            <span className="font-medium">
              {formatCurrency( subtotal + gstAmount)}
            </span>
          </div>
        </div>
        )}

        {/* OTHER CHARGES */}

        <div className="flex justify-between">
          <span className="text-muted-foreground">
            Other Charges
          </span>

          <span>
            {formatCurrency(otherCharges)}
          </span>
        </div>

        {/* DISCOUNT */}

        {discountAmount > 0 && (
          <div className="flex justify-between">
            <span className="text-muted-foreground">
              Discount (
              {discountType ===
              "percentage"
                ? `${discountValue}%`
                : "Flat"}
              )
            </span>

            <span className="text-destructive">
              -{formatCurrency(
                discountAmount,
              )}
            </span>
          </div>
        )}

        <div className="my-4 border-t" />

        {/* GRAND TOTAL */}

        <div className="flex items-center justify-between">
          <span className="font-semibold">
            Grand Total
          </span>

          <span className="text-2xl font-bold text-primary">
            {formatCurrency(grandTotal)}
          </span>
        </div>

        <div className="border-t border-dashed pt-4" />

        {/* ADVANCE */}

        <div className="flex justify-between">
          <span className="text-emerald-600">
            Advance Paid
          </span>

          <span className="text-emerald-600">
            -{formatCurrency(advancePaid)}
          </span>
        </div>

        {/* BALANCE */}

        <div className="flex justify-between pt-2">
          <span className="font-bold text-destructive">
            Balance Due
          </span>

          <span className="text-xl font-bold text-destructive">
            {formatCurrency(balanceDue)}
          </span>
        </div>

        {/* CFT */}

        {totalCft > 0 && (
          <div className="flex justify-between pt-2 text-xs">
            <span className="text-muted-foreground">
              Total CFT
            </span>

            <span>
              {totalCft.toFixed(2)}
            </span>
          </div>
        )}

        {/* SQFT */}

        {totalSqft > 0 && (
          <div className="flex justify-between pt-2 text-xs">
            <span className="text-muted-foreground">
              Total SQFT
            </span>

            <span>
              {totalSqft.toFixed(2)}
            </span>
          </div>
        )}

      </div>
    </div>
  );
}
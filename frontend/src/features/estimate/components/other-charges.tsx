import { Plus, Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export interface OtherCharge {
  id: string;
  name: string;
  amount: number;
}

interface OtherChargesProps {
  charges: OtherCharge[];

  onAdd: () => void;

  onUpdate: (
    id: string,
    field: "name" | "amount",
    value: string | number,
  ) => void;

  onDelete: (id: string) => void;

  gstEnabled: boolean;
  gstRate: number;

  onGstEnabledChange: (
    enabled: boolean,
  ) => void;

  onGstRateChange: (
    rate: number,
  ) => void;

  subtotal: number;

  discountType: "flat" | "percentage";

  discountValue: number;

  onDiscountTypeChange: (
    type: "flat" | "percentage",
  ) => void;

  onDiscountValueChange: (
    value: number,
  ) => void;

  advancePaid: number;

  onAdvancePaidChange: (
    value: number,
  ) => void;
}

export function OtherCharges({
  charges,
  onAdd,
  onUpdate,
  onDelete,

  gstEnabled,
  gstRate,
  onGstEnabledChange,
  onGstRateChange,
  subtotal,

  discountType,
  discountValue,
  onDiscountTypeChange,
  onDiscountValueChange,

  advancePaid,
  onAdvancePaidChange,
}: OtherChargesProps) {
  return (
    <div className="rounded-xl border bg-card p-5">
      {/* OTHER CHARGES */}

      <h3 className="text-sm font-semibold uppercase tracking-wide">
        Other Charges
      </h3>

      <div className="mt-4 space-y-3">
        {charges.map((charge) => (
          <div
            key={charge.id}
            className="flex items-center gap-2"
          >
            <Input
              value={charge.name}
              placeholder="Charge name"
              onChange={(event) =>
                onUpdate(
                  charge.id,
                  "name",
                  event.target.value,
                )
              }
              className="flex-1"
            />

            <Input
              type="number"
              min={0}
              value={
                charge.amount === 0
                  ? ""
                  : charge.amount
              }
              placeholder="Amount"
              onChange={(event) =>
                onUpdate(
                  charge.id,
                  "amount",
                  Number(event.target.value),
                )
              }
              className="w-32"
            />

            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="cursor-pointer"
              onClick={() =>
                onDelete(charge.id)
              }
            >
              <Trash2 className="size-4 text-destructive" />
            </Button>
          </div>
        ))}
      </div>

      <Button
        type="button"
        variant="ghost"
        className="mt-3 px-0 cursor-pointer"
        onClick={onAdd}
      >
        <Plus className="mr-1 size-4" />
        Add Charge
      </Button>

      {/* GST */}

      <div className="mt-7">
        <h3 className="text-sm font-semibold uppercase tracking-wide">
          GST
        </h3>

        <div className="mt-3 flex items-center gap-3">
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={gstEnabled}
              onChange={(event) =>
                onGstEnabledChange(
                  event.target.checked,
                )
              }
              className="size-4 accent-primary"
            />

            Enable GST
          </label>

          {gstEnabled && (
            <>
              <Input
                type="number"
                min={0}
                max={100}
                value={gstRate}
                onChange={(event) =>
                  onGstRateChange(
                    Number(event.target.value),
                  )
                }
                className="w-20"
              />

              <span className="text-sm">
                %
              </span>
            </>
          )}
        </div>
      </div>

      {/* DISCOUNT */}

      <div className="mt-7">
        <h3 className="text-sm font-semibold uppercase tracking-wide">
          Discount
        </h3>

        <div className="mt-3 flex items-center gap-2">
          <div className="flex overflow-hidden rounded-md border">
            <button
              type="button"
              onClick={() =>
                onDiscountTypeChange(
                  "flat",
                )
              }
              className={`px-4 py-2 text-sm cursor-pointer ${
                discountType === "flat"
                  ? "bg-primary text-primary-foreground"
                  : "bg-background"
              }`}
            >
              Flat (₹)
            </button>

            <button
              type="button"
              onClick={() =>
                onDiscountTypeChange(
                  "percentage",
                )
              }
              className={`px-4 py-2 text-sm cursor-pointer ${
                discountType ===
                "percentage"
                  ? "bg-primary text-primary-foreground"
                  : "bg-background"
              }`}
            >
              Percentage (%)
            </button>
          </div>

          <Input
            type="number"
            min={0}
            max={
                discountType === "percentage"
                ? 100
                : subtotal
            }
            value={
              discountValue === 0
                ? ""
                : discountValue
            }
            onChange={(event) =>
              onDiscountValueChange(
                Number(event.target.value),
              )
            }
            className="w-28"
          />
        </div>
      </div>

      {/* ADVANCE PAYMENT */}

      <div className="mt-7">
        <h3 className="text-sm font-semibold uppercase tracking-wide">
          Advance Payment
        </h3>

        <div className="mt-3 flex items-center gap-2">
          <span className="text-sm">
            ₹
          </span>

          <Input
            type="number"
            min={0}
            max={subtotal}
            value={
              advancePaid === 0
                ? ""
                : advancePaid
            }
            onChange={(event) =>
              onAdvancePaidChange(
                Number(event.target.value),
              )
            }
            className="w-36"
          />

          <Input
            placeholder="Mode (e.g. Cash, UPI, Bank)"
            className="flex-1"
          />
        </div>
      </div>
    </div>
  );
}
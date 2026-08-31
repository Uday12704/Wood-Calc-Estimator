import { OtherCharges } from "./other-charges";
import type { OtherCharge } from "../types";
import { RoundSizeSummary } from "./round-size-summary";

interface RoundSizeBottomSectionProps {
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
    value: boolean,
  ) => void;

  onGstRateChange: (
    value: number,
  ) => void;

  discountType: "flat" | "percentage";
  discountValue: number;

  onDiscountTypeChange: (
    value: "flat" | "percentage",
  ) => void;

  onDiscountValueChange: (
    value: number,
  ) => void;

  
  onAdvancePaidChange: (
    value: number,
  ) => void;
  
  subtotal: number;
  gstAmount: number;
  otherCharges: number;
  discountAmount: number;
  grandTotal: number;
  advancePaid: number;
  balanceDue: number;
  avgGirth: number;
  totalCbm: number;
  totalCft: number;
  cftEnabled: boolean;
}

export function RoundSizeBottomSection(
  props: RoundSizeBottomSectionProps,
) {
  return (
    <div className="mt-4 grid grid-cols-1 gap-4 lg:grid-cols-[minmax(0,1.25fr)_minmax(360px,0.75fr)]">
      <OtherCharges
        {...props}
      />

      <RoundSizeSummary
        {...props}
      />
    </div>
  );
}
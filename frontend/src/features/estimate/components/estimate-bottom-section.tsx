import { OtherCharges, type OtherCharge } from "./other-charges";
import { EstimateSummary } from "./estimate-summary";

interface EstimateBottomSectionProps {
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

  advancePaid: number;

  onAdvancePaidChange: (
    value: number,
  ) => void;

  subtotal: number;
  gstAmount: number;
  otherCharges: number;
  discountAmount: number;
  grandTotal: number;
  balanceDue: number;
  totalCft: number;
  totalSqft: number;
}

export function EstimateBottomSection(
  props: EstimateBottomSectionProps,
) {
  return (
    <div className="mt-4 grid grid-cols-1 gap-4 lg:grid-cols-[minmax(0,1.25fr)_minmax(360px,0.75fr)]">
      <OtherCharges
        {...props}
      />

      <EstimateSummary
        {...props}
      />
    </div>
  );
}
import { useState } from "react";

import { EstimateHeaderForm, } from "../components/estimate-header-form";

import { WoodItemsTable, } from "../components/wood-items-table";

import { woodCategories, } from "../data/wood-categories";

import type { EstimateHeader, WoodItem, } from "../types";

import { generateEstimateNumber, } from "../utils/estimate-number";

import { getTodayDate, } from "../utils/date";
import { EstimateBottomSection } from "../components/estimate-bottom-section";
import type { OtherCharge } from "../components/other-charges";
import { calculateEstimateTotals } from "../estimate-calculations";
import { EstimateNotes } from "../components/estimate-notes";
import { EstimateActions } from "../components/estimate-actions";

export function CutSizeEstimatePage() {
  const [header, setHeader] =
    useState<EstimateHeader>(() => ({
      documentTitle: "Estimate",
      estimateNumber:
        generateEstimateNumber(),
      date: getTodayDate(),
      partyName: "",
      contactNumber: "",
      reference: "",
      status: "ON_HOLD",
    }));

  const [items, setItems] =
    useState<WoodItem[]>([
      {
        id: crypto.randomUUID(),

        breadth: "",
        height: "",

        woodType: "",

        pricePerUnit: "",

        length: "",
        quantity: 1,

        note: "",

        totalCft: 0,
        lineTotal: 0,
      },
    ]);

    const [otherCharges, setOtherCharges] = useState<
      OtherCharge[]
    >([]);

    const addOtherCharge = () => {
      setOtherCharges((current) => [
        ...current,
        {
          id: crypto.randomUUID(),
          name: "",
          amount: 0,
        },
      ]);
    };

    const updateOtherCharge = (
      id: string,
      field: "name" | "amount",
      value: string | number,
    ) => {
      setOtherCharges((current) =>
        current.map((charge) =>
          charge.id === id
            ? {
                ...charge,
                [field]: value,
              }
            : charge,
        ),
      );
    };

    const deleteOtherCharge = (
      id: string,
    ) => {
      setOtherCharges((current) =>
        current.filter(
          (charge) => charge.id !== id,
        ),
      );
    };

    const [gstEnabled, setGstEnabled] =
      useState(false);

    const [gstRate, setGstRate] =
      useState(18);

    const [discountType, setDiscountType] =
      useState<"flat" | "percentage">(
        "flat",
      );

    const [discountValue, setDiscountValue] =
      useState(0);

    const [advancePaid, setAdvancePaid] =
      useState(0);

    const [notes, setNotes] = useState("");

    const totals = calculateEstimateTotals({
      items,
      otherCharges,

      gstEnabled,
      gstRate,

      discountType,
      discountValue,

      advancePaid,
    });

  return (
    <div className="space-y-6">

      <div>
        <h1 className="text-2xl font-semibold tracking-tight">
          New Estimate
        </h1>

        <p className="mt-1 text-sm text-muted-foreground">
          Build, calculate and share in
          seconds.
        </p>
      </div>

      <EstimateHeaderForm
        value={header}
        onChange={setHeader}
      />

      <WoodItemsTable
        items={items}
        categories={woodCategories}
        onChange={setItems}
      />

      <EstimateBottomSection
        charges={otherCharges}
        onAdd={addOtherCharge}
        onUpdate={updateOtherCharge}
        onDelete={deleteOtherCharge}

        gstEnabled={gstEnabled}
        gstRate={gstRate}
        onGstEnabledChange={setGstEnabled}
        onGstRateChange={setGstRate}

        discountType={discountType}
        discountValue={discountValue}
        onDiscountTypeChange={
          setDiscountType
        }
        onDiscountValueChange={
          setDiscountValue
        }

        advancePaid={advancePaid}
        onAdvancePaidChange={
          setAdvancePaid
        }

        subtotal={totals.subtotal}
        gstAmount={totals.gstAmount}
        otherCharges={
          totals.totalOtherCharges
        }
        discountAmount={
          totals.discountAmount
        }
        grandTotal={totals.grandTotal}
        balanceDue={totals.balanceDue}
        totalCft={totals.totalCft}
      />

      <EstimateNotes
        value={notes}
        onChange={setNotes}
      />
      
      <EstimateActions
        onSaveDraft={() => {
          console.log("Save draft");
        }}
        onConfirm={() => {
          console.log("Confirm estimate");
        }}
        onShare={() => {
          console.log("Share estimate");
        }}
        onPrintExport={() => {
          console.log("Print / Export");
        }}
      />


    </div>
  );
}
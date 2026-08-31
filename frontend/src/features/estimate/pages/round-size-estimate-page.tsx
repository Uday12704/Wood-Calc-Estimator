import { useState } from "react";

import {
  EstimateHeaderForm,
} from "../components/estimate-header-form";

import type {
  EstimateHeader,
  OtherCharge,
  RoundSizeItem,
  SavedRoundSizeEstimate,
} from "../types";

import {
  generateEstimateNumber,
} from "../utils/estimate-number";

import {
  getTodayDate,
} from "../utils/date";
import { RoundSizeItemsTable } from "../components/round-size-items-table";
import { woodCategories } from "../data/wood-categories";
import { RoundSizePricingSection } from "../components/round-size-pricing-section";
import { calculateRoundSizeEstimateTotals } from "../utils/round-size-calculations";
import { RoundSizeBottomSection } from "../components/round-size-bottom-section";
import { toast } from "react-toastify";
import { EstimateNotes } from "../components/estimate-notes";
import { EstimateActions } from "../components/estimate-actions";
import { saveRoundEstimate } from "../services/estimate-storage";
import { useNavigate } from "react-router-dom";

export function RoundSizeEstimatePage() {
  const navigate = useNavigate();
  const [header, setHeader] =
    useState<EstimateHeader>(() => ({
      documentTitle: "Round Size Estimate",
      estimateNumber:
        generateEstimateNumber(),
      date: getTodayDate(),
      partyName: "",
      contactNumber: "",
      reference: "",
      status: "ON_HOLD",
    }));

  const [items, setItems] =
    useState<RoundSizeItem[]>([
      {
        id: crypto.randomUUID(),

        woodType: "",
        logNo: "",
        length: "",
        girth: "",

        cbm: 0,
        cft: 0,

        note: "",
      },
    ]);

    const [cftEnabled, setCftEnabled] = useState(false);

    const [pricePerCbm, setPricePerCbm] = useState<number | "">("");

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

    const totals =
      calculateRoundSizeEstimateTotals({
        items,

        pricePerCbm,

        cftEnabled,

        otherCharges,

        gstEnabled,
        gstRate,

        discountType,
        discountValue,

        advancePaid,
      });

    const [estimateId] = useState(() => crypto.randomUUID());
    
    const buildEstimate = (
      status: "ON_HOLD" | "CONFIRMED",
    ): SavedRoundSizeEstimate => {
      const now =
        new Date().toISOString();

      return {
        id: estimateId,
        estimateNumber:header.estimateNumber,
        documentTitle:header.documentTitle,
        date: header.date,
        partyName:header.partyName,
        contactNumber:header.contactNumber,
        reference:header.reference,
        status,
        type: "ROUND_SIZE",
        items,
        cftEnabled,
        pricePerCbm,
        otherCharges,
        gstEnabled,
        gstRate,
        discountType,
        discountValue,
        advancePaid,
        notes,
        totals: {
          subtotal: totals.subtotal,
          gstAmount: totals.gstAmount,
          totalOtherCharges: totals.totalOtherCharges,
          discountAmount: totals.discountAmount,
          grandTotal: totals.grandTotal,
          advancePaid: totals.advancePaid,
          balanceDue: totals.balanceDue,
          avgGirth: totals.avgGirth,
          totalCbm: totals.totalCbm,
          totalCft: totals.totalCft,
        },

        createdAt: now,
        updatedAt: now,
      };
    };

    const validateEstimate = () => {
      if (!header.partyName.trim()) {
        toast.error(
          "Please enter the party name.",
        );

        return false;
      }

      if (!items.some(
        (item) =>
          item.woodType &&
          item.logNo !== "" &&
          item.length !== "" &&
          item.girth !== "",
      )) {
        toast.error(
          "Please add at least one wood item.",
        );

        return false;
      }

      return true;
    };

    function updateStatus(newStatus: EstimateHeader["status"]) {
      setHeader((prev) => ({ ...prev, status: newStatus }));
    }

  return (
    <div className="space-y-6">

      {/* PAGE HEADER */}

      <div>
        <h1 className="text-2xl font-semibold tracking-tight">
          Round Size Estimate
        </h1>

        <p className="mt-1 text-sm text-muted-foreground">
          Create a new round-size wood estimate.
        </p>
      </div>

      {/* ESTIMATE HEADER */}

      <EstimateHeaderForm
        value={header}
        onChange={setHeader}
      />

      <RoundSizeItemsTable
        items={items}
        categories={woodCategories}
        cftEnabled={cftEnabled}
        onCftEnabledChange={
          setCftEnabled
        }
        onChange={setItems}
      />

      <RoundSizePricingSection
        totalCbm={totals.totalCbm}
        pricePerCbm={pricePerCbm}
        subtotal={totals.subtotal}
        onPriceChange={setPricePerCbm}
      />

      <RoundSizeBottomSection
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
        avgGirth={totals.avgGirth}
        totalCbm={totals.totalCbm}
        totalCft={totals.totalCft}
        cftEnabled={cftEnabled}
      />

      <EstimateNotes
        value={notes}
        onChange={setNotes}
      />
            
      <EstimateActions
        onSaveDraft={() => {
          if (!validateEstimate()) {
            return;
          }
          const estimate =
            buildEstimate("ON_HOLD");

            updateStatus("ON_HOLD");

            saveRoundEstimate(estimate);
            toast.success("Estimate saved as draft.");
            navigate(
              `/app/estimates/history`,
            );
        }}
        onConfirm={() => {
          if (!validateEstimate()) {
            return;
          }
          const estimate =
            buildEstimate("CONFIRMED");

            updateStatus("CONFIRMED");

            saveRoundEstimate(estimate);
            toast.success("Estimate marked as confirmed.");
            navigate(
              `/app/estimates/history`,
            );
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
import { useState } from "react";

import { EstimateHeaderForm, } from "../components/estimate-header-form";

import type { CustomEstimateItem, EstimateHeader, OtherCharge, SavedCustomEstimate, SavedEstimate, } from "../types";

import { generateEstimateNumber, } from "../utils/estimate-number";

import { getTodayDate, } from "../utils/date";
import { EstimateBottomSection } from "../components/estimate-bottom-section";
import { EstimateNotes } from "../components/estimate-notes";
import { EstimateActions } from "../components/estimate-actions";
import { saveCustomEstimate, saveEstimate } from "../services/estimate-storage";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { ShareEstimateDialog } from "../components/share-estimate-dialog";
import { calculateCustomEstimateTotals } from "../utils/custom-estimate-calculations";
import { CustomItemsTable } from "../components/custom-items-table";
import { CustomEstimateBottomSection } from "../components/custom-bottom-section";

export function CustomEstimatePage() {
  const navigate = useNavigate();
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
    useState<CustomEstimateItem[]>([
      {
        id: crypto.randomUUID(),
        description: "",
        pricePerUnit: "",
        quantity: 1,
        note: "",
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

    const [shareOpen, setShareOpen] = useState(false);

    const totals = calculateCustomEstimateTotals({
      items: items.map((item) => {

        return {
          lineTotal: item.lineTotal,
        };
      }),

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
    ): SavedCustomEstimate => {
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
        type: "CUSTOM",
        items,
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
          item.description &&
          item.quantity !== "" &&
          item.pricePerUnit !== "",
      )) {
        toast.error(
          "Please add at least one custom item.",
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

      <CustomItemsTable
        items={items}
        onChange={setItems}
      />

      <CustomEstimateBottomSection
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

          saveCustomEstimate(estimate);
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

          saveCustomEstimate(estimate);
          toast.success("Estimate marked as confirmed.");
          navigate(
            `/app/estimates/history`,
          );
        }}
        onShare={() => {
          setShareOpen(true);
        }}
        onPrintExport={() => {
          console.log("Print / Export");
        }}
      />

      <ShareEstimateDialog
        open={shareOpen}
        onOpenChange={setShareOpen}
        estimate={buildEstimate(
          header.status,
        )}
      />
    </div>
  );
}
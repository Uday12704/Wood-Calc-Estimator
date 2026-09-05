import { useState } from "react";

import { EstimateHeaderForm, } from "../components/estimate-header-form";

import { WoodItemsTable, } from "../components/cut-size-items-table";

import { woodCategories, } from "../data/wood-categories";

import type { CutSizeAdditionalItem, EstimateHeader, OtherCharge, SavedEstimate, WoodItem, } from "../types";

import { generateEstimateNumber, } from "../utils/estimate-number";

import { getTodayDate, } from "../utils/date";
import { EstimateBottomSection } from "../components/estimate-bottom-section";
import { calculateEstimateTotals } from "../utils/cut-size-calculations";
import { EstimateNotes } from "../components/estimate-notes";
import { EstimateActions } from "../components/estimate-actions";
import { saveEstimate } from "../services/estimate-storage";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { ShareEstimateDialog } from "../components/share-estimate-dialog";
import { AdditionalItemsTable } from "../components/cut-size-additional-items-table";
import { pdf } from "@react-pdf/renderer";
import { CutSizeEstimatePdf } from "../pdf/cut-size-estimate-pdf";

export function CutSizeEstimatePage() {
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

        total: 0,
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

    const [additionalItemsEnabled, setAdditionalItemsEnabled] = useState(false);

    const [additionalItems, setAdditionalItems] =
      useState<CutSizeAdditionalItem[]>([
        {
          id: crypto.randomUUID(),
          description: "",
          pricePerUnit: "",
          quantity: 1,
          note: "",
          lineTotal: 0,
        },
      ]);

    const [additionalGstEnabled, setAdditionalGstEnabled] = useState(false);

    const [additionalGstRate, setAdditionalGstRate] = useState(18);

    const totals = calculateEstimateTotals({
      items: items.map((item) => {
        const category = woodCategories.find(
          (category) =>
            category.name === item.woodType,
        );

        return {
          lineTotal: item.lineTotal,
          total: item.total,
          calculationMode:
            category?.calculationMode ?? "CFT",
        };
      }),
      additionalItems:
        additionalItemsEnabled
          ? additionalItems
          : [],

      otherCharges,

      gstEnabled,
      gstRate,

      additionalGstEnabled:
        additionalItemsEnabled
          ? additionalGstEnabled
          : false,
      additionalGstRate,

      discountType,
      discountValue,

      advancePaid,
    });

    const [estimateId] = useState(() => crypto.randomUUID());

    const buildEstimate = (
      status: "ON_HOLD" | "CONFIRMED",
    ): SavedEstimate => {
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
        type: "CUT_SIZE",
        items,
        additionalItemsEnabled,
        additionalItems: additionalItemsEnabled
          ? additionalItems
          : [],

        additionalItemGstEnabled: additionalItemsEnabled
          ? additionalGstEnabled
          : false,

        additionalItemGstRate: additionalItemsEnabled
          ? additionalGstRate
          : 0,
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
          additionalSubtotal: totals.additionalSubtotal,
          additionalGstAmount: totals.additionalGstAmount,
          additionalTotal: totals.additionalTotal,
          totalOtherCharges: totals.totalOtherCharges,
          discountAmount: totals.discountAmount,
          grandTotal: totals.grandTotal,
          advancePaid: totals.advancePaid,
          balanceDue: totals.balanceDue,
          totalCft: totals.totalCft,
          totalSqft: totals.totalSqft,
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
          item.breadth !== "" &&
          item.height !== "" &&
          item.length !== "",
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

    const [shareOpen, setShareOpen] = useState(false);

    async function handleExport() {
      const estimate = buildEstimate(header.status);
        if (!estimate) {
          toast.error("Estimate not found.");
          return;
        }

        if(!validateEstimate()){
          return;
        }
        
        try {
          const blob =
            await pdf(
              <CutSizeEstimatePdf
                estimate={estimate}
              />,
            ).toBlob();
    
          const url =
            URL.createObjectURL(blob);
    
          const link =
            document.createElement("a");
    
          link.href = url;
    
          link.download =
            `${estimate.estimateNumber}.pdf`;
    
          document.body.appendChild(link);
    
          link.click();
    
          link.remove();
    
          URL.revokeObjectURL(url);
    
          toast.success(
            "PDF exported successfully.",
          );
        } catch (error) {
          console.error(
            "PDF export failed:",
            error,
          );
    
          toast.error(
            "Unable to export PDF.",
          );
        }
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

      <WoodItemsTable
        items={items}
        categories={woodCategories}
        onChange={setItems}
      />

      <div className="flex items-center gap-2">
        <input
          id="additional-items-enabled"
          type="checkbox"
          checked={additionalItemsEnabled}
          onChange={(event) =>
            setAdditionalItemsEnabled(
              event.target.checked,
            )
          }
          className="size-4"
        />

        <label
          htmlFor="additional-items-enabled"
          className="text-sm font-medium cursor-pointer"
        >
          Enable Additional Items
        </label>
      </div>

      {additionalItemsEnabled && (
        <AdditionalItemsTable
          items={additionalItems}
          onChange={setAdditionalItems}
        
          additionalGstEnabled={additionalGstEnabled}
          additionalGstRate={additionalGstRate}
          onAdditionalGstEnabledChange={setAdditionalGstEnabled}
          onAdditionalGstRateChange={setAdditionalGstRate}
        />
      )}

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
        additionalItemsEnabled={additionalItemsEnabled}
        additionalTotal={totals.additionalTotal}
        otherCharges={
          totals.totalOtherCharges
        }
        discountAmount={
          totals.discountAmount
        }
        grandTotal={totals.grandTotal}
        balanceDue={totals.balanceDue}
        totalCft={totals.totalCft}
        totalSqft={totals.totalSqft}
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

          saveEstimate(estimate);
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

          saveEstimate(estimate);
          toast.success("Estimate marked as confirmed.");
          navigate(
            `/app/estimates/history`,
          );
        }}
        onShare={() => {
          setShareOpen(true);
        }}
        onPrintExport={
          handleExport
        }
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
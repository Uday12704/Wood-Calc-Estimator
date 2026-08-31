import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";

import { EstimateHeaderForm } from "../components/estimate-header-form";
import { WoodItemsTable } from "../components/cut-size-items-table";
import { EstimateBottomSection } from "../components/estimate-bottom-section";
import { EstimateNotes } from "../components/estimate-notes";
import { EstimateActions } from "../components/estimate-actions";

import { woodCategories } from "../data/wood-categories";

import type {
  EstimateHeader,
  OtherCharge,
  SavedEstimate,
  WoodItem,
} from "../types";

import {
  getEstimateById,
  saveEstimate,
} from "../services/estimate-storage";

import { calculateEstimateTotals } from "../utils/cut-size-calculations";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ShareEstimateDialog } from "../components/share-estimate-dialog";

interface EditCutSizeEstimateFormProps {
  estimate: SavedEstimate;
}

function EditCutSizeEstimateForm({
  estimate,
}: EditCutSizeEstimateFormProps) {
  const navigate = useNavigate();

  /*
   * ----------------------------------------
   * HEADER
   * ----------------------------------------
   */

  const [header, setHeader] =
    useState<EstimateHeader>({
      documentTitle:
        estimate.documentTitle,

      estimateNumber:
        estimate.estimateNumber,

      date: estimate.date,

      partyName:
        estimate.partyName,

      contactNumber:
        estimate.contactNumber,

      reference:
        estimate.reference,

      status:
        estimate.status,
    });

  /*
   * ----------------------------------------
   * WOOD ITEMS
   * ----------------------------------------
   */

  const [items, setItems] =
    useState<WoodItem[]>(
      estimate.items,
    );

  /*
   * ----------------------------------------
   * OTHER CHARGES
   * ----------------------------------------
   */

  const [otherCharges, setOtherCharges] =
    useState<OtherCharge[]>(
      estimate.otherCharges,
    );

  /*
   * ----------------------------------------
   * GST
   * ----------------------------------------
   */

  const [gstEnabled, setGstEnabled] =
    useState(
      estimate.gstEnabled,
    );

  const [gstRate, setGstRate] =
    useState(
      estimate.gstRate,
    );

  /*
   * ----------------------------------------
   * DISCOUNT
   * ----------------------------------------
   */

  const [discountType, setDiscountType] =
    useState<
      "flat" | "percentage"
    >(
      estimate.discountType,
    );

  const [discountValue, setDiscountValue] =
    useState(
      estimate.discountValue,
    );

  /*
   * ----------------------------------------
   * ADVANCE
   * ----------------------------------------
   */

  const [advancePaid, setAdvancePaid] =
    useState(
      estimate.advancePaid,
    );

  /*
   * ----------------------------------------
   * NOTES
   * ----------------------------------------
   */

  const [notes, setNotes] =
    useState(
      estimate.notes,
    );

  /*
   * ----------------------------------------
   * CALCULATIONS
   * ----------------------------------------
   */

  const totals =
    calculateEstimateTotals({
      items: items.map((item) => {
        const category =
          woodCategories.find(
            (category) =>
              category.name ===
              item.woodType,
          );

        return {
          lineTotal:
            item.lineTotal,

          total:
            item.total,

          calculationMode:
            category?.calculationMode ??
            "CFT",
        };
      }),

      otherCharges,

      gstEnabled,
      gstRate,

      discountType,
      discountValue,

      advancePaid,
    });

  /*
   * ----------------------------------------
   * OTHER CHARGE FUNCTIONS
   * ----------------------------------------
   */

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
        (charge) =>
          charge.id !== id,
      ),
    );
  };

  /*
   * ----------------------------------------
   * VALIDATION
   * ----------------------------------------
   */

  const validateEstimate = () => {
    if (!header.partyName.trim()) {
      toast.error(
        "Please enter the party name.",
      );

      return false;
    }

    if (
      !items.some(
        (item) =>
          item.woodType &&
          item.breadth !== "" &&
          item.height !== "" &&
          item.length !== "",
      )
    ) {
      toast.error(
        "Please add at least one wood item.",
      );

      return false;
    }

    return true;
  };

  /*
   * ----------------------------------------
   * BUILD UPDATED ESTIMATE
   * ----------------------------------------
   */

  const buildEstimate = (
    status:
      | "ON_HOLD"
      | "CONFIRMED",
  ): SavedEstimate => {
    return {
      ...estimate,
      documentTitle:header.documentTitle,
      estimateNumber:header.estimateNumber,
      date:header.date,
      partyName:header.partyName,
      contactNumber:header.contactNumber,
      reference:header.reference,
      status,
      items,
      otherCharges,
      gstEnabled,
      gstRate,
      discountType,
      discountValue,
      advancePaid,
      notes,
      totals: {
        subtotal:totals.subtotal,
        gstAmount:totals.gstAmount,
        totalOtherCharges:totals.totalOtherCharges,
        discountAmount:totals.discountAmount,
        grandTotal:totals.grandTotal,
        advancePaid:totals.advancePaid,
        balanceDue:totals.balanceDue,
        totalCft:totals.totalCft,
        totalSqft:totals.totalSqft,
      },

      updatedAt:
        new Date().toISOString(),
    };
  };
    /*
   * ----------------------------------------
   * SAVE DRAFT
   * ----------------------------------------
   */

  const handleSaveDraft = () => {
    if (!validateEstimate()) {
      return;
    }

    const updatedEstimate =
      buildEstimate("ON_HOLD");

    saveEstimate(updatedEstimate);

    toast.success(
      "Estimate updated successfully.",
    );

    navigate(
      `/app/estimates/preview-cut-size/${estimate.id}`,
    );
  };

  /*
   * ----------------------------------------
   * CONFIRM
   * ----------------------------------------
   */

  const handleConfirm = () => {
    if (!validateEstimate()) {
      return;
    }

    const updatedEstimate =
      buildEstimate("CONFIRMED");

    saveEstimate(updatedEstimate);

    toast.success(
      "Estimate marked as confirmed.",
    );

    navigate(
      `/app/estimates/preview-cut-size/${estimate.id}`,
    );
  };

  const [shareOpen, setShareOpen] = useState(false);

    return (
    <div className="space-y-6">

      {/* PAGE HEADER */}

      <div className="flex items-start gap-3">
        <Button
          variant="outline"
          size="icon"
          onClick={() =>
            navigate(-1)
          }
        >
          <ArrowLeft className="size-4" />
        </Button>

        <div>
          <h1 className="text-2xl font-semibold tracking-tight">
            Edit Round Size Estimate
          </h1>

          <p className="mt-1 text-sm text-muted-foreground">
            {estimate.estimateNumber}
          </p>
        </div>
      </div>

      {/* HEADER */}

      <EstimateHeaderForm
        value={header}
        onChange={setHeader}
      />

      {/* WOOD ITEMS */}

      <WoodItemsTable
        items={items}
        categories={woodCategories}
        onChange={setItems}
      />

      {/* BOTTOM SECTION */}

      <EstimateBottomSection
        charges={otherCharges}
        onAdd={addOtherCharge}
        onUpdate={updateOtherCharge}
        onDelete={deleteOtherCharge}

        gstEnabled={gstEnabled}
        gstRate={gstRate}
        onGstEnabledChange={
          setGstEnabled
        }
        onGstRateChange={
          setGstRate
        }

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
        totalSqft={totals.totalSqft}
      />

      {/* NOTES */}

      <EstimateNotes
        value={notes}
        onChange={setNotes}
      />

      {/* ACTIONS */}

      <EstimateActions
        onSaveDraft={
          handleSaveDraft
        }
        onConfirm={
          handleConfirm
        }
        onShare={() => {
          setShareOpen(true);
        }}
        onPrintExport={() => {
          console.log(
            "Print / Export",
          );
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

export function EditCutSizeEstimatePage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [estimate, setEstimate] =
    useState<SavedEstimate | null>(null);

  const [isLoading, setIsLoading] =
    useState(true);

  /*
   * ----------------------------------------
   * LOAD ESTIMATE
   * ----------------------------------------
   */

  useEffect(() => {
    if (!id) {
      toast.error("Estimate not found.");
      navigate("/app/estimates/history", {
        replace: true,
      });
      return;
    }

    const savedEstimate =
      getEstimateById(id);

    if (!savedEstimate) {
      toast.error("Estimate not found.");
      navigate("/app/estimates/history", {
        replace: true,
      });
      return;
    }

    if (savedEstimate.type !== "CUT_SIZE") {
      toast.error(
        "This estimate is not a cut-size estimate.",
      );

      navigate("/app/estimates/history", {
        replace: true,
      });

      return;
    }

    setEstimate(savedEstimate);
    setIsLoading(false);
  }, [id, navigate]);

  /*
   * ----------------------------------------
   * LOADING
   * ----------------------------------------
   */

  if (isLoading) {
    return (
      <div className="flex min-h-[300px] items-center justify-center">
        <p className="text-sm text-muted-foreground">
          Loading estimate...
        </p>
      </div>
    );
  }

  if (!estimate) {
    return null;
  }

  return (
    <EditCutSizeEstimateForm
      estimate={estimate}
    />
  );
}

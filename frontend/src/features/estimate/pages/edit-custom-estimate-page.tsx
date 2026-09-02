import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";

import { EstimateHeaderForm } from "../components/estimate-header-form";
import { EstimateNotes } from "../components/estimate-notes";
import { EstimateActions } from "../components/estimate-actions";

import type {
    CustomEstimateItem,
  EstimateHeader,
  OtherCharge,
  SavedCustomEstimate,
  SavedEstimate,
} from "../types";

import {
    getCustomEstimateById,
  saveCustomEstimate,
} from "../services/estimate-storage";

import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ShareEstimateDialog } from "../components/share-estimate-dialog";
import { calculateCustomEstimateTotals } from "../utils/custom-estimate-calculations";
import { CustomItemsTable } from "../components/custom-items-table";
import { CustomEstimateBottomSection } from "../components/custom-bottom-section";

interface EditCustomEstimateFormProps {
  estimate: SavedCustomEstimate;
}

function EditCustomEstimateForm({
  estimate,
}: EditCustomEstimateFormProps) {
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
   * CUSTOM ITEMS
   * ----------------------------------------
   */

  const [items, setItems] =
    useState<CustomEstimateItem[]>(
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
    calculateCustomEstimateTotals({
      items: items.map((item) => {
        return {
          lineTotal:
            item.lineTotal,
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
          item.description &&
          item.quantity !== "" &&
          item.pricePerUnit !== ""
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
  ): SavedCustomEstimate => {
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

    saveCustomEstimate(updatedEstimate);

    toast.success(
      "Estimate updated successfully.",
    );

    navigate(
      `/app/estimates/preview-custom-estimate/${estimate.id}`,
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

    saveCustomEstimate(updatedEstimate);

    toast.success(
      "Estimate marked as confirmed.",
    );

    navigate(
      `/app/estimates/preview-custom-estimate/${estimate.id}`,
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
            Edit Custom Estimate
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

      <CustomItemsTable
        items={items}
        onChange={setItems}
      />

      {/* BOTTOM SECTION */}

      <CustomEstimateBottomSection
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

export function EditCustomEstimatePage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [estimate, setEstimate] =
    useState<SavedCustomEstimate | null>(null);

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
      getCustomEstimateById(id);

    if (!savedEstimate) {
      toast.error("Estimate not found.");
      navigate("/app/estimates/history", {
        replace: true,
      });
      return;
    }

    if (savedEstimate.type !== "CUSTOM") {
      toast.error(
        "This estimate is not a custom estimate.",
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
    <EditCustomEstimateForm
      estimate={estimate}
    />
  );
}

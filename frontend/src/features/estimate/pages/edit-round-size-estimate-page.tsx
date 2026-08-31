import { useEffect, useState } from "react";
import { ArrowLeft } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";

import { Button } from "@/components/ui/button";

import {
  EstimateHeaderForm,
} from "../components/estimate-header-form";

import {
  RoundSizeItemsTable,
} from "../components/round-size-items-table";

import {
  RoundSizePricingSection,
} from "../components/round-size-pricing-section";

import {
  RoundSizeBottomSection,
} from "../components/round-size-bottom-section";

import {
  EstimateNotes,
} from "../components/estimate-notes";

import {
  EstimateActions,
} from "../components/estimate-actions";

import { woodCategories } from "../data/wood-categories";

import {
  getSavedRoundEstimates,
  saveRoundEstimate,
} from "../services/estimate-storage";

import {
  calculateRoundSizeEstimateTotals,
} from "../utils/round-size-calculations";

import type {
  EstimateHeader,
  OtherCharge,
  RoundSizeItem,
  SavedRoundSizeEstimate,
} from "../types";
import { ShareEstimateDialog } from "../components/share-estimate-dialog";

export function EditRoundSizeEstimatePage() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [estimate, setEstimate] =
        useState<SavedRoundSizeEstimate | null>(
        null,
        );

    const [isLoading, setIsLoading] =
        useState(true);

    const [header, setHeader] =
        useState<EstimateHeader | null>(
        null,
        );

    const [items, setItems] =
        useState<RoundSizeItem[]>([]);

    const [cftEnabled, setCftEnabled] =
        useState(false);

    const [pricePerCbm, setPricePerCbm] =
        useState<number | "">("");

    const [otherCharges, setOtherCharges] =
        useState<OtherCharge[]>([]);

    const [gstEnabled, setGstEnabled] =
        useState(false);

    const [gstRate, setGstRate] =
        useState(18);

    const [discountType, setDiscountType] =
        useState<
        "flat" | "percentage"
        >("flat");

    const [discountValue, setDiscountValue] =
        useState(0);

    const [advancePaid, setAdvancePaid] =
        useState(0);

    const [notes, setNotes] =
        useState("");

    useEffect(() => {
        if (!id) {
        setIsLoading(false);
        return;
        }

        const estimates =
        getSavedRoundEstimates();

        const found =
        estimates.find(
            (item) => item.id === id,
        );

        if (!found) {
        setIsLoading(false);
        return;
        }

        setEstimate(found);

        setHeader({
        documentTitle:
            found.documentTitle,

        estimateNumber:
            found.estimateNumber,

        date:
            found.date,

        partyName:
            found.partyName,

        contactNumber:
            found.contactNumber,

        reference:
            found.reference,

        status:
            found.status,
        });

        setItems(
        found.items,
        );

        setCftEnabled(
        found.cftEnabled,
        );

        setPricePerCbm(
        found.pricePerCbm,
        );

        setOtherCharges(
        found.otherCharges,
        );

        setGstEnabled(
        found.gstEnabled,
        );

        setGstRate(
        found.gstRate,
        );

        setDiscountType(
        found.discountType,
        );

        setDiscountValue(
        found.discountValue,
        );

        setAdvancePaid(
        found.advancePaid,
        );

        setNotes(
        found.notes,
        );

        setIsLoading(false);
    }, [id]);

    if (isLoading) {
        return (
        <div className="flex min-h-[60vh] items-center justify-center">
            <p className="text-sm text-muted-foreground">
            Loading estimate...
            </p>
        </div>
        );
    }

    if (!estimate || !header) {
        return (
        <div className="flex min-h-[60vh] items-center justify-center">

            <div className="text-center">

            <h2 className="text-xl font-semibold">
                Estimate not found
            </h2>

            <p className="mt-2 text-sm text-muted-foreground">
                The estimate you're trying to edit
                doesn't exist.
            </p>

            <Button
                className="mt-4"
                onClick={() =>
                navigate(
                    "/app/estimates/history",
                )
                }
            >
                Back to History
            </Button>

            </div>

        </div>
        );
    }

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

    const addOtherCharge = () => {
        setOtherCharges(
        (current) => [
            ...current,
            {
            id: crypto.randomUUID(),
            name: "",
            amount: 0,
            },
        ],
        );
    };

    const updateOtherCharge = (
        id: string,
        field: "name" | "amount",
        value: string | number,
    ) => {
        setOtherCharges(
        (current) =>
            current.map(
            (charge) =>
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
        setOtherCharges(
        (current) =>
            current.filter(
            (charge) =>
                charge.id !== id,
            ),
        );
    };

    const buildUpdatedEstimate = (
        status: "ON_HOLD" | "CONFIRMED",
    ): SavedRoundSizeEstimate => {
        return {
        ...estimate,

        /*
        * Keep the same ID.
        */
        id: estimate.id,

        /*
        * Header
        */
        estimateNumber:
            header.estimateNumber,

        documentTitle:
            header.documentTitle,

        date:
            header.date,

        partyName:
            header.partyName,

        contactNumber:
            header.contactNumber,

        reference:
            header.reference,

        status,

        type: "ROUND_SIZE",

        /*
        * Round Size data
        */
        items,

        cftEnabled,

        pricePerCbm,

        /*
        * Charges
        */
        otherCharges,

        gstEnabled,

        gstRate,

        discountType,

        discountValue,

        advancePaid,

        notes,

        /*
        * Recalculated totals
        */
        totals: {
            subtotal:
            totals.subtotal,

            gstAmount:
            totals.gstAmount,

            totalOtherCharges:
            totals.totalOtherCharges,

            discountAmount:
            totals.discountAmount,

            grandTotal:
            totals.grandTotal,

            advancePaid:
            totals.advancePaid,

            balanceDue:
            totals.balanceDue,

            avgGirth:
            totals.avgGirth,

            totalCbm:
            totals.totalCbm,

            totalCft:
            totals.totalCft,
        },

        /*
        * Keep original creation date.
        */
        createdAt:
            estimate.createdAt,

        /*
        * Update modification date.
        */
        updatedAt:
            new Date().toISOString(),
        };
    };

    const validateEstimate = () => {
        if (!header.partyName.trim()) {
        toast.error(
            "Please enter the party name.",
        );

        return false;
        }

        const hasValidItem =
        items.some(
            (item) =>
            item.woodType &&
            item.logNo !== "" &&
            item.length !== "" &&
            item.girth !== "",
        );

        if (!hasValidItem) {
        toast.error(
            "Please add at least one wood item.",
        );

        return false;
        }

        if (
        pricePerCbm === "" ||
        Number(pricePerCbm) <= 0
        ) {
        toast.error(
            "Please enter a valid price per CBM.",
        );

        return false;
        }

        return true;
    };

    function updateStatus(
        newStatus: EstimateHeader["status"],
        ) {
        setHeader((previous) => {
            if (!previous) {
            return previous;
            }

            return {
            ...previous,
            status: newStatus,
            };
        });
    }

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


      {/* ITEMS */}

      <RoundSizeItemsTable
        items={items}
        categories={woodCategories}
        cftEnabled={cftEnabled}
        onCftEnabledChange={
          setCftEnabled
        }
        onChange={setItems}
      />


      {/* PRICING */}

      <RoundSizePricingSection
        totalCbm={
          totals.totalCbm
        }
        pricePerCbm={
          pricePerCbm
        }
        subtotal={
          totals.subtotal
        }
        onPriceChange={
          setPricePerCbm
        }
      />


      {/* BOTTOM */}

      <RoundSizeBottomSection
        charges={otherCharges}

        onAdd={
          addOtherCharge
        }

        onUpdate={
          updateOtherCharge
        }

        onDelete={
          deleteOtherCharge
        }

        gstEnabled={
          gstEnabled
        }

        gstRate={
          gstRate
        }

        onGstEnabledChange={
          setGstEnabled
        }

        onGstRateChange={
          setGstRate
        }

        discountType={
          discountType
        }

        discountValue={
          discountValue
        }

        onDiscountTypeChange={
          setDiscountType
        }

        onDiscountValueChange={
          setDiscountValue
        }

        advancePaid={
          advancePaid
        }

        onAdvancePaidChange={
          setAdvancePaid
        }

        subtotal={
          totals.subtotal
        }

        gstAmount={
          totals.gstAmount
        }

        otherCharges={
          totals.totalOtherCharges
        }

        discountAmount={
          totals.discountAmount
        }

        grandTotal={
          totals.grandTotal
        }

        balanceDue={
          totals.balanceDue
        }

        avgGirth={
          totals.avgGirth
        }

        totalCbm={
          totals.totalCbm
        }

        totalCft={
          totals.totalCft
        }

        cftEnabled={
          cftEnabled
        }
      />


      {/* NOTES */}

      <EstimateNotes
        value={notes}
        onChange={setNotes}
      />


      {/* ACTIONS */}

      <EstimateActions

        onSaveDraft={() => {
          if (!validateEstimate()) {
            return;
          }

          const updatedEstimate =
            buildUpdatedEstimate(
              "ON_HOLD",
            );

          saveRoundEstimate(
            updatedEstimate,
          );

          updateStatus(
            "ON_HOLD",
          );

          toast.success(
            "Estimate updated and saved as draft.",
          );

          navigate(
            `/app/estimates/preview-round-size/${estimate.id}`,
          );
        }}

        onConfirm={() => {
          if (!validateEstimate()) {
            return;
          }

          const updatedEstimate =
            buildUpdatedEstimate(
              "CONFIRMED",
            );

          saveRoundEstimate(
            updatedEstimate,
          );

          updateStatus(
            "CONFIRMED",
          );

          toast.success(
            "Estimate updated and marked as confirmed.",
          );

          navigate(
            `/app/estimates/preview-round-size/${estimate.id}`,
          );
        }}

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
        estimate={buildUpdatedEstimate(
          header.status,
        )}
      />

    </div>
  );
}
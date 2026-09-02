import { useState } from "react";
import {
  Copy,
  Download,
  FileText,
  Send,
} from "lucide-react";

import { Button } from "@/components/ui/button";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { toast } from "react-toastify";

import { pdf } from "@react-pdf/renderer";

import type {
  SavedCustomEstimate,
  SavedEstimate,
  SavedRoundSizeEstimate,
} from "../types";

import { CutSizeEstimatePdf } from "../pdf/cut-size-estimate-pdf";
import { RoundSizeEstimatePdf } from "../pdf/round-size-estimate-pdf";
import { woodCategories } from "../data/wood-categories";
import { CustomEstimatePdf } from "../pdf/custom-estimate-pdf";

type EstimateUnion =
  | SavedEstimate
  | SavedRoundSizeEstimate
  | SavedCustomEstimate;

interface ShareEstimateDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  estimate: EstimateUnion | null;
}

export function ShareEstimateDialog({
  open,
  onOpenChange,
  estimate,
}: ShareEstimateDialogProps) {
  const [isSharing, setIsSharing] =
    useState(false);

  if (!estimate) {
    return null;
  }

  /*
   * ----------------------------------------
   * GENERATE TEXT
   * ----------------------------------------
   */

  function generateEstimateText() {
    const lines: string[] = [];

    lines.push(
      "WOOD CALCULATOR",
    );

    if(!estimate){
        return null;
    }

    lines.push(
      `Estimate #: ${estimate.estimateNumber}`,
    );

    lines.push(
      `Date: ${estimate.date}`,
    );

    lines.push(
      `Party: ${estimate.partyName}`,
    );

    if (estimate.contactNumber) {
      lines.push(
        `Contact: ${estimate.contactNumber}`,
      );
    }

    if (estimate.reference) {
      lines.push(
        `Reference: ${estimate.reference}`,
      );
    }

    lines.push("");

    lines.push(
      "------------------------------",
    );

    lines.push(
      estimate.type === "ROUND_SIZE"
        ? "ROUND SIZE ITEMS"
        : estimate.type === "CUT_SIZE"
        ? "CUT SIZE ITEMS"
        : "CUSTOM ITEMS",
    );

    lines.push(
      "------------------------------",
    );

    if (estimate.type === "ROUND_SIZE") {
      const roundEstimate =
        estimate as SavedRoundSizeEstimate;

      roundEstimate.items.forEach(
        (item, index) => {
          lines.push(
            `${index + 1}. ${
              item.woodType || "Wood"
            } | Log ${
              item.logNo || "-"
            } | ${
              item.length
            }m | ${
              item.girth
            }cm | ${
              item.cbm.toFixed(3)
            } CBM | ${roundEstimate.cftEnabled ? `${item.cft.toFixed(2)} CFT` : ""}`,
          );
        },
      );

      lines.push("");

      lines.push(
        `Total CBM: ${roundEstimate.totals.totalCbm.toFixed(
          3,
        )}`,
      );

      if (roundEstimate.cftEnabled) {
        lines.push(
          `Total CFT: ${roundEstimate.totals.totalCft.toFixed(
            2,
          )}`,
        );
      }

      lines.push(
        `Price / CBM: Rs. ${Number(
          roundEstimate.pricePerCbm,
        ).toFixed(2)}`,
      );

    } else if(estimate.type === "CUT_SIZE") {
      const cutEstimate =
        estimate as SavedEstimate;

      cutEstimate.items.forEach(
        (item, index) => {
          const category =
            woodCategories.find(
            (category) =>
                category.name ===
                item.woodType,
            );

        const unit =
            category
            ?.calculationMode ===
            "SQFT"
            ? "₹ / SqFt"
            : "₹ / CFT";

          lines.push(
            `${index + 1}. ${
              item.woodType || "Wood"
            } | ${
              item.breadth
            } x ${
              item.height
            } | ${
              item.length
            } ft | Qty ${
              item.quantity
            } | ${
              item.total.toFixed(2)
            } ${unit} | Rs. ${
              item.lineTotal.toFixed(2)
            }`,
          );
        },
      );
    }
    else{
      const customEstimate = estimate as SavedCustomEstimate;

      customEstimate.items.forEach(
        (item, index) => {

          lines.push(
            `${index + 1}. ${
              item.description || `Item ${index + 1}`
            } | Qty ${
              item.quantity
            } | Rs. ${
              item.pricePerUnit
            } | Rs. ${
              item.lineTotal.toFixed(2)
            }`,
          );
        },
      );
    }

    lines.push(
      "------------------------------",
    );

    lines.push(
      `Subtotal: Rs. ${estimate.totals.subtotal.toFixed(
        2,
      )}`,
    );

    if (estimate.gstEnabled) {
      lines.push(
        `GST (${estimate.gstRate}%): Rs. ${estimate.totals.gstAmount.toFixed(
          2,
        )}`,
      );
    }

    lines.push(
      `Other Charges: Rs. ${estimate.totals.totalOtherCharges.toFixed(
        2,
      )}`,
    );

    lines.push(
      `Discount: Rs. ${estimate.totals.discountAmount.toFixed(
        2,
      )}`,
    );

    lines.push("");

    lines.push(
      `GRAND TOTAL: Rs. ${estimate.totals.grandTotal.toFixed(
        2,
      )}`,
    );

    lines.push(
      `Advance Paid: Rs. ${estimate.totals.advancePaid.toFixed(
        2,
      )}`,
    );

    lines.push(
      `Balance Due: Rs. ${estimate.totals.balanceDue.toFixed(
        2,
      )}`,
    );

    if (estimate.notes) {
      lines.push("");

      lines.push(
        `Notes: ${estimate.notes}`,
      );
    }

    return lines.join("\n");
  }

  /*
   * ----------------------------------------
   * COPY TEXT
   * ----------------------------------------
   */

  async function handleCopyText() {
    try {
      const text =
        generateEstimateText();
        
      if(!text){
        return null;
      }

      await navigator.clipboard.writeText(
        text,
      );

      toast.success(
        "Estimate copied as text.",
      );
    } catch (error) {
      console.error(
        "Failed to copy estimate:",
        error,
      );

      toast.error(
        "Unable to copy estimate.",
      );
    }
  }

  /*
   * ----------------------------------------
   * CREATE PDF
   * ----------------------------------------
   */

  async function createPdfBlob() {

    if(!estimate){
        return null;
    }

    if (estimate.type === "ROUND_SIZE") {
      return pdf(
        <RoundSizeEstimatePdf
          estimate={
            estimate as SavedRoundSizeEstimate
          }
        />,
      ).toBlob();
    }

    if(estimate.type === "CUT_SIZE"){
      return pdf(
        <CutSizeEstimatePdf
          estimate={
            estimate as SavedEstimate
          }
        />,
      ).toBlob();
    }
    
    return pdf(
      <CustomEstimatePdf
        estimate={
          estimate as SavedCustomEstimate
        }
      />,
    ).toBlob();
  }

  /*
   * ----------------------------------------
   * DOWNLOAD PDF
   * ----------------------------------------
   */

  async function handleDownloadPdf() {
    try {

      if(!estimate){
        return null;
      }
      setIsSharing(true);

      const blob =
        await createPdfBlob() || new Blob();

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
        "PDF downloaded successfully.",
      );
    } catch (error) {
      console.error(
        "PDF download failed:",
        error,
      );

      toast.error(
        "Unable to generate PDF.",
      );
    } finally {
      setIsSharing(false);
    }
  }

  /*
   * ----------------------------------------
   * SHARE PDF
   * ----------------------------------------
   */

  async function handleSharePdf() {
    try {
      if(!estimate){
        return null;
      }
      setIsSharing(true);

      const blob =
        await createPdfBlob() || new Blob();

      const file = new File(
        [blob],
        `${estimate.estimateNumber}.pdf`,
        {
          type: "application/pdf",
        },
      );

      /*
       * Check whether the browser/device
       * supports sharing files.
       */

      if (
        !navigator.share ||
        !navigator.canShare ||
        !navigator.canShare({
          files: [file],
        })
      ) {
        toast.info(
          "PDF sharing is not supported on this device. Download the PDF instead.",
        );

        await handleDownloadPdf();

        return;
      }

      await navigator.share({
        title: `Estimate ${estimate.estimateNumber}`,
        text: `Estimate ${estimate.estimateNumber} for ${estimate.partyName}`,
        files: [file],
      });

      toast.success(
        "Share sheet opened.",
      );
    } catch (error) {
      /*
       * User closing the native share
       * dialog is not an actual error.
       */

      if (
        error instanceof DOMException &&
        error.name === "AbortError"
      ) {
        return;
      }

      console.error(
        "PDF sharing failed:",
        error,
      );

      toast.error(
        "Unable to share PDF.",
      );
    } finally {
      setIsSharing(false);
    }
  }

  return (
    <Dialog
      open={open}
      onOpenChange={onOpenChange}
    >
      <DialogContent className="max-w-lg">

        {/* HEADER */}

        <DialogHeader>

          <DialogTitle>
            Share Estimate
          </DialogTitle>

        </DialogHeader>

        <div className="space-y-5">

          <p className="text-sm text-muted-foreground">
            Send the estimate as a
            professional PDF or copy the
            estimate details as plain text.
          </p>


          {/* =================================
              SHARE AS PDF
              ================================= */}

          <div className="rounded-lg border p-4">

            <div className="mb-4 flex items-start gap-3">

              <div className="flex size-9 shrink-0 items-center justify-center rounded-md bg-primary/10">

                <FileText className="size-5 text-primary" />

              </div>

              <div>

                <h3 className="font-semibold">
                  Share as PDF
                </h3>

                <p className="text-xs text-muted-foreground">
                  Recommended — looks like a
                  professional estimate
                </p>

              </div>

            </div>

            <div className="flex flex-wrap gap-2">

              <Button
                onClick={
                  handleSharePdf
                }
                disabled={isSharing}
              >
                <Send className="mr-2 size-4" />

                {isSharing
                  ? "Preparing..."
                  : "Share PDF"}
              </Button>

              <Button
                variant="outline"
                onClick={
                  handleDownloadPdf
                }
                disabled={isSharing}
              >
                <Download className="mr-2 size-4" />
                Download PDF
              </Button>

            </div>

            <p className="mt-3 text-xs text-muted-foreground">
              On supported devices, your
              phone or browser will show
              available apps such as
              WhatsApp, Telegram, Mail and
              others.
            </p>

          </div>


          {/* =================================
              COPY AS TEXT
              ================================= */}

          <div className="rounded-lg border p-4">

            <div className="mb-3 flex items-center gap-3">

              <Copy className="size-5" />

              <div>

                <h3 className="font-semibold">
                  Copy as Text
                </h3>

                <p className="text-xs text-muted-foreground">
                  Copy the estimate details
                  for WhatsApp or other apps.
                </p>

              </div>

            </div>

            <div className="max-h-64 overflow-y-auto rounded-md bg-muted/50 p-3">

              <pre className="whitespace-pre-wrap text-xs leading-5">
                {generateEstimateText()}
              </pre>

            </div>

            <Button
              className="mt-3 w-full"
              variant="outline"
              onClick={
                handleCopyText
              }
            >
              <Copy className="mr-2 size-4" />
              Copy Text
            </Button>

          </div>

        </div>

      </DialogContent>
    </Dialog>
  );
}
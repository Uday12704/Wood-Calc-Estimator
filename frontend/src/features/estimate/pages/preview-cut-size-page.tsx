import { useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeft,
  Download,
  Pencil,
  Share2,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
} from "@/components/ui/card";

import {
  getEstimateById,
} from "../services/estimate-storage";
import { woodCategories } from "../data/wood-categories";
import { pdf } from "@react-pdf/renderer";
import { CutSizeEstimatePdf } from "../pdf/cut-size-estimate-pdf";
import { toast } from "react-toastify";
import { useAuth } from "@/features/auth/auth-context";
import { ShareEstimateDialog } from "../components/share-estimate-dialog";
import { formatCurrency } from "@/lib/formatters";

export function PreviewCutSizePage() {
  const { user } = useAuth();
  const { id } = useParams();
  const navigate = useNavigate();
  const [shareOpen, setShareOpen] = useState(false);

  const estimate = useMemo(() => {
    if (!id || !user?.accountId) {
      return null;
    }

    return getEstimateById(
      user.accountId,
      id,
    );
  }, [id, user?.accountId]);

  if (!estimate) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">

        <div className="text-center">

          <h2 className="text-xl font-semibold">
            Estimate not found
          </h2>

          <p className="mt-2 text-sm text-muted-foreground">
            The estimate you're looking for
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

  async function handleExport() {
    if (!estimate) {
      toast.error("Estimate not found.");
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

      link.download = `${estimate.partyName}(${estimate.estimateNumber}).pdf`;

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

      {/* TOP ACTION BAR */}

      <div className="no-print flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">

        <div className="flex items-center gap-3">

          <Button
            variant="outline"
            size="icon"
            onClick={() =>
              navigate(-1)
            }
            className="cursor-pointer"
          >
            <ArrowLeft className="size-4" />
          </Button>

          <div>
            <h1 className="text-2xl font-semibold">
              Estimate Preview
            </h1>

            <p className="text-sm text-muted-foreground">
              {estimate.estimateNumber}
            </p>
          </div>

        </div>

        <div className="flex gap-2">

          <Button
            variant="outline"
            onClick={() =>
              navigate(`/app/estimates/edit-cut-size/${estimate.id}`)
            }
            className="cursor-pointer"
          >
            <Pencil className="mr-2 size-4" />
            Edit
          </Button>

          <Button
            variant="outline"
            onClick={() =>
              setShareOpen(true)
            }
            className="cursor-pointer"
          >
            <Share2 className="mr-2 size-4" />
            Share
          </Button>

          <Button
           onClick={handleExport}
           className="cursor-pointer"
          >
            <Download className="mr-2 size-4" />
            Export
          </Button>

        </div>

      </div>

      {/* ESTIMATE DOCUMENT */}

      <Card className="print-estimate mx-auto max-w-5xl">

        <CardContent className="print-page p-8">

          {/* COMPANY HEADER */}

          <div className="flex flex-col gap-4 border-b pb-6 sm:flex-row sm:items-start sm:justify-between">

            <div>

                <div>
                    <h2 className="text-2xl font-bold">
                        Wood Estimator
                    </h2>

                    <p className="mt-1 text-sm text-muted-foreground">
                        Wood Estimation & Sales
                    </p>
                </div>

            </div>

            <div className="text-left sm:text-right">

              <h3 className="text-lg font-semibold">
                {
                  estimate.documentTitle
                }
              </h3>

              <p className="text-sm">
                No:{" "}
                <span className="font-medium">
                  {
                    estimate.estimateNumber
                  }
                </span>
              </p>

              <p className="text-sm">
                Date:{" "}
                {estimate.date}
              </p>

            </div>

          </div>

          {/* CUSTOMER INFORMATION */}

          <div className="grid gap-6 border-b py-6 sm:grid-cols-2">

            <div>

              <p className="text-xs font-medium uppercase text-muted-foreground">
                Party Name
              </p>

              <p className="mt-1 font-medium">
                {
                  estimate.partyName ||
                  "—"
                }
              </p>

            </div>

            <div>

              <p className="text-xs font-medium uppercase text-muted-foreground">
                Contact Number
              </p>

              <p className="mt-1 font-medium">
                {
                  estimate.contactNumber ||
                  "—"
                }
              </p>

            </div>

            <div>

              <p className="text-xs font-medium uppercase text-muted-foreground">
                Reference
              </p>

              <p className="mt-1 font-medium">
                {
                  estimate.reference ||
                  "—"
                }
              </p>

            </div>

            <div>

              <p className="text-xs font-medium uppercase text-muted-foreground">
                Status
              </p>

              <p className="mt-1 font-medium">
                {estimate.status ===
                "CONFIRMED"
                  ? "Confirmed"
                  : "On Hold"}
              </p>

            </div>

          </div>

          {/* ITEMS */}

          <div className="py-6">

            <h3 className="mb-3 text-base font-semibold">
              Wood Items
            </h3>

            <div className="overflow-x-auto">

              <table className="w-full border-collapse text-sm">

                <thead>

                  <tr className="border-b bg-muted/50">

                    <th className="px-3 py-2 text-left">
                      #
                    </th>

                    <th className="px-3 py-2 text-left">
                      Width (in)
                    </th>

                    <th className="px-3 py-2 text-left">
                      Height (in)
                    </th>

                    <th className="px-3 py-2 text-left">
                      Wood Type
                    </th>

                    <th className="px-3 py-2 text-right">
                      Length (ft)
                    </th>

                    <th className="px-3 py-2 text-right">
                      Qty
                    </th>

                    <th className="px-3 py-2 text-right">
                      Total
                    </th>

                    <th className="px-3 py-2 text-right">
                      Rate
                    </th>

                    <th className="px-3 py-2 text-right">
                      Amount
                    </th>

                  </tr>

                </thead>

                <tbody>

                    {estimate.items.map((item, index) => {
                        const category = woodCategories.find(
                            (category) =>
                            category.name === item.woodType,
                        );

                        const unit =
                            category?.calculationMode === "SQFT"
                            ? "sqft"
                            : "cft";

                        return (
                            <tr key={item.id}
                                className="border-b"
                            >
                                <td className="px-3 py-3">
                                    {index + 1}
                                </td>

                                <td className="px-3 py-3">
                                    {item.width}
                                </td>

                                <td className="px-3 py-3">
                                    {item.height}
                                </td>

                                <td className="px-3 py-3">
                                    {item.woodType}
                                </td>

                                <td className="px-3 py-3 text-right">
                                    {item.length}
                                </td>

                                <td className="px-3 py-3 text-right">
                                    {item.quantity}
                                </td>

                                <td className="px-3 py-3 text-right">
                                    {item.total.toFixed(2)} {unit}
                                </td>

                                <td className="px-3 py-3 text-right">
                                    {Number(
                                        item.pricePerUnit,
                                    ).toFixed(2)}
                                </td>

                                <td className="px-3 py-3 text-right font-medium">
                                    {item.lineTotal.toFixed(
                                        2,
                                    )}
                                </td>
                            </tr>
                        );
                    })}
                </tbody>

              </table>

            </div>

          </div>

          {/* ADDITIONAL ITEMS */}
        {estimate.additionalItemsEnabled && 
          <div className="py-6">

            <h3 className="mb-3 text-base font-semibold">
              Additional Items
            </h3>

            <div className="overflow-x-auto">

              <table className="w-full border-collapse text-sm">

                <thead>

                  <tr className="border-b bg-muted/50">

                    <th className="px-3 py-2 text-left">
                      #
                    </th>

                    <th className="px-3 py-2 text-left">
                      Description
                    </th>

                    <th className="px-3 py-2 text-right">
                      Qty
                    </th>

                    <th className="px-3 py-2 text-right">
                      Unit
                    </th>

                    <th className="px-3 py-2 text-right">
                      Rate
                    </th>

                    <th className="px-3 py-2 text-right">
                      Amount
                    </th>

                  </tr>

                </thead>

                <tbody>
                    {estimate.additionalItems.map((item, index) => {
                        return (
                            <tr key={item.id}
                                className="border-b"
                            >
                                <td className="px-3 py-3">
                                    {index + 1}
                                </td>

                                <td className="px-3 py-3">
                                    {item.description}
                                </td>

                                <td className="px-3 py-3 text-right">
                                    {item.quantity}
                                </td>

                                <td className="px-3 py-3 text-right">
                                    {item.unit ? item.unit : "-"}
                                </td>

                                <td className="px-3 py-3 text-right">
                                    {Number(
                                        item.pricePerUnit,
                                    ).toFixed(2)}
                                </td>

                                <td className="px-3 py-3 text-right font-medium">
                                    {item.lineTotal.toFixed(
                                        2,
                                    )}
                                </td>
                            </tr>
                        );
                    })}
                </tbody>
              </table>
            </div>

            {/* ADDITIONAL TOTALS */}

            <div className="ml-auto w-full max-w-sm space-y-2 text-sm py-2">

              <div className="flex justify-between">
                <span>
                  Additional Subtotal
                </span>

                <span className="font-medium">
                  {formatCurrency(estimate.totals.additionalSubtotal)}
                </span>
              </div>


              {estimate.additionalItemGstEnabled && (
                <div className="flex justify-between">
                  <span>
                    GST ({estimate.additionalItemGstRate}%)
                  </span>

                  <span>
                    {formatCurrency(estimate.totals.additionalGstAmount)}
                  </span>
                </div>
              )}


              <div className="border-t pt-2" />

              <div className="flex justify-between text-base font-semibold">
                <span>
                  Additional Total
                </span>

                <span>
                  {formatCurrency(estimate.totals.additionalTotal)}
                </span>
              </div>

            </div>
          </div>
          }

          {/* BOTTOM SECTION */}

          <div className="grid gap-8 border-t pt-6 sm:grid-cols-2">

            {/* OTHER CHARGES */}

            <div>

              <h3 className="mb-3 font-semibold">
                Other Charges
              </h3>

              {estimate.otherCharges
                .length === 0 ? (
                <p className="text-sm text-muted-foreground">
                  No other charges.
                </p>
              ) : (
                <div className="space-y-2">

                  {estimate.otherCharges.map(
                    (charge) => (
                      <div
                        key={charge.id}
                        className="flex justify-between text-sm"
                      >

                        <span>
                          {charge.name}
                        </span>

                        <span>
                          {formatCurrency(charge.amount)}
                        </span>

                      </div>
                    ),
                  )}

                </div>
              )}

            </div>

            {/* SUMMARY */}

            <div className="space-y-2 text-sm">

              <div className="flex justify-between">
                <span className="font-semibold">Subtotal</span>
                <span className="font-semibold">
                  {formatCurrency(estimate.totals.subtotal)}
                </span>
              </div>

              {estimate.gstEnabled && (
                <div className="flex justify-between">
                  <span>
                    GST ({estimate.gstRate}%)
                  </span>

                  <span>
                    {formatCurrency(estimate.totals.gstAmount)}
                  </span>
                </div>
              )}

              {estimate.additionalItemGstEnabled && (
                <div className="flex justify-between">
                  <span>
                    Additional Total
                  </span>

                  <span>
                    {formatCurrency(estimate.totals.additionalTotal)}
                  </span>
                </div>
              )}

              {estimate.totals.totalOtherCharges !== 0 &&
              <div className="flex justify-between">
                <span>
                  Other Charges
                </span>

                <span>
                  {formatCurrency(estimate.totals.totalOtherCharges)}
                </span>
              </div>
              }

              <div className="flex justify-between">
                <span>
                  Discount
                </span>

                <span>
                  - {formatCurrency(estimate.totals.discountAmount)}
                </span>
              </div>

              <div className="my-3 border-t" />

              <div className="flex justify-between text-base font-bold">
                <span>
                  Grand Total
                </span>

                <span>
                  {formatCurrency(estimate.totals.grandTotal)}
                </span>
              </div>

              <div className="flex justify-between">
                <span>
                  Advance Paid
                </span>

                <span>
                  {formatCurrency(estimate.totals.advancePaid)}
                </span>
              </div>

              <div className="flex justify-between font-semibold">
                <span>
                  Balance Due
                </span>

                <span>
                  {formatCurrency(estimate.totals.balanceDue)}
                </span>
              </div>
              
              {estimate.totals.totalCft > 0 && 
              <div className="flex justify-between text-muted-foreground">
                <span>Total CFT</span>
                <span>
                    {estimate.totals.totalCft.toFixed(2)} CFT
                </span>
              </div>
              }

              {estimate.totals.totalSqft > 0 && 
              <div className="flex justify-between text-muted-foreground">
                <span>Total SQFT</span>
                <span>
                    {estimate.totals.totalSqft.toFixed(2)} SQFT
                </span>
              </div>
              }

            </div>

          </div>

          {/* NOTES */}

          {estimate.notes && (
            <div className="mt-8 border-t pt-6">

              <h3 className="font-semibold">
                Notes
              </h3>

              <p className="mt-2 whitespace-pre-wrap text-sm text-muted-foreground">
                {estimate.notes}
              </p>

            </div>
          )}

        </CardContent>

      </Card>
      <ShareEstimateDialog
        open={shareOpen}
        onOpenChange={setShareOpen}
        estimate={estimate}
      />
    </div>
  );
}
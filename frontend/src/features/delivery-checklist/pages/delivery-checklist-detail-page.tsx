import { useMemo, useState } from "react";
import { ArrowLeft, CheckCircle2, Circle, Download } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";


import {
  getDeliveryChecklistByEstimateId,
  saveDeliveryChecklist,
} from "../services/delivery-checklist-storage";
import type { SavedCustomEstimate, SavedEstimate, SavedRoundSizeEstimate } from "@/features/estimate/types";
import { getSavedCustomEstimates, getSavedEstimates, getSavedRoundEstimates } from "@/features/estimate/services/estimate-storage";
import type { DeliveryChecklist, DeliveryItemStatus } from "../types";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { pdf } from "@react-pdf/renderer";
import { DeliveryChecklistPdf } from "../utils/delivery-checklist-pdf";
import { toast } from "react-toastify";


type DeliveryEstimate =
  | SavedEstimate
  | SavedRoundSizeEstimate
  | SavedCustomEstimate;

export function DeliveryChecklistDetailPage() {
  const navigate = useNavigate();

  const { type, id } = useParams<{
    type: string;
    id: string;
  }>();

  const estimate = useMemo<DeliveryEstimate | null>(() => {
    if (!id) {
      return null;
    }

    switch (type) {
      case "cut-size":
        return getSavedEstimates().find(
          (estimate) => estimate.id === id,
        ) ?? null;

      case "round-size":
        return getSavedRoundEstimates().find(
          (estimate) => estimate.id === id,
        ) ?? null;

      case "custom":
        return getSavedCustomEstimates().find(
          (estimate) => estimate.id === id,
        ) ?? null;

      default:
        return null;
    }
  }, [type, id]);

  const initialChecklist = useMemo<DeliveryChecklist | null>(() => {
    if (!estimate) {
      return null;
    }

    const existingChecklist =
      getDeliveryChecklistByEstimateId(estimate.id);

    if (existingChecklist) {
      return existingChecklist;
    }

    const items: DeliveryItemStatus[] =
      estimate.items.map((item) => ({
        itemId: item.id,
        delivered: false,
      }));

    let additionalItems: DeliveryItemStatus[] = [];

    if (
      estimate.type === "CUT_SIZE" &&
      estimate.additionalItemsEnabled
    ) {
      additionalItems =
        estimate.additionalItems.map((item) => ({
          itemId: item.id,
          delivered: false,
        }));
    }

    return {
      estimateId: estimate.id,
      items,
      additionalItems,
      updatedAt: new Date().toISOString(),
    };
  }, [estimate]);

  const [checklist, setChecklist] =
    useState<DeliveryChecklist | null>(
      initialChecklist,
    );

  const deliveryStats = useMemo(() => {
    if (!checklist) {
      return {
        delivered: 0,
        total: 0,
        percentage: 0,
        isDelivered: false,
      };
    }

    const allItems = [
      ...checklist.items,
      ...checklist.additionalItems,
    ];

    const total = allItems.length;

    const delivered = allItems.filter(
      (item) => item.delivered,
    ).length;

    const percentage =
      total === 0
        ? 0
        : Math.round((delivered / total) * 100);

    return {
      delivered,
      total,
      percentage,
      isDelivered:
        total > 0 && delivered === total,
    };
  }, [checklist]);

  if (!estimate || !checklist) {
    return (
      <div className="space-y-6">
        <Button
          variant="ghost"
          onClick={() =>
            navigate("/app/delivery-checklist")
          }
        >
          <ArrowLeft className="mr-2 size-4" />
          Back
        </Button>

        <Card>
          <CardContent className="flex min-h-60 items-center justify-center">
            <p className="text-sm text-muted-foreground">
              Estimate not found.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  function updateItemStatus(
    itemId: string,
    delivered: boolean,
    isAdditional = false,
  ) {
    if (!checklist) {
        return;
    }
    const updatedChecklist: DeliveryChecklist = {
      ...checklist,
      items: isAdditional
        ? checklist.items
        : checklist.items.map((item) =>
            item.itemId === itemId
              ? {
                  ...item,
                  delivered,
                }
              : item,
          ),
      additionalItems: isAdditional
        ? checklist.additionalItems.map((item) =>
            item.itemId === itemId
              ? {
                  ...item,
                  delivered,
                }
              : item,
          )
        : checklist.additionalItems,
      updatedAt: new Date().toISOString(),
    };

    setChecklist(updatedChecklist);
    saveDeliveryChecklist(updatedChecklist);
  }

  async function handleDownloadPdf() {
    if (!estimate || !checklist) {
        return;
    }

    try {
        const blob = await pdf(
        <DeliveryChecklistPdf
            estimate={estimate}
            checklist={checklist}
        />,
        ).toBlob();

        const url = URL.createObjectURL(blob);

        const link = document.createElement("a");
        link.href = url;
        link.download = `Delivery-Checklist-${estimate.estimateNumber}.pdf`;

        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        URL.revokeObjectURL(url);
    } catch (error) {
        console.error("Failed to generate delivery checklist PDF:", error);

        toast.error(
        "Failed to generate delivery checklist PDF.",
        );
    }
    }

  return (
    <div className="space-y-6">
      {/* PAGE HEADER */}

      <div className="flex-cols items-center justify-between gap-4">
        <div>
            <div className="flex items-center justify-between gap-4">
                <Button
                    variant="ghost"
                    className="-ml-3 mb-2"
                    onClick={() =>
                    navigate("/app/delivery-checklist")
                    }
                >
                    <ArrowLeft className="mr-2 size-4" />
                    Delivery Checklist
                </Button>

                <Button
                    type="button"
                    variant="outline"
                    onClick={handleDownloadPdf}
                    disabled={!estimate || !checklist}
                    className="cursor-pointer"
                    >
                    <Download className="mr-2 h-4 w-4" />
                    Download PDF
                </Button>
            </div>
            <div className="flex items-center justify-between gap-4">
                <h1 className="text-2xl font-semibold tracking-tight">
                    Delivery Checklist
                </h1>

                {/* DELIVERY STATUS */}
                <div
                className={"flex items-center gap-2 rounded-full px-3 py-1.5 text-sm font-medium"}
                >
                    <Badge
                    variant={
                        deliveryStats.isDelivered ? "success" : "warning"
                    }
                    >
                        {deliveryStats.isDelivered ? (
                            <CheckCircle2 className="size-4" />
                        ) : (
                            <Circle className="size-4" />
                        )}
                        {deliveryStats.isDelivered
                        ? "Delivered"
                        : "Pending"}
                    </Badge>
                </div>
            </div>

          <p className="mt-1 text-sm text-muted-foreground">
            Mark each item as delivered.
          </p>
        </div>
      </div>

      {/* ESTIMATE INFORMATION */}

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between gap-4">
            <CardTitle>Estimate</CardTitle>

            <span className="rounded-full bg-green-100 px-2.5 py-1 text-xs font-medium text-green-700">
              Confirmed
            </span>
          </div>
        </CardHeader>

        <CardContent>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            <InfoItem
              label="Estimate No"
              value={estimate.estimateNumber}
            />

            <InfoItem
              label="Date"
              value={estimate.date}
            />

            <InfoItem
              label="Party Name"
              value={estimate.partyName || "—"}
            />

            <InfoItem
              label="Contact Number"
              value={estimate.contactNumber || "—"}
            />

            <InfoItem
              label="Reference"
              value={estimate.reference || "—"}
            />

            <InfoItem
              label="Type"
              value={getEstimateTypeLabel(estimate.type)}
            />
          </div>
        </CardContent>
      </Card>

      {/* DELIVERY PROGRESS */}

      <Card>
        <CardContent className="p-5">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-sm font-medium">
                Delivery Progress
              </p>

              <p className="mt-1 text-sm text-muted-foreground">
                {deliveryStats.delivered} of{" "}
                {deliveryStats.total} items delivered
              </p>
            </div>

            <span className="text-2xl font-semibold">
              {deliveryStats.percentage}%
            </span>
          </div>

          <div className="mt-4 h-3 overflow-hidden rounded-full bg-gray-300">
            <div
              className="h-full rounded-full bg-blue-500 transition-all"
              style={{
                width: `${deliveryStats.percentage}%`,
              }}
            />
          </div>
        </CardContent>
      </Card>

      {/* CUT SIZE */}

      {estimate.type === "CUT_SIZE" && (
        <>
          <Card>
            <CardHeader>
              <CardTitle>Items</CardTitle>
            </CardHeader>

            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b bg-muted/40">
                      <th className="px-4 py-3 text-left font-medium">
                        S.no
                      </th>

                      <th className="px-4 py-3 text-left font-medium">
                        Description
                      </th>

                      <th className="px-4 py-3 text-left font-medium">
                        Size
                      </th>

                      <th className="px-4 py-3 text-left font-medium">
                        Length
                      </th>

                      <th className="px-4 py-3 text-left font-medium">
                        Qty
                      </th>

                      <th className="px-4 py-3 text-center font-medium">
                        Delivery Status
                      </th>
                    </tr>
                  </thead>

                  <tbody>
                    {estimate.items.map(
                      (item, index) => {
                        const status =
                          checklist.items.find(
                            (status) =>
                              status.itemId === item.id,
                          );

                        return (
                          <tr
                            key={item.id}
                            className="border-b last:border-0"
                          >
                            <td className="px-4 py-3">
                              {index + 1}
                            </td>

                            <td className="px-4 py-3 font-medium">
                              {item.woodType || "—"}
                            </td>

                            <td className="px-4 py-3">
                              {item.breadth} x{" "}
                              {item.height}
                            </td>

                            <td className="px-4 py-3">
                              {item.length}
                            </td>

                            <td className="px-4 py-3">
                              {item.quantity}
                            </td>

                            <td className="px-4 py-3 flex justify-center items-center">
                              <Checkbox
                                checked={
                                  status?.delivered ??
                                  false
                                }
                                onCheckedChange={(
                                  checked,
                                ) =>
                                  updateItemStatus(
                                    item.id,
                                    checked === true,
                                  )
                                }
                                className="border-foreground/30"
                              />
                            </td>
                          </tr>
                        );
                      },
                    )}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>

          {/* ADDITIONAL ITEMS */}

          {estimate.additionalItemsEnabled && (
            <Card>
              <CardHeader>
                <CardTitle>
                  Additional Items
                </CardTitle>
              </CardHeader>

              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b bg-muted/40">
                        <th className="px-4 py-3 text-left font-medium">
                          S.no
                        </th>

                        <th className="px-4 py-3 text-left font-medium">
                          Description
                        </th>
                        
                        <th className="px-4 py-3 text-left font-medium">
                          Qty
                        </th>

                        <th className="px-4 py-3 text-center font-medium">
                          Delivery Status
                        </th>
                      </tr>
                    </thead>

                    <tbody>
                      {estimate.additionalItems.map(
                        (item, index) => {
                          const status =
                            checklist.additionalItems.find(
                              (status) =>
                                status.itemId ===
                                item.id,
                            );

                          return (
                            <tr
                              key={item.id}
                              className="border-b last:border-0"
                            >
                              <td className="px-4 py-3">
                                {index + 1}
                              </td>

                              <td className="px-4 py-3 font-medium">
                                {item.description ||
                                  "—"}
                              </td>

                              <td className="px-4 py-3">
                                {item.quantity}
                              </td>

                              <td className="px-4 py-3 flex justify-center items-center">
                                <Checkbox
                                  checked={
                                    status?.delivered ??
                                    false
                                  }
                                  onCheckedChange={(
                                    checked,
                                  ) =>
                                    updateItemStatus(
                                      item.id,
                                      checked === true,
                                      true,
                                    )
                                  }
                                  className="border-foreground/30"
                                />
                              </td>
                            </tr>
                          );
                        },
                      )}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          )}
        </>
      )}

      {/* ROUND SIZE */}

      {estimate.type === "ROUND_SIZE" && (
        <Card>
          <CardHeader>
            <CardTitle>Items</CardTitle>
          </CardHeader>

          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b bg-muted/40">
                    <th className="px-4 py-3 text-left font-medium">
                      S.no
                    </th>

                    <th className="px-4 py-3 text-left font-medium">
                      Wood Type
                    </th>

                    <th className="px-4 py-3 text-left font-medium">
                      Log No
                    </th>

                    <th className="px-4 py-3 text-left font-medium">
                      Length (m)
                    </th>

                    <th className="px-4 py-3 text-left font-medium">
                      Girth (cm)
                    </th>

                    <th className="px-4 py-3 text-center font-medium">
                      Delivery Status
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {estimate.items.map(
                    (item, index) => {
                      const status =
                        checklist.items.find(
                          (status) =>
                            status.itemId === item.id,
                        );

                      return (
                        <tr
                          key={item.id}
                          className="border-b last:border-0"
                        >
                          <td className="px-4 py-3">
                            {index + 1}
                          </td>

                          <td className="px-4 py-3 font-medium">
                            {item.woodType || "—"}
                          </td>

                          <td className="px-4 py-3">
                            {item.logNo || "—"}
                          </td>

                          <td className="px-4 py-3">
                            {item.length}
                          </td>

                          <td className="px-4 py-3">
                            {item.girth}
                          </td>

                          <td className="px-4 py-3 flex justify-center items-center">
                            <Checkbox
                              checked={
                                status?.delivered ??
                                false
                              }
                              onCheckedChange={(
                                checked,
                              ) =>
                                updateItemStatus(
                                  item.id,
                                  checked === true,
                                )
                              }
                              className="border-foreground/30"
                            />
                          </td>
                        </tr>
                      );
                    },
                  )}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}

      {/* CUSTOM */}

      {estimate.type === "CUSTOM" && (
        <Card>
          <CardHeader>
            <CardTitle>Items</CardTitle>
          </CardHeader>

          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b bg-muted/40">
                    <th className="px-4 py-3 text-left font-medium">
                      S.no
                    </th>

                    <th className="px-4 py-3 text-left font-medium">
                      Description
                    </th>

                    <th className="px-4 py-3 text-left font-medium">
                      Qty
                    </th>

                    <th className="px-4 py-3 text-center font-medium">
                      Delivery Status
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {estimate.items.map(
                    (item, index) => {
                      const status =
                        checklist.items.find(
                          (status) =>
                            status.itemId === item.id,
                        );

                      return (
                        <tr
                          key={item.id}
                          className="border-b last:border-0"
                        >
                          <td className="px-4 py-3">
                            {index + 1}
                          </td>

                          <td className="px-4 py-3 font-medium">
                            {item.description || "—"}
                          </td>

                          <td className="px-4 py-3">
                            {item.quantity}
                          </td>

                          <td className="px-4 py-3 flex justify-center items-center">
                            <Checkbox
                              checked={
                                status?.delivered ??
                                false
                              }
                              onCheckedChange={(
                                checked,
                              ) =>
                                updateItemStatus(
                                  item.id,
                                  checked === true,
                                )
                              }
                              className="border-foreground/30"
                            />
                          </td>
                        </tr>
                      );
                    },
                  )}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}

      {/* COMPLETED MESSAGE */}

      {deliveryStats.isDelivered && (
        <Card className="border-green-200 bg-green-500/10">
          <CardContent className="flex items-center gap-3 p-5">
            <CheckCircle2 className="size-6 text-green-600" />

            <div>
              <p className="font-semibold text-green-700">
                Estimate Delivered
              </p>

              <p className="text-sm text-green-600">
                All items in this estimate have been
                marked as delivered.
              </p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

function InfoItem({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div>
      <p className="text-xs font-medium text-muted-foreground">
        {label}
      </p>

      <p className="mt-1 text-sm font-medium">
        {value}
      </p>
    </div>
  );
}

function getEstimateTypeLabel(
  type: DeliveryEstimate["type"],
): string {
  switch (type) {
    case "CUT_SIZE":
      return "Cut Size";

    case "ROUND_SIZE":
      return "Round Size";

    case "CUSTOM":
      return "Custom";
  }
}
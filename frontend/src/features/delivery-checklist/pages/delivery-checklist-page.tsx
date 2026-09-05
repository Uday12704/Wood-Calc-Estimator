import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { CheckCircle2, ChevronRight, ClipboardCheck, Clock3, ListChecks, Search, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
} from "@/components/ui/card";

import { getSavedCustomEstimates, getSavedEstimates, getSavedRoundEstimates } from "@/features/estimate/services/estimate-storage";

import { getDeliveryProgress } from "../services/delivery-checklist-storage";
import { Badge } from "@/components/ui/badge";
import type { DeliveryEstimate } from "../types";


function getTotalDeliveryItems(
  estimate: DeliveryEstimate,
): number {
  switch (estimate.type) {
    case "CUT_SIZE": {
      return (
        estimate.items.length +
        (estimate.additionalItemsEnabled
          ? estimate.additionalItems.length
          : 0)
      );
    }

    case "ROUND_SIZE":
      return estimate.items.length;

    case "CUSTOM":
      return estimate.items.length;
  }
}

export function DeliveryChecklistPage() {
  const navigate = useNavigate();

  const [search, setSearch] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");

  const estimates = useMemo<DeliveryEstimate[]>(() => {
    const cutEstimates =
      getSavedEstimates().filter(
        (estimate) =>
          estimate.status === "CONFIRMED",
      );

    const roundEstimates =
      getSavedRoundEstimates().filter(
        (estimate) =>
          estimate.status === "CONFIRMED",
      );

    const customEstimates =
      getSavedCustomEstimates().filter(
        (estimate) =>
          estimate.status === "CONFIRMED",
      );

    return [
      ...cutEstimates,
      ...roundEstimates,
      ...customEstimates,
    ].sort(
      (a, b) =>
        new Date(b.updatedAt).getTime() -
        new Date(a.updatedAt).getTime(),
    );
  }, []);

  const filteredEstimates = useMemo(() => {
    const query = search.trim().toLowerCase();

    return estimates.filter((estimate) => {
        // Search by party name OR estimate number
        const matchesSearch =
        !query ||
        estimate.partyName
            .toLowerCase()
            .includes(query) ||
        estimate.estimateNumber
            .toLowerCase()
            .includes(query);

        // Date filtering
        const estimateDate = new Date(
        estimate.date,
        );

        const matchesFromDate =
        !fromDate ||
        estimateDate >= new Date(`${fromDate}T00:00:00`);

        const matchesToDate =
        !toDate ||
        estimateDate <= new Date(`${toDate}T23:59:59`);

        return (
        matchesSearch &&
        matchesFromDate &&
        matchesToDate
        );
    });
    }, [estimates, search, fromDate, toDate]);

  return (
    <div className="space-y-6">
      {/* PAGE HEADER */}

      <div>
        <h1 className="text-2xl font-semibold tracking-tight">
          Delivery Checklists
        </h1>

        <p className="mt-1 text-sm text-muted-foreground">
          Track delivery status for confirmed estimates.
        </p>
      </div>

      {/* SEARCH & FILTERS */}

        <Card>
        <CardContent className="p-4">
            <div className="grid gap-4 md:grid-cols-[1fr_180px_180px_auto]">
            {/* Search */}
            <div className="relative flex items-center justify-center">
                <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />

                <input
                type="text"
                placeholder="Search party name or estimate number..."
                value={search}
                onChange={(event) =>
                    setSearch(event.target.value)
                }
                className="h-10 w-full rounded-md border bg-background pl-9 pr-9 text-sm outline-none transition-colors placeholder:text-muted-foreground focus:border-primary focus:ring-1 focus:ring-primary"
                />

                {search && (
                <button
                    type="button"
                    onClick={() => setSearch("")}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                    <X className="size-4" />
                </button>
                )}
            </div>

            {/* From Date */}
            <div>
                <label className="mb-1.5 block text-xs font-medium text-muted-foreground">
                From Date
                </label>

                <input
                type="date"
                value={fromDate}
                onChange={(event) =>
                    setFromDate(event.target.value)
                }
                className="h-10 w-full rounded-md border bg-background px-3 text-sm outline-none transition-colors focus:border-primary focus:ring-1 focus:ring-primary"
                />
            </div>

            {/* To Date */}
            <div>
                <label className="mb-1.5 block text-xs font-medium text-muted-foreground">
                To Date
                </label>

                <input
                type="date"
                value={toDate}
                onChange={(event) =>
                    setToDate(event.target.value)
                }
                className="h-10 w-full rounded-md border bg-background px-3 text-sm outline-none transition-colors focus:border-primary focus:ring-1 focus:ring-primary"
                />
            </div>

            {/* Clear */}
            <div className="flex items-end">
                <Button
                type="button"
                variant="outline"
                className="h-10"
                onClick={() => {
                    setSearch("");
                    setFromDate("");
                    setToDate("");
                }}
                disabled={
                    !search &&
                    !fromDate &&
                    !toDate
                }
                >
                <X className="mr-2 size-4" />
                Clear
                </Button>
            </div>
            </div>

            {/* Result count */}
            <div className="mt-3 text-xs text-muted-foreground">
            Showing{" "}
            <span className="font-medium text-foreground">
                {filteredEstimates.length}
            </span>{" "}
            of{" "}
            <span className="font-medium text-foreground">
                {estimates.length}
            </span>{" "}
            confirmed estimates
            </div>
        </CardContent>
        </Card>

      {/* ESTIMATE LIST */}

      {filteredEstimates.length === 0 ? (
        <Card>
            <CardContent className="flex min-h-60 flex-col items-center justify-center text-center">
            <ClipboardCheck className="mb-4 size-10 text-muted-foreground" />

            {estimates.length === 0 ? (
                <>
                <h2 className="text-lg font-semibold">
                    No confirmed estimates
                </h2>

                <p className="mt-1 text-sm text-muted-foreground">
                    Confirm an estimate to see it in the
                    delivery checklist.
                </p>
                </>
            ) : (
                <>
                <h2 className="text-lg font-semibold">
                    No matching estimates
                </h2>

                <p className="mt-1 text-sm text-muted-foreground">
                    Try changing your search or date filters.
                </p>

                <Button
                    type="button"
                    variant="outline"
                    className="mt-4"
                    onClick={() => {
                    setSearch("");
                    setFromDate("");
                    setToDate("");
                    }}
                >
                    Clear Filters
                </Button>
                </>
            )}
            </CardContent>
        </Card>
        ) : (
        <div className="space-y-3">
          {filteredEstimates.map((estimate) => {
            const totalItems = getTotalDeliveryItems(estimate);

            const progress = getDeliveryProgress(
                estimate.id,
                totalItems,
            );

            return (
                <Card
                key={`${estimate.type}-${estimate.id}`}
                className="overflow-hidden transition-all hover:shadow-md"
                >
                <CardContent className="p-0">
                    <div className="flex items-center gap-6 p-5">
                    {/* Estimate Information */}
                    <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                        <h2 className="text-base font-semibold flex items-center">
                            <ListChecks className="mr-2 size-4" />
                            {estimate.estimateNumber}
                        </h2>

                        <span className="rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-700">
                            Confirmed
                        </span>

                        <span className="rounded-full bg-muted px-2.5 py-0.5 text-xs font-medium text-muted-foreground">
                            {getEstimateTypeLabel(estimate.type)}
                        </span>
                        </div>

                        <div className="mt-2 flex flex-wrap items-center gap-x-6 gap-y-1 text-sm text-muted-foreground">
                        <span>
                            <span className="font-medium text-foreground">
                            Party:
                            </span>{" "}
                            {estimate.partyName || "—"}
                        </span>

                        <span>
                            <span className="font-medium text-foreground">
                            Date:
                            </span>{" "}
                            {estimate.date}
                        </span>

                        <span>
                            <span className="font-medium text-foreground">
                            Reference:
                            </span>{" "}
                            {estimate.reference || "—"}
                        </span>
                        </div>
                    </div>

                    {/* Delivery Progress */}
                    <div className="hidden w-56 shrink-0 sm:block">
                        <div className="mb-1.5 flex items-center justify-between">
                        <span className="text-xs font-medium text-muted-foreground">
                            Delivery Progress
                        </span>

                        <span className="text-xs font-semibold">
                            {progress.deliveredItems}/{progress.totalItems}
                        </span>
                        </div>

                        <div className="h-2 overflow-hidden rounded-full bg-gray-200">
                        <div
                            className="h-full rounded-full bg-blue-500 transition-all"
                            style={{
                            width: `${progress.percentage}%`,
                            }}
                        />
                        </div>

                        <div className="mt-1 flex justify-between text-xs text-muted-foreground">
                        <span>
                            {progress.percentage}% delivered
                        </span>

                        <Badge variant={progress.isDelivered ? "success" : "warning"}>
                            {progress.isDelivered
                            ? "Completed"
                            : "Pending"}
                        </Badge>
                        </div>
                    </div>

                    {/* Delivery Status */}
                    <div className="hidden w-28 shrink-0 justify-center md:flex">
                        {progress.isDelivered ? (
                        <div className="flex flex-col items-center gap-1 text-green-600">
                            <CheckCircle2 className="size-6" />
                            <span className="text-xs font-semibold">
                            Delivered
                            </span>
                        </div>
                        ) : (
                        <div className="flex flex-col items-center gap-1 text-muted-foreground">
                            <Clock3 className="size-6" />
                            <span className="text-xs font-semibold">
                            Pending
                            </span>
                        </div>
                        )}
                    </div>

                    {/* Open */}
                    <Button
                        variant="outline"
                        size="icon"
                        className="shrink-0 cursor-pointer"
                        onClick={() =>
                        navigate(
                            `/app/delivery-checklist/${estimate.type
                            .toLowerCase()
                            .replace("_", "-")}/${estimate.id}`,
                        )
                        }
                    >
                        <ChevronRight className="size-4" />
                    </Button>
                    </div>

                    {/* Mobile Progress */}
                    <div className="border-t bg-muted/20 px-5 py-3 sm:hidden">
                    <div className="mb-1.5 flex items-center justify-between">
                        <span className="text-xs font-medium text-muted-foreground">
                        Delivery Progress
                        </span>

                        <span className="text-xs font-semibold">
                        {progress.deliveredItems}/{progress.totalItems}
                        </span>
                    </div>

                    <div className="h-2 overflow-hidden rounded-full bg-muted">
                        <div
                        className="h-full rounded-full bg-primary transition-all"
                        style={{
                            width: `${progress.percentage}%`,
                        }}
                        />
                    </div>
                    </div>
                </CardContent>
                </Card>
            );
            })}
        </div>
      )}
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
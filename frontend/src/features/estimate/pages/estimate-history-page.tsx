import { useEffect, useMemo, useState } from "react";
import {
  Download,
  Eye,
  Pencil,
  Trash2,
  RotateCcw,
  History,
  Copy,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import {
  Card,
  CardContent,
} from "@/components/ui/card";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import type { SavedCustomEstimate, SavedEstimate, SavedRoundSizeEstimate } from "../types";

import {
  getSavedEstimates,
  deleteEstimate,
  getSavedRoundEstimates,
  deleteRoundEstimate,
  getSavedCustomEstimates,
  deleteCustomEstimate,
  saveEstimate,
  saveRoundEstimate,
  saveCustomEstimate,
} from "../services/estimate-storage";

import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/features/auth/auth-context";
import { generateEstimateNumber } from "../utils/estimate-number";
import { getTodayDate } from "../utils/date";

type EstimateUnion =
  | ({ kind: "CUT" } & SavedEstimate)
  | ({ kind: "ROUND" } & SavedRoundSizeEstimate)
  | ({ kind: "CUSTOM" } & SavedCustomEstimate);

export function EstimateHistoryPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [estimates, setEstimates] =
    useState<EstimateUnion[]>([]);

  const [search, setSearch] =
    useState("");

  const [fromDate, setFromDate] =
    useState("");

  const [toDate, setToDate] =
    useState("");

  const [status, setStatus] =
    useState<
      "ALL" | "ON_HOLD" | "CONFIRMED"
    >("ALL");

  useEffect(() => {
    if (!user?.accountId) {
      setEstimates([]);
      return;
    }

    const cut: EstimateUnion[] =
      getSavedEstimates(user.accountId).map(
        (e) => ({
          ...e,
          kind: "CUT" as const,
        }),
      );

    const round: EstimateUnion[] =
      getSavedRoundEstimates(user.accountId).map(
        (e) => ({
          ...e,
          kind: "ROUND" as const,
        }),
      );

    const custom: EstimateUnion[] =
      getSavedCustomEstimates(user.accountId).map(
        (e) => ({
          ...e,
          kind: "CUSTOM" as const,
        }),
      );

    const allEstimates = [
      ...cut,
      ...round,
      ...custom,
    ];

    allEstimates.sort(
      (a, b) =>
        new Date(b.createdAt).getTime() -
        new Date(a.createdAt).getTime(),
    );

    setEstimates(allEstimates);
  }, [user?.accountId]);

  const filteredEstimates =
    useMemo(() => {
      const searchValue =
        search
          .trim()
          .toLowerCase();

      return estimates.filter(
        (estimate) => {
          /*
           * SEARCH
           */
          const matchesSearch =
            !searchValue ||
            estimate.partyName
              .toLowerCase()
              .includes(searchValue) ||
            estimate.estimateNumber
              .toLowerCase()
              .includes(searchValue) ||
            estimate.reference
              .toLowerCase()
              .includes(searchValue);

          /*
           * STATUS
           */
          const matchesStatus =
            status === "ALL" ||
            estimate.status === status;

          /*
           * FROM DATE
           */
          const matchesFromDate =
            !fromDate ||
            estimate.date >= fromDate;

          /*
           * TO DATE
           */
          const matchesToDate =
            !toDate ||
            estimate.date <= toDate;

          return (
            matchesSearch &&
            matchesStatus &&
            matchesFromDate &&
            matchesToDate
          );
        },
      ).sort(
          (a, b) =>
            new Date(b.createdAt).getTime() -
            new Date(a.createdAt).getTime(),
        );
    }, [
      estimates,
      search,
      fromDate,
      toDate,
      status,
    ]);

  function resetFilters() {
    setSearch("");
    setFromDate("");
    setToDate("");
    setStatus("ALL");
  }

  function handleDelete(
    estimate: EstimateUnion,
  ) {
    const confirmed =
      window.confirm(
        `Delete ${estimate.estimateNumber}?`,
      );

    if (!confirmed) {
      return;
    }

    if (!user?.accountId) {
  toast.error("Unable to identify the current account.");
  return;
}

  if (estimate.kind === "CUT") {
    deleteEstimate(
      user.accountId,
      estimate.id,
    );
  } else if (estimate.kind === "ROUND") {
    deleteRoundEstimate(
      user.accountId,
      estimate.id,
    );
  } else {
    deleteCustomEstimate(
      user.accountId,
      estimate.id,
    );
  }

    setEstimates(
      (current) =>
        current.filter(
          (item) =>
            item.id !==
            estimate.id,
        ),
    );

    toast.success(
      "Estimate deleted successfully.",
    );
  }

  function handleCopy(
    estimate: EstimateUnion,
  ) {
    if (estimate.kind === "CUT") {
    const copiedEstimate: SavedEstimate = {
      ...estimate,

      id: crypto.randomUUID(),
      estimateNumber: generateEstimateNumber(),
      date: getTodayDate(),

      status: "ON_HOLD",

      createdBy: user?.name ?? estimate.createdBy,

      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    saveEstimate(
      estimate.accountId,
      copiedEstimate,
    );

    setEstimates((current) => [
      {
        ...copiedEstimate,
        kind: "CUT",
      },
      ...current,
    ]);
  } else if (estimate.kind === "ROUND") {
    const copiedEstimate: SavedRoundSizeEstimate = {
      ...estimate,

      id: crypto.randomUUID(),
      estimateNumber: generateEstimateNumber(),
      date: getTodayDate(),

      status: "ON_HOLD",

      createdBy: user?.name ?? estimate.createdBy,

      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    saveRoundEstimate(
      estimate.accountId,
      copiedEstimate,
    );

    setEstimates((current) => [
      {
        ...copiedEstimate,
        kind: "ROUND",
      },
      ...current,
    ]);
  } else {
    const copiedEstimate: SavedCustomEstimate = {
      ...estimate,

      id: crypto.randomUUID(),
      estimateNumber: generateEstimateNumber(),
      date: getTodayDate(),

      status: "ON_HOLD",

      createdBy: user?.name ?? estimate.createdBy,

      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    saveCustomEstimate(
      estimate.accountId,
      copiedEstimate,
    );

    setEstimates((current) => [
      {
        ...copiedEstimate,
        kind: "CUSTOM",
      },
      ...current,
    ]);
  }

    toast.success(
      "Estimate copied successfully.",
    );
  }

  return (
    <div className="space-y-6">

      {/* PAGE HEADER */}

      <div>
        <h1 className="text-2xl font-semibold tracking-tight flex items-center gap-2 text-wood-secondary">
          <History />Estimate History
        </h1>

        <p className="mt-1 text-sm text-muted-foreground">
          Search, manage and review
          your estimates.
        </p>
      </div>

      {/* FILTERS */}

      <Card>
        <CardContent className="pt-2">

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">

            {/* SEARCH */}

            <div className="lg:col-span-2">
              <label className="mb-1.5 block text-sm font-medium text-muted-foreground">
              Search
              </label>
              <Input
                placeholder="Search party name or Est No or reference..."
                value={search}
                onChange={(event) =>
                  setSearch(
                    event.target.value,
                  )
                }
                className="h-10 w-full rounded-md border bg-background px-3 text-sm outline-none focus:ring-2 focus:ring-ring"
              />
            </div>

            {/* FROM */}

            <div>
              <label className="mb-1.5 block text-sm font-medium text-muted-foreground">From</label>

              <Input
                type="date"
                value={fromDate}
                onChange={(event) =>
                  setFromDate(
                    event.target.value,
                  )
                }
                className="h-10 w-full rounded-md border bg-background px-3 text-sm outline-none transition-colors focus:border-primary focus:ring-1 focus:ring-primary"
              />
            </div>

            {/* TO */}

            <div>
              <label className="mb-1.5 block text-sm font-medium text-muted-foreground">To</label>

              <Input
                type="date"
                value={toDate}
                onChange={(event) =>
                  setToDate(
                    event.target.value,
                  )
                }
                className="h-10 w-full rounded-md border bg-background px-3 text-sm outline-none transition-colors focus:border-primary focus:ring-1 focus:ring-primary"
              />
            </div>

            {/* STATUS */}
            <div>
              <label className="mb-1.5 block text-sm font-medium text-muted-foreground">
                Status
              </label>
              <Select
                value={status}
                onValueChange={(value) =>
                  setStatus(
                    value as
                      | "ALL"
                      | "ON_HOLD"
                      | "CONFIRMED",
                  )
                }
              >
                <SelectTrigger className="bg-background">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>

                <SelectContent>
                  <SelectItem value="ALL">
                    All
                  </SelectItem>

                  <SelectItem value="ON_HOLD">
                    On Hold
                  </SelectItem>

                  <SelectItem value="CONFIRMED">
                    Confirmed
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

          </div>

          {/* FILTER ACTIONS */}

          <div className="mt-4 flex justify-between items-center gap-2">
            {/* Result count */}
            <div className="text-xs text-muted-foreground">
              Showing{" "}
              <span className="font-medium text-foreground">
                  {filteredEstimates.length}
              </span>{" "}
              of{" "}
              <span className="font-medium text-foreground">
                  {estimates.length}
              </span>{" "}
              estimates
            </div>

            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={
                  resetFilters
                }
                >
                <RotateCcw className="mr-2 size-4" />
                Reset
              </Button>

              <Button
                variant="outline"
                >
                <Download className="mr-2 size-4" />
                Export
              </Button>
            </div>
          </div>

        </CardContent>
      </Card>

      {/* TABLE */}

      <Card>
        <CardContent className="p-0">

          <div className="overflow-x-auto">

            <table className="w-full text-sm">

              <thead className="border-b bg-muted/50">

                <tr>

                  <th className="px-4 py-3 text-left font-medium">
                    Party
                  </th>
                  
                  <th className="px-4 py-3 text-left font-medium">
                    Est No.
                  </th>

                  <th className="px-4 py-3 text-left font-medium">
                    Created By
                  </th>

                  <th className="px-4 py-3 text-left font-medium">
                    Date
                  </th>

                  <th className="px-4 py-3 text-left font-medium">
                    Status
                  </th>

                  <th className="px-4 py-3 text-left font-medium">
                    Type
                  </th>

                  <th className="px-4 py-3 text-right font-medium">
                    Grand Total
                  </th>

                  <th className="px-4 py-3 text-right font-medium">
                    Balance
                  </th>

                  <th className="px-4 py-3 text-center font-medium">
                    Actions
                  </th>

                </tr>

              </thead>

              <tbody className="divide-y">

                {filteredEstimates.map(
                  (estimate) => (
                    <tr
                      key={
                        estimate.id
                      }
                      className="hover:bg-muted/30"
                    >
                      <td className="px-4 py-3 max-w-60">
                        {
                          `${estimate.partyName}${
                              estimate.reference.trim()
                                ? ` (${estimate.reference})`
                                : ""
                            }` || "—"
                        }
                      </td>

                      <td className="px-4 py-3 font-medium">
                        {
                          estimate.estimateNumber
                        }
                      </td>

                      <td className="px-4 py-3">
                        {estimate.createdBy}
                      </td>

                      <td className="px-4 py-3">
                        {estimate.date}
                      </td>

                      <td className="px-4 py-3">
                        <Badge
                          variant={
                            estimate.status ===
                            "CONFIRMED"
                              ? "success"
                              : "warning"
                          }
                          className="font-semibold"
                        >
                          {estimate.status ===
                          "CONFIRMED"
                            ? "Confirmed"
                            : "On Hold"}
                        </Badge>
                      </td>

                      <td className="px-4 py-3">
                        {estimate.type ===
                        "CUT_SIZE"
                          ? "Cut Size"
                          : estimate.type ===
                        "ROUND_SIZE"
                          ? "Round Size"
                          : "Custom"}
                      </td>

                      <td className="px-4 py-3 text-right font-medium">
                        ₹{" "}
                        {estimate.totals.grandTotal.toFixed(
                          2,
                        )}
                      </td>

                      <td className="px-4 py-3 text-right">
                        ₹{" "}
                        {estimate.totals.balanceDue.toFixed(
                          2,
                        )}
                      </td>

                      <td className="px-4 py-3">

                        <div className="flex justify-end gap-1">

                          <Button
                            size="icon"
                            variant="ghost"
                            title="Preview"
                            onClick={() =>
                              navigate(
                                estimate.kind === "CUT"
                                ? `/app/estimates/preview-cut-size/${estimate.id}`
                                : estimate.kind === "ROUND" 
                                ? `/app/estimates/preview-round-size/${estimate.id}`
                                : `/app/estimates/preview-custom-estimate/${estimate.id}`
                              )
                            }
                          >
                            <Eye className="size-4" />
                          </Button>

                          <Button
                            size="icon"
                            variant="ghost"
                            title="Edit"
                            onClick={() =>
                              navigate(
                                estimate.kind === "CUT"
                                ? `/app/estimates/edit-cut-size/${estimate.id}`
                                : estimate.kind === "ROUND" 
                                ? `/app/estimates/edit-round-size/${estimate.id}`
                                : `/app/estimates/edit-custom-estimate/${estimate.id}`
                              )
                            }
                          >
                            <Pencil className="size-4" />
                          </Button>

                          <Button
                            size="icon"
                            variant="ghost"
                            title="Copy"
                            onClick={() =>
                              handleCopy(
                                estimate,
                              )
                            }
                          >
                            <Copy className="size-4" />
                          </Button>

                          <Button
                            size="icon"
                            variant="ghost"
                            title="Delete"
                            onClick={() =>
                              handleDelete(
                                estimate,
                              )
                            }
                          >
                            <Trash2 className="size-4 text-destructive" />
                          </Button>

                        </div>

                      </td>

                    </tr>
                  ),
                )}

              </tbody>

            </table>

            {/* EMPTY STATE */}

            {filteredEstimates.length ===
              0 && (
              <div className="flex min-h-48 items-center justify-center p-6 text-sm text-muted-foreground">
                No estimates found.
              </div>
            )}

          </div>

        </CardContent>
      </Card>

    </div>
  );
}
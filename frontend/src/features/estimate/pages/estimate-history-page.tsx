import { useEffect, useMemo, useState } from "react";
import {
  Download,
  Eye,
  Pencil,
  Trash2,
  RotateCcw,
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

import type { SavedEstimate, SavedRoundSizeEstimate } from "../types";

import {
  getSavedEstimates,
  deleteEstimate,
  getSavedRoundEstimates,
  deleteRoundEstimate,
} from "../services/estimate-storage";

import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { Badge } from "@/components/ui/badge";

type EstimateUnion =
  | ({ kind: "CUT" } & SavedEstimate)
  | ({ kind: "ROUND" } & SavedRoundSizeEstimate)

export function EstimateHistoryPage() {

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
    const cut: EstimateUnion[] = getSavedEstimates().map(
      (e) => ({ ...e, kind: "CUT" as const })
    );
    const round: EstimateUnion[] = getSavedRoundEstimates().map(
      (e) => ({ ...e, kind: "ROUND" as const })
    );
    setEstimates([...cut, ...round]);
  }, []);

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

    if (estimate.kind === "CUT") {
      deleteEstimate(estimate.id);
    } else {
      deleteRoundEstimate(estimate.id);
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

  // function handleCopy(
  //   estimate: SavedEstimate,
  // ) {
  //   const copiedEstimate: SavedEstimate = {
  //     ...estimate,

  //     id: crypto.randomUUID(),

  //     estimateNumber:
  //       `${estimate.estimateNumber}-COPY`,

  //     status: "ON_HOLD",

  //     createdAt:
  //       new Date().toISOString(),

  //     updatedAt:
  //       new Date().toISOString(),
  //   };

  //   saveEstimate(
  //     copiedEstimate,
  //   );

  //   setEstimates(
  //     (current) => [
  //       copiedEstimate,
  //       ...current,
  //     ],
  //   );

  //   toast.success(
  //     "Estimate copied successfully.",
  //   );
  // }

  return (
    <div className="space-y-6">

      {/* PAGE HEADER */}

      <div>
        <h1 className="text-2xl font-semibold tracking-tight">
          Estimate History
        </h1>

        <p className="mt-1 text-sm text-muted-foreground">
          Search, manage and review
          your estimates.
        </p>
      </div>

      {/* FILTERS */}

      <Card>
        <CardContent className="pt-6">

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">

            {/* SEARCH */}

            <div className="lg:col-span-2">
              <Input
                placeholder="Search party name or estimate number..."
                value={search}
                onChange={(event) =>
                  setSearch(
                    event.target.value,
                  )
                }
              />
            </div>

            {/* FROM */}

            <div className="relative flex items-center gap-2">
              <label className="text-md ">From</label>

              <Input
                type="date"
                value={fromDate}
                onChange={(event) =>
                  setFromDate(
                    event.target.value,
                  )
                }
                className="pl-9"
              />
            </div>

            {/* TO */}

            <div className="relative flex items-center gap-2">
              <label className="text-md ">To</label>

              <Input
                type="date"
                value={toDate}
                onChange={(event) =>
                  setToDate(
                    event.target.value,
                  )
                }
                className="pl-9"
              />
            </div>

            {/* STATUS */}
            <div className="relative flex items-center gap-2">
              <label className="text-md ">Status</label>
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
                <SelectTrigger>
                  <SelectValue placeholder="Status" />
                </SelectTrigger>

                <SelectContent>
                  <SelectItem value="ALL">
                    All Status
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

          <div className="mt-4 flex flex-wrap justify-end gap-2">

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
                    Estimate No.
                  </th>

                  <th className="px-4 py-3 text-left font-medium">
                    Date
                  </th>

                  <th className="px-4 py-3 text-left font-medium">
                    Party
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

                  <th className="px-4 py-3 text-right font-medium">
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

                      <td className="px-4 py-3 font-medium">
                        {
                          estimate.estimateNumber
                        }
                      </td>

                      <td className="px-4 py-3">
                        {estimate.date}
                      </td>

                      <td className="px-4 py-3">
                        {
                          `${estimate.partyName}${
                              estimate.reference.trim()
                                ? ` (${estimate.reference})`
                                : ""
                            }` || "—"
                        }
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
                          : "Round Size"}
                      </td>

                      <td className="px-4 py-3 text-right font-medium">
                        ₹
                        {estimate.totals.grandTotal.toFixed(
                          2,
                        )}
                      </td>

                      <td className="px-4 py-3 text-right">
                        ₹
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
                                : `/app/estimates/preview-round-size/${estimate.id}`
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
                                : `/app/estimates/edit-round-size/${estimate.id}`
                              )
                            }
                          >
                            <Pencil className="size-4" />
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
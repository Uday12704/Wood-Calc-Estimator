import {
  ArrowUpRight,
  FileText,
} from "lucide-react";

import { Link } from "react-router-dom";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { Badge } from "@/components/ui/badge";

import type { RecentEstimate } from "../types";
import { formatCurrency, formatDate } from "@/lib/formatters";

interface RecentEstimatesProps {
  estimates: RecentEstimate[];
}

export function RecentEstimates({
  estimates,
}: RecentEstimatesProps) {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">

          <div>
            <CardTitle>
              Recent Estimates
            </CardTitle>

            <p className="mt-1 text-sm text-muted-foreground">
              Your latest estimates
            </p>
          </div>

          <Link
            to="/app/estimates/history"
            className="flex items-center gap-1 text-sm font-medium text-primary hover:underline"
          >
            View all

            <ArrowUpRight className="size-4" />
          </Link>

        </div>
      </CardHeader>

      <CardContent>

        <div className="space-y-1">

          {estimates.map((estimate) => (
            <div
              key={estimate.id}
              className="flex items-center gap-4 rounded-lg p-3 transition-colors hover:bg-muted/50"
            >

              {/* ICON */}

              <div className="hidden size-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 sm:flex">
                <FileText className="size-5 text-primary" />
              </div>


              {/* ESTIMATE DETAILS */}

              <div className="min-w-0 flex-1">

                <div className="flex items-center gap-2">

                  <p className="truncate text-sm font-medium">
                    {estimate.estimateNumber}
                  </p>

                  <Badge
                    variant={
                      estimate.status === "confirmed"
                        ? "default"
                        : "warning"
                    }
                    className={estimate.status === "confirmed"? "bg-green-200/20 text-green-400 hidden sm:inline-flex": "warning hidden sm:inline-flex"}
                  >
                    {estimate.status === "confirmed"
                      ? "Confirmed"
                      : "On Hold"}
                  </Badge>

                </div>

                <p className="truncate text-xs text-muted-foreground">
                  {estimate.partyName}
                </p>

                <p className="mt-1 text-xs text-muted-foreground">
                  {formatDate(estimate.date)}
                </p>

              </div>


              {/* AMOUNT */}

              <div className="text-right">

                <p className="text-sm font-semibold">
                  {formatCurrency(
                    estimate.grandTotal,
                  )}
                </p>

                <p className="text-xs text-muted-foreground">
                  Balance{" "}
                  {formatCurrency(
                    estimate.balanceDue,
                  )}
                </p>

              </div>

            </div>
          ))}

        </div>

      </CardContent>
    </Card>
  );
}
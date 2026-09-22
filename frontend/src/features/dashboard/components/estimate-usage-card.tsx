
import { useEffect, useState } from "react";
import { FileText } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getEstimateUsage } from "@/features/subscription/subscription-usage-storage";

interface EstimateUsageCardProps {
  accountId: string;
  periodStartDate: string;
}

export function EstimateUsageCard({
  accountId,
  periodStartDate,
}: EstimateUsageCardProps) {
  const [used, setUsed] = useState(0);
  const [limit, setLimit] = useState(2000);

  useEffect(() => {
    if (!accountId || !periodStartDate) return;

    const usage = getEstimateUsage(accountId, periodStartDate);

    setUsed(usage.used);
    setLimit(usage.limit);
  }, [accountId, periodStartDate]);

  const remaining = Math.max(0, limit - used);

  const usagePercentage =
    limit > 0 ? Math.min(100, (used / limit) * 100) : 0;

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
        <CardTitle className="text-base font-semibold">
          Estimate Usage
        </CardTitle>

        <div className="flex size-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
          <FileText className="size-5" />
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        <div>
          <p className="text-3xl font-bold">
            {used.toLocaleString("en-IN")}
            <span className="text-base font-normal text-muted-foreground">
              {" "}/ {limit.toLocaleString("en-IN")}
            </span>
          </p>

          <p className="mt-1 text-sm text-muted-foreground">
            Estimates used in this subscription period
          </p>
        </div>

        <div className="h-2 w-full overflow-hidden rounded-full bg-gray-300">
          <div
            className="h-full rounded-full bg-gradient-to-r from-[#e62314] to-[#f19e18] transition-all"
            style={{ width: `${usagePercentage}%` }}
          />
        </div>

        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">
            {usagePercentage.toFixed(2)}% used
          </span>

          <span className="font-medium">
            {remaining.toLocaleString("en-IN")} remaining
          </span>
        </div>

        {remaining === 0 && (
          <p className="text-sm font-medium text-destructive">
            Your estimate limit has been reached.
          </p>
        )}
      </CardContent>
    </Card>
  );
}
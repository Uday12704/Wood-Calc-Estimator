import {
  Calculator,
  CircleDollarSign,
  ClipboardList,
  CreditCard,
  FileText,
  Wallet,
} from "lucide-react";

import { StatsCard } from "./components/stats-card";
import { SubscriptionCard } from "./components/subscription-card";
import { SalesOverview } from "./components/sales-overview";
import { RecentEstimates } from "./components/recent-estimates";

import {
  mockDashboardStats,
  mockRecentEstimates,
  mockSalesData,
} from "./types";

import { formatCurrency } from "@/lib/formatters";

export function DashboardPage() {
  const stats = mockDashboardStats;

  return (
    <div className="space-y-6">

      {/* PAGE HEADER */}
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">
          Dashboard
        </h1>

        <p className="text-sm text-muted-foreground">
          Overview of your estimates, sales and subscription.
        </p>
      </div>

      {/* STATISTICS */}

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">

        <StatsCard
          title="Total Estimates"
          value={stats.totalEstimates.toLocaleString("en-IN")}
          icon={FileText}
          description="All estimates created"
        />

        <StatsCard
          title="Cut-Size Estimates"
          value={stats.totalCutSizeEstimates.toLocaleString("en-IN")}
          icon={Calculator}
          description="Cut-size estimates"
        />

        <StatsCard
          title="Round-Size Estimates"
          value={stats.totalRoundSizeEstimates.toLocaleString("en-IN")}
          icon={ClipboardList}
          description="Round-size estimates"
        />

        <StatsCard
          title="Total Sales"
          value={formatCurrency(stats.totalSales)}
          icon={CircleDollarSign}
          description="Confirmed estimates only"
        />

        <StatsCard
          title="Advance Received"
          value={formatCurrency(
            stats.totalAdvanceReceived,
          )}
          icon={CreditCard}
          description="Total advance received"
        />

        <StatsCard
          title="Pending Balance"
          value={formatCurrency(
            stats.pendingBalance,
          )}
          icon={Wallet}
          description="Outstanding amount"
        />

      </div>

      {/* CHART + SUBSCRIPTION */}

      <div className="grid gap-4 lg:grid-cols-3">

        {/* SALES */}
        <div className="lg:col-span-2">
          <SalesOverview
            data={mockSalesData}
          />
        </div>

        {/* SUBSCRIPTION */}
        <div>
          <SubscriptionCard
            expiryDate={
              stats.subscriptionExpiryDate
            }
            status={
              stats.subscriptionStatus
            }
          />
        </div>

      </div>

      {/* RECENT ESTIMATES */}
      <RecentEstimates
        estimates={mockRecentEstimates}
      />

    </div>
  );
}
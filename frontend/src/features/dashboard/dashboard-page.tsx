import {
  Calculator,
  CircleDollarSign,
  ClipboardList,
  CreditCard,
  FileText,
  Wallet,
} from "lucide-react";

import { mockDashboardStats } from "./types";
import { StatsCard } from "./components/stats-card";

export function DashboardPage() {
  const stats = mockDashboardStats;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">
          Dashboard
        </h1>

        <p className="text-sm text-muted-foreground">
          Overview of your estimates, sales and subscription.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
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
          value={`₹${stats.totalSales.toLocaleString("en-IN")}`}
          icon={CircleDollarSign}
          description="Confirmed estimates only"
        />

        <StatsCard
          title="Advance Received"
          value={`₹${stats.totalAdvanceReceived.toLocaleString("en-IN")}`}
          icon={CreditCard}
          description="Total advance received"
        />

        <StatsCard
          title="Pending Balance"
          value={`₹${stats.pendingBalance.toLocaleString("en-IN")}`}
          icon={Wallet}
          description="Outstanding amount"
        />
      </div>
    </div>
  );
}
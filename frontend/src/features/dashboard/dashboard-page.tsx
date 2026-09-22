import {
  ArrowRight,
  Calculator,
  CircleDollarSign,
  ClipboardList,
  CreditCard,
  FileText,
  Plus,
  Wallet,
} from "lucide-react";

import { StatsCard } from "./components/stats-card";
import { SubscriptionCard } from "./components/subscription-card";
import { SalesOverview } from "./components/sales-overview";
import { RecentEstimates } from "./components/recent-estimates";

import { formatCurrency } from "@/lib/formatters";
import { useAuth } from "@/features/auth/auth-context";

import { getSavedCustomEstimates, getSavedEstimates, getSavedRoundEstimates } from "../estimate/services/estimate-storage";
import { getDashboardStats, getRecentEstimates, getSalesData } from "./dashboard-utils";
import { initializeSubscription } from "../subscription/subscription-seed";
import { useEffect, useState } from "react";
import { checkSubscriptionExpiryNotification, checkWeeklyOnHoldEstimateNotification } from "../notifications/notification-utils";
import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { calculateSubscriptionStatus, getSubscription } from "../subscription/subscription-storage";
import { EstimateUsageCard } from "./components/estimate-usage-card";

export function DashboardPage() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const accountId = user?.accountId ?? "";

  const [subscription, setSubscription] =
    useState<
      ReturnType<typeof getSubscription>
    >(null);

  useEffect(() => {
    if (!accountId) {
      return;
    }

    initializeSubscription(accountId);

    const currentSubscription =
      getSubscription(accountId);

    setSubscription(currentSubscription);
  }, [accountId]);

  useEffect(() => {
    if (!accountId || !subscription) {
      return;
    }

    checkSubscriptionExpiryNotification(
      accountId,
      subscription.expiryDate,
    );
  }, [
    accountId,
    subscription?.expiryDate,
  ]);

  useEffect(() => {
    if (!accountId) {
      return;
    }

    checkWeeklyOnHoldEstimateNotification(
      accountId,
    );
  }, [accountId]);

  if (!user) {
    return null;
  }

  if (!subscription) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">
            Dashboard
          </h1>

          <p className="text-sm text-muted-foreground">
            Overview of your estimates, sales and
            subscription.
          </p>
        </div>

        <div className="rounded-lg border p-6">
          <p className="font-medium">
            Subscription information unavailable
          </p>

          <p className="mt-1 text-sm text-muted-foreground">
            No subscription has been configured for
            this account.
          </p>
        </div>
      </div>
    );
  }

  const cutEstimates =
    getSavedEstimates(accountId);

  const roundEstimates =
    getSavedRoundEstimates(accountId);

  const customEstimates =
    getSavedCustomEstimates(accountId);

  const allEstimates = [
    ...cutEstimates,
    ...roundEstimates,
    ...customEstimates,
  ];
  const subscriptionStatus =
    calculateSubscriptionStatus(
      subscription.expiryDate,
    );

  const stats = getDashboardStats(
    allEstimates,
    subscription.expiryDate,
    subscriptionStatus,
  );

  const recentEstimates =
    getRecentEstimates(allEstimates);

  const salesData =
    getSalesData(allEstimates);

  return (
    <div className="space-y-6">
      {/* PAGE HEADER */}

      <div className="space-y-1">
        <span className="text-3xl font-bold bg-gradient-to-r from-[#e62314] to-[#f19e18] bg-clip-text text-transparent">
          Hello, {user?.name || "there"}!
        </span>


        <p className="text-sm text-muted-foreground">
          Welcome back. Here's what's happening with your business today.
        </p>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card
          className="group cursor-pointer border-dashed transition-all hover:border-primary hover:shadow-md"
          onClick={() => navigate("/app/estimates/new")}
          >
          <CardContent className="flex items-center gap-4 p-5">
            <div className="flex size-12 items-center justify-center rounded-xl bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
              <Plus className="size-6" />
            </div>

            <div className="flex-1">
              <h3 className="font-semibold">Create New Estimate</h3>
              <p className="mt-1 text-sm text-muted-foreground">
                Start a cut-size, round-size, or custom estimate.
              </p>
            </div>

            <ArrowRight className="size-5 text-muted-foreground transition-transform group-hover:translate-x-1" />
          </CardContent>
        </Card>

        {/* ESTIMATE USAGE */}
        <div>
          <EstimateUsageCard
            accountId={accountId}
            periodStartDate={subscription.startDate}
            />
        </div>
      </div>

      {/* STATISTICS */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatsCard
          title="Total Estimates"
          value={stats.totalEstimates.toLocaleString(
            "en-IN",
          )}
          icon={FileText}
          description="All estimates created"
        />

        <StatsCard
          title="Cut-Size Estimates"
          value={stats.totalCutSizeEstimates.toLocaleString(
            "en-IN",
          )}
          icon={Calculator}
          description="Cut-size estimates"
        />

        <StatsCard
          title="Round-Size Estimates"
          value={stats.totalRoundSizeEstimates.toLocaleString(
            "en-IN",
          )}
          icon={ClipboardList}
          description="Round-size estimates"
        />

        <StatsCard
          title="Custom Estimates"
          value={stats.totalCustomEstimates.toLocaleString(
            "en-IN",
          )}
          icon={FileText}
          description="Custom estimates"
        />

        <StatsCard
          title="Total Sales"
          value={formatCurrency(stats.totalSales)}
          icon={CircleDollarSign}
          description="Confirmed estimates only"
        />

        <StatsCard
          title="Advance Received"
          value={formatCurrency(stats.totalAdvanceReceived)}
          icon={CreditCard}
          description="Total advance received"
        />

        <StatsCard
          title="Pending Balance"
          value={formatCurrency(stats.pendingBalance)}
          icon={Wallet}
          description="Outstanding amount"
        />
      </div>

      {/* CHART + SUBSCRIPTION */}
      <div className="grid gap-4 lg:grid-cols-3">
        {/* SALES */}
        <div className="lg:col-span-2">
          <SalesOverview
            data={salesData}
          />
        </div>

        {/* SUBSCRIPTION */}
        <div>
          <SubscriptionCard
            expiryDate={subscription.expiryDate}
            status={subscriptionStatus}
          />
        </div>
      </div>

      {/* RECENT ESTIMATES */}
      <RecentEstimates
        estimates={recentEstimates}
      />
    </div>
  );
}
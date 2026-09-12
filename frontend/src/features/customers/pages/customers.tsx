import { useMemo, useState } from "react";
import { Users, UserRound, ArrowLeft } from "lucide-react";

import { useAuth } from "@/features/auth/auth-context";
import {
  getCustomerSummaries,
  getProfileEstimateSummaries,
} from "@/features/customers/utils/customer-utils";

import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { formatCurrency } from "@/lib/formatters";

type ViewMode = "customers" | "profiles";

export default function Customers() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [viewMode, setViewMode] =
    useState<ViewMode>("customers");

  const [selectedCustomerPhone, setSelectedCustomerPhone] =
    useState<string | null>(null);

  const [selectedProfileId, setSelectedProfileId] =
    useState<string | null>(null);

  const [profileSearch, setProfileSearch] =
    useState("");

  const [profileDateFrom, setProfileDateFrom] =
    useState("");

  const [profileDateTo, setProfileDateTo] =
    useState("");

  const [profileStatus, setProfileStatus] =
    useState<"ALL" | "ON_HOLD" | "CONFIRMED">("ALL");

  const customerSummaries = useMemo(() => {
    if (!user) {
      return [];
    }

    return getCustomerSummaries(user.accountId);
  }, [user]);

  const profileSummaries = useMemo(() => {
    if (!user) {
      return [];
    }

    return getProfileEstimateSummaries(
      user.accountId,
    );
  }, [user]);

  const selectedCustomer = useMemo(() => {
    if (!selectedCustomerPhone) {
        return null;
    }

    return (
        customerSummaries.find(
        (customer) =>
            customer.phone === selectedCustomerPhone,
        ) ?? null
    );
    }, [customerSummaries, selectedCustomerPhone]);

  const selectedProfile = useMemo(() => {
    if (!selectedProfileId) {
        return null;
    }

    return (
        profileSummaries.find(
        (profile) =>
            profile.profileId === selectedProfileId,
        ) ?? null
    );
    }, [profileSummaries, selectedProfileId]);

  if (!user) {
    return null;
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-semibold tracking-tight flex gap-2 items-center text-wood-secondary">
          <Users /> Customers
        </h1>

        <p className="text-sm text-muted-foreground">
          View customer sales and estimates by customer
          or profile.
        </p>
      </div>

      {/* View Switcher */}
      <div className="flex w-fit items-center gap-1 rounded-lg border bg-muted/40 p-1">
        <Button
          type="button"
          variant={
            viewMode === "customers"
              ? "default"
              : "ghost"
          }
          onClick={() => setViewMode("customers")}
          className="gap-2"
        >
          <Users className="h-4 w-4" />
          Customers
        </Button>

        <Button
          type="button"
          variant={
            viewMode === "profiles"
              ? "default"
              : "ghost"
          }
          onClick={() => setViewMode("profiles")}
          className="gap-2"
        >
          <UserRound className="h-4 w-4" />
          Profiles
        </Button>
      </div>

      {/* Customers View */}
      {viewMode === "customers" && (
        <section className="space-y-4">
            {selectedCustomer ? (
            <>
                {/* Back */}
                <Button
                type="button"
                variant="ghost"
                className="gap-2 px-0"
                onClick={() =>
                    setSelectedCustomerPhone(null)
                }
                >
                <ArrowLeft className="h-4 w-4" />
                Back to Customers
                </Button>

                {/* Customer Header */}
                <div>
                <h2 className="text-2xl font-semibold">
                    {selectedCustomer.name ||
                    "Unnamed Customer"}
                </h2>

                <div className="mt-1 space-y-1 text-sm text-muted-foreground">
                    <p>
                    Phone: {selectedCustomer.phone}
                    </p>

                    {selectedCustomer.reference && (
                    <p>
                        Reference:{" "}
                        {selectedCustomer.reference}
                    </p>
                    )}
                </div>
                </div>

                {/* Customer Summary */}
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <div className="rounded-xl border bg-card p-4">
                    <p className="text-sm text-muted-foreground">
                    Estimates
                    </p>

                    <p className="mt-1 text-xl font-semibold">
                    {selectedCustomer.totalEstimates}
                    </p>
                </div>

                <div className="rounded-xl border bg-card p-4">
                    <p className="text-sm text-muted-foreground">
                    Total Sales
                    </p>

                    <p className="mt-1 text-xl font-semibold">
                    {formatCurrency(selectedCustomer.totalSales)}
                    </p>
                </div>

                <div className="rounded-xl border bg-card p-4">
                    <p className="text-sm text-muted-foreground">
                    Advance Paid
                    </p>

                    <p className="mt-1 text-xl font-semibold">
                    {formatCurrency(selectedCustomer.totalAdvancePaid)}
                    </p>
                </div>

                <div className="rounded-xl border bg-card p-4">
                    <p className="text-sm text-muted-foreground">
                    Balance Remaining
                    </p>

                    <p className="mt-1 text-xl font-semibold">
                    {formatCurrency(selectedCustomer.totalBalanceDue)}
                    </p>
                </div>
                </div>

                {/* Customer Estimates */}
                <div className="space-y-3">
                <div>
                    <h3 className="text-lg font-semibold">
                    Estimates
                    </h3>

                    <p className="text-sm text-muted-foreground">
                    All estimates for this customer.
                    </p>
                </div>

                {selectedCustomer.estimates.length ===
                0 ? (
                    <div className="rounded-lg border border-dashed p-8 text-center">
                    <p className="text-sm text-muted-foreground">
                        No estimates found.
                    </p>
                    </div>
                ) : (
                    <div className="space-y-3">
                    {selectedCustomer.estimates.map(
                        (estimate) => (
                        <div
                        key={estimate.id}
                        role="button"
                        tabIndex={0}
                        className="w-full cursor-pointer rounded-xl border bg-card p-4 text-left transition hover:bg-muted/40"
                        onClick={() => {
                            if (estimate.type === "CUT_SIZE") {
                                navigate(
                                    `/app/estimates/preview-cut-size/${estimate.id}`,
                                );
                                return;
                            }

                            if (estimate.type === "ROUND_SIZE") {
                                navigate(
                                    `/app/estimates/preview-round-size/${estimate.id}`,
                                );
                                return;
                            }

                            navigate(
                            `/app/estimates/preview-custom-estimate/${estimate.id}`,
                            );
                        }}
                        onKeyDown={(event) => {
                            if (
                            event.key === "Enter" ||
                            event.key === " "
                            ) {
                                event.preventDefault();
                                event.currentTarget.click();
                            }
                        }}
                        >
                            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                            {/* Estimate Info */}
                            <div className="space-y-1">
                                <div className="flex flex-wrap items-center gap-2">
                                <h4 className="font-semibold">
                                    #
                                    {
                                    estimate.estimateNumber
                                    }
                                </h4>

                                <span className="rounded-full bg-muted px-2 py-0.5 text-xs">
                                    {estimate.type ===
                                    "CUT_SIZE"
                                    ? "Cut Size"
                                    : estimate.type ===
                                        "ROUND_SIZE"
                                        ? "Round Size"
                                        : "Custom"}
                                </span>

                                <span className="rounded-full bg-muted px-2 py-0.5 text-xs">
                                    {estimate.status ===
                                    "CONFIRMED"
                                    ? "Confirmed"
                                    : "On Hold"}
                                </span>
                                </div>

                                <p className="text-sm text-muted-foreground">
                                {estimate.date}
                                </p>

                                <p className="text-sm text-muted-foreground">
                                Created by:{" "}
                                {estimate.profileId}
                                </p>
                            </div>

                            {/* Financial Info */}
                            <div className="grid grid-cols-3 gap-6 text-right">
                                <div>
                                <p className="text-xs text-muted-foreground">
                                    Total
                                </p>

                                <p className="font-semibold">
                                    {formatCurrency(estimate.grandTotal)}
                                </p>
                                </div>

                                <div>
                                <p className="text-xs text-muted-foreground">
                                    Advance
                                </p>

                                <p className="font-semibold">
                                    {formatCurrency(estimate.advancePaid)}
                                </p>
                                </div>

                                <div>
                                <p className="text-xs text-muted-foreground">
                                    Balance
                                </p>

                                <p className="font-semibold">
                                    {formatCurrency(estimate.balanceDue)}
                                </p>
                                </div>
                            </div>
                            </div>
                        </div>
                        ),
                    )}
                    </div>
                )}
                </div>
            </>
            ) : (
            <>
                <div>
                <h2 className="text-lg font-semibold">
                    Customers
                </h2>

                <p className="text-sm text-muted-foreground">
                    Customers are grouped by phone number.
                </p>
                </div>

                {customerSummaries.length === 0 ? (
                <div className="rounded-lg border border-dashed p-8 text-center">
                    <Users className="mx-auto mb-3 h-8 w-8 text-muted-foreground" />

                    <h3 className="font-medium">
                    No customers yet
                    </h3>

                    <p className="mt-1 text-sm text-muted-foreground">
                    Customers will appear here after you
                    create estimates.
                    </p>
                </div>
                ) : (
                <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                    {customerSummaries.map((customer) => (
                    <div
                        key={customer.phone}
                        className="rounded-xl border bg-card p-5 shadow-sm"
                    >
                        <div className="space-y-1">
                        <h3 className="font-semibold">
                            {customer.name ||
                            "Unnamed Customer"}
                        </h3>

                        <p className="text-sm text-muted-foreground">
                            {customer.phone}
                        </p>

                        {customer.reference && (
                            <p className="text-sm text-muted-foreground">
                            Ref: {customer.reference}
                            </p>
                        )}
                        </div>

                        <div className="mt-5 grid grid-cols-3 gap-3">
                        <div>
                            <p className="text-xs text-muted-foreground">
                            Estimates
                            </p>

                            <p className="mt-1 font-semibold">
                            {customer.totalEstimates}
                            </p>
                        </div>

                        <div>
                            <p className="text-xs text-muted-foreground">
                            Sales
                            </p>

                            <p className="mt-1 font-semibold">
                            {formatCurrency(customer.totalSales)}
                            </p>
                        </div>

                        <div>
                            <p className="text-xs text-muted-foreground">
                            Balance
                            </p>

                            <p className="mt-1 font-semibold">
                            {formatCurrency(customer.totalBalanceDue)}
                            </p>
                        </div>
                        </div>

                        <Button
                        type="button"
                        variant="outline"
                        className="mt-5 w-full"
                        onClick={() =>
                            setSelectedCustomerPhone(
                            customer.phone,
                            )
                        }
                        >
                        View Customer
                        </Button>
                    </div>
                    ))}
                </div>
                )}
            </>
            )}
        </section>
        )}

      {/* Profiles View */}
      {viewMode === "profiles" && (
        <section className="space-y-4">
          <div>
            <h2 className="text-lg font-semibold">
              Profiles
            </h2>

            <p className="text-sm text-muted-foreground">
              View estimates created by each profile.
            </p>
          </div>

          {profileSummaries.length === 0 ? (
            <div className="rounded-lg border border-dashed p-8 text-center">
              <UserRound className="mx-auto mb-3 h-8 w-8 text-muted-foreground" />

              <h3 className="font-medium">
                No profile estimates yet
              </h3>

              <p className="mt-1 text-sm text-muted-foreground">
                Profile statistics will appear here
                after estimates are created.
              </p>
            </div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {profileSummaries.map((profile) => (
                <div
                  key={profile.profileId}
                  className="rounded-xl border bg-card p-5 shadow-sm"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-muted">
                      <UserRound className="h-5 w-5" />
                    </div>

                    <div>
                      <h3 className="font-semibold">
                        {profile.profileId}
                      </h3>

                      <p className="text-sm text-muted-foreground">
                        {profile.totalEstimates} estimates
                      </p>
                    </div>
                  </div>

                  <div className="mt-5 grid grid-cols-3 gap-3">
                    <div>
                      <p className="text-xs text-muted-foreground">
                        Cut Size
                      </p>

                      <p className="mt-1 font-semibold">
                        {profile.cutSizeCount}
                      </p>
                    </div>

                    <div>
                      <p className="text-xs text-muted-foreground">
                        Round Size
                      </p>

                      <p className="mt-1 font-semibold">
                        {profile.roundSizeCount}
                      </p>
                    </div>

                    <div>
                      <p className="text-xs text-muted-foreground">
                        Custom
                      </p>

                      <p className="mt-1 font-semibold">
                        {profile.customCount}
                      </p>
                    </div>
                  </div>

                  <div className="mt-4">
                    <p className="text-xs text-muted-foreground">
                      Sales
                    </p>

                    <p className="font-semibold">
                      {formatCurrency(profile.totalSales)}
                    </p>
                  </div>

                  <Button
                    type="button"
                    variant="outline"
                    className="mt-5 w-full"
                  >
                    View Estimates
                  </Button>
                </div>
              ))}
            </div>
          )}
        </section>
      )}
    </div>
  );
}
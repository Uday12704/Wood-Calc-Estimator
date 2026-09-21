
import { useMemo } from "react";
import { CalendarClock, Inbox } from "lucide-react";

import { getAccounts } from "@/features/auth/auth-storage";

import {
  calculateSubscriptionStatus,
  getSubscription,
} from "@/features/subscription/subscription-storage";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { Badge } from "@/components/ui/badge";

export function ExpiringSubscriptions() {
  const subscriptions = useMemo(() => {
    const subscriberAccounts = getAccounts().filter(
      (account) =>
        account.platformRole === "SUBSCRIBER" &&
        account.active,
    );

    return subscriberAccounts
      .map((account) => {
        const subscription = getSubscription(account.id);

        if (!subscription) {
          return null;
        }

        const status = calculateSubscriptionStatus(
          subscription.expiryDate,
        );

        if (status !== "expiring") {
          return null;
        }

        return {
          accountId: account.id,
          email: account.email,
          planName: subscription.planName,
          expiryDate: subscription.expiryDate,
        };
      })
      .filter(
        (
          item,
        ): item is NonNullable<typeof item> => item !== null,
      )
      .sort(
        (a, b) =>
          new Date(a.expiryDate).getTime() -
          new Date(b.expiryDate).getTime(),
      );
  }, []);

  function formatDate(dateString: string) {
    const date = new Date(dateString);

    if (Number.isNaN(date.getTime())) {
      return "Date unavailable";
    }

    return date.toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  }

  function getDaysRemaining(dateString: string) {
    const expiry = new Date(dateString);
    const today = new Date();

    // Compare calendar dates rather than current time of day.
    today.setHours(0, 0, 0, 0);
    expiry.setHours(0, 0, 0, 0);

    return Math.ceil(
      (expiry.getTime() - today.getTime()) /
        (1000 * 60 * 60 * 24),
    );
  }

  return (
    <Card className="rounded-xl">
      <CardHeader>
        <div className="flex items-center gap-2">
          <div className="flex size-10 items-center justify-center rounded-lg bg-amber-100">
            <CalendarClock className="size-5 text-amber-600" />
          </div>

          <div>
            <CardTitle className="text-lg">
              Subscriptions Expiring Soon
            </CardTitle>

            <p className="mt-1 text-sm text-muted-foreground">
              Active subscriber accounts with expiry dates
              within the next 30 days
            </p>
          </div>
        </div>
      </CardHeader>

      <CardContent>
        {subscriptions.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <Inbox className="mb-3 size-8 text-muted-foreground" />

            <p className="font-medium">
              No subscriptions expiring soon
            </p>

            <p className="mt-1 text-sm text-muted-foreground">
              Subscriptions approaching expiry will appear here.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {subscriptions.map((subscription) => {
              const daysRemaining = getDaysRemaining(
                subscription.expiryDate,
              );

              return (
                <div
                  key={subscription.accountId}
                  className="flex flex-col gap-3 rounded-lg border p-4 sm:flex-row sm:items-center sm:justify-between"
                >
                  <div className="min-w-0">
                    <p className="truncate font-medium">
                      {subscription.email}
                    </p>

                    <p className="mt-1 text-sm text-muted-foreground">
                      Plan: {subscription.planName}
                    </p>

                    <p className="mt-1 text-sm text-muted-foreground">
                      Expires: {formatDate(subscription.expiryDate)}
                    </p>
                  </div>

                  <Badge
                    variant="outline"
                    className="w-fit border-amber-500 text-amber-700"
                  >
                    {daysRemaining <= 0
                      ? "Expires today"
                      : `${daysRemaining} day${daysRemaining === 1 ? "" : "s"} left`}
                  </Badge>
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export default ExpiringSubscriptions;
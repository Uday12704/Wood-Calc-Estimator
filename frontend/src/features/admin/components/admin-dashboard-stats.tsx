
import { useMemo } from "react";

import { getAccounts } from "@/features/auth/auth-storage";
import {
  calculateSubscriptionStatus,
  getSubscription,
} from "@/features/subscription/subscription-storage";

import {
  Users,
  CreditCard,
  Clock,
  CircleX,
} from "lucide-react";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export function AdminDashboardStats() {
  const stats = useMemo(() => {
    const subscriberAccounts = getAccounts().filter(
      (account) => account.platformRole === "SUBSCRIBER",
    );

    let activeSubscriptions = 0;
    let expiringSubscriptions = 0;
    let expiredSubscriptions = 0;

    for (const account of subscriberAccounts) {
      const subscription = getSubscription(account.id);

      // A subscriber without a subscription is counted
      // as an account, but not in a subscription status.
      if (!subscription) {
        continue;
      }

      const status = calculateSubscriptionStatus(
        subscription.expiryDate,
      );

      if (status === "active") {
        activeSubscriptions += 1;
      } else if (status === "expiring") {
        expiringSubscriptions += 1;
      } else if (status === "expired") {
        expiredSubscriptions += 1;
      }
    }

    return {
      totalSubscriberAccounts: subscriberAccounts.length,
      activeSubscriptions,
      expiringSubscriptions,
      expiredSubscriptions,
    };
  }, []);

  const cards = [
    {
      title: "Total Subscriber Accounts",
      value: stats.totalSubscriberAccounts,
      description: "All registered subscriber accounts",
      icon: Users,
      iconClass: "text-blue-600",
      iconBgClass: "bg-blue-100",
    },
    {
      title: "Active Subscriptions",
      value: stats.activeSubscriptions,
      description: "Subscriptions currently active",
      icon: CreditCard,
      iconClass: "text-green-600",
      iconBgClass: "bg-green-100",
    },
    {
      title: "Subscriptions Expiring Soon",
      value: stats.expiringSubscriptions,
      description: "Subscriptions expiring within 30 days",
      icon: Clock,
      iconClass: "text-amber-600",
      iconBgClass: "bg-amber-100",
    },
    {
      title: "Expired Subscriptions",
      value: stats.expiredSubscriptions,
      description: "Subscriptions past their expiry date",
      icon: CircleX,
      iconClass: "text-red-600",
      iconBgClass: "bg-red-100",
    },
  ];

  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {cards.map((card) => {
        const Icon = card.icon;

        return (
          <Card key={card.title} className="rounded-xl">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {card.title}
              </CardTitle>

              <div
                className={`flex size-10 items-center justify-center rounded-lg ${card.iconBgClass}`}
              >
                <Icon
                  className={`size-5 ${card.iconClass}`}
                />
              </div>
            </CardHeader>

            <CardContent>
              <div className="text-2xl font-bold">
                {card.value}
              </div>

              <p className="mt-1 text-xs text-muted-foreground">
                {card.description}
              </p>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}

export default AdminDashboardStats;
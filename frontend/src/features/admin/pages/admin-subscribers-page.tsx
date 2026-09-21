
import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Search,
  Users,
  CreditCard,
  CalendarDays,
} from "lucide-react";

import { getAccounts } from "@/features/auth/auth-storage";
import type { SubscriptionAccount } from "@/features/auth/types";

import {
  calculateSubscriptionStatus,
  getDaysRemaining,
  getSubscription,
} from "@/features/subscription/subscription-storage";

import { formatDate } from "@/lib/formatters";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

type SubscriptionStatus = "active" | "expiring" | "expired";

export function AdminSubscribersPage() {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");

  const subscribers = useMemo(() => {
    return getAccounts()
      .filter(
        (account: SubscriptionAccount) =>
          account.platformRole === "SUBSCRIBER",
      )
      .map((account) => {
        const subscription = getSubscription(account.id);

        return {
          account,
          subscription,
          status: subscription
            ? calculateSubscriptionStatus(subscription.expiryDate)
            : null,
        };
      })
      .sort(
        (a, b) =>
          new Date(b.account.createdAt).getTime() -
          new Date(a.account.createdAt).getTime(),
      );
  }, []);

  const filteredSubscribers = subscribers.filter(({ account }) =>
    account.email.toLowerCase().includes(search.toLowerCase().trim()),
  );

  const totalSubscribers = subscribers.length;

  const activeSubscriptions = subscribers.filter(
    ({ status }) => status === "active",
  ).length;

  const expiringOrExpiredSubscriptions = subscribers.filter(
    ({ status }) => status === "expiring" || status === "expired",
  ).length;

  function getSubscriptionStatusVariant(
    status: SubscriptionStatus | null,
  ) {
    if (status === "active") return "success";
    if (status === "expiring") return "destructive";
    if (status === "expired") return "destructive";

    return "secondary";
  }

  return (
    <div className="space-y-6 p-5">
      {/* Page heading */}
      <div className="space-y-1">
        <h1 className="text-2xl font-bold tracking-tight">
          Subscriber Management
        </h1>

        <p className="text-sm text-muted-foreground">
          Manage subscriber accounts, plans, subscription dates, and access.
        </p>
      </div>

      {/* Summary cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total subscribers
            </CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>

          <CardContent>
            <div className="text-2xl font-bold">
              {totalSubscribers}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Active subscriptions
            </CardTitle>
            <CreditCard className="h-4 w-4 text-muted-foreground" />
          </CardHeader>

          <CardContent>
            <div className="text-2xl font-bold">
              {activeSubscriptions}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Expiring / expired
            </CardTitle>
            <CalendarDays className="h-4 w-4 text-muted-foreground" />
          </CardHeader>

          <CardContent>
            <div className="text-2xl font-bold">
              {expiringOrExpiredSubscriptions}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Subscriber table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Subscribers
          </CardTitle>
        </CardHeader>

        <CardContent className="space-y-4">
          {/* Search */}
          <div className="relative max-w-sm">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />

            <Input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search by subscriber email..."
              className="pl-9"
            />
          </div>

          {/* shadcn Table */}
          <div className="overflow-x-auto rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Subscriber</TableHead>
                  <TableHead>Registered</TableHead>
                  <TableHead>Account Status</TableHead>
                  <TableHead>Plan</TableHead>
                  <TableHead>Start Date</TableHead>
                  <TableHead>Expiry Date</TableHead>
                  <TableHead>Days Remaining</TableHead>
                  <TableHead>Subscription Status</TableHead>
                  <TableHead className="text-right">
                    Action
                  </TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {filteredSubscribers.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={8}
                      className="h-24 text-center text-muted-foreground"
                    >
                      No subscribers found.
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredSubscribers.map(
                    ({ account, subscription, status }) => (
                      <TableRow key={account.id}>
                        <TableCell className="font-medium">
                          {account.email}
                        </TableCell>

                        <TableCell>
                          {formatDate(account.createdAt)}
                        </TableCell>

                        <TableCell>
                          <Badge
                            variant={
                              account.active ? "success" : "destructive"
                            }
                          >
                            {account.active ? "Active" : "Inactive"}
                          </Badge>
                        </TableCell>

                        <TableCell>
                          {subscription?.planName ?? "No plan"}
                        </TableCell>

                        <TableCell>
                          {subscription
                            ? formatDate(subscription.startDate)
                            : "—"}
                        </TableCell>

                        <TableCell>
                          {subscription
                            ? formatDate(subscription.expiryDate)
                            : "—"}
                        </TableCell>

                        <TableCell>
                          {subscription
                            ? getDaysRemaining(subscription.expiryDate)
                            : "—"}
                        </TableCell>

                        <TableCell>
                          <Badge
                            variant={getSubscriptionStatusVariant(status)}
                          >
                            {status
                              ? status.toUpperCase()
                              : "NO SUBSCRIPTION"}
                          </Badge>
                        </TableCell>

                        <TableCell className="text-right">
                          <Button
                            size="sm"
                            onClick={() =>
                              navigate(`/admin/subscribers/${account.id}`)
                            }
                          >
                            Manage
                          </Button>
                        </TableCell>
                      </TableRow>
                    ),
                  )
                )}
              </TableBody>
            </Table>
          </div>

          <p className="text-sm text-muted-foreground">
            Showing {filteredSubscribers.length} of {totalSubscribers}{" "}
            subscriber accounts.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}

export default AdminSubscribersPage;
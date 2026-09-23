import { useMemo, useState } from "react";
import { Send, AlertTriangle, CalendarClock, Megaphone, Bell, UserCog } from "lucide-react";
import { toast } from "react-toastify";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

import { getAccounts } from "@/features/auth/auth-storage";
import { getProfiles } from "@/features/auth/auth-storage";
import { getSubscription } from "@/features/subscription/subscription-storage";
import { createNotification, getNotifications } from "@/features/notifications/notification-storage";
import { getEstimateUsage } from "@/features/subscription/subscription-usage-storage";

import type {
  NotificationPriority, Notification
} from "@/features/notifications/types";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";


const ESTIMATE_WARNING_PERCENT = 90;

export function AdminNotificationsPage() {
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const [priority, setPriority] =
    useState<NotificationPriority>("NORMAL");

  // Refresh the page after sending so the admin sees the latest state.
  const [refreshKey, setRefreshKey] = useState(0);

  const activeSubscribers = useMemo(() => {
    const accounts = getAccounts();
    const profiles = getProfiles();

    return accounts
      .filter(
        (account) =>
          account.platformRole === "SUBSCRIBER" &&
          account.active,
      )
      .map((account) => {
        const ownerProfile = profiles.find(
          (profile) =>
            profile.accountId === account.id &&
            profile.role === "OWNER" &&
            profile.active,
        );

        return {
          accountId: account.id,
          email: account.email,
          name: ownerProfile?.name || account.email,
        };
      });
  }, [refreshKey]);

  const expiryAlerts = useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    return activeSubscribers
      .map((subscriber) => {
        const subscription = getSubscription(
          subscriber.accountId,
        );

        if (!subscription) {
          return null;
        }

        const expiry = new Date(
          `${subscription.expiryDate.slice(0, 10)}T00:00:00`,
        );

        if (Number.isNaN(expiry.getTime())) {
          return null;
        }

        const daysRemaining = Math.ceil(
          (expiry.getTime() - today.getTime()) /
            (1000 * 60 * 60 * 24),
        );

        // Include expired subscriptions and subscriptions expiring
        // within the next 30 days.
        if (daysRemaining > 30) {
          return null;
        }

        return {
          ...subscriber,
          expiryDate: subscription.expiryDate,
          daysRemaining,
        };
      })
      .filter((item) => item !== null)
      .sort(
        (a, b) => a.daysRemaining - b.daysRemaining,
      );
  }, [activeSubscribers]);

  const estimateAlerts = useMemo(() => {
    return activeSubscribers
      .map((subscriber) => {
        const subscription = getSubscription(
          subscriber.accountId,
        );

        if (!subscription) {
          return null;
        }

        const usage = getEstimateUsage(
          subscriber.accountId,
          subscription.startDate,
        );

        const percentage =
          usage.limit > 0
            ? (usage.used / usage.limit) * 100
            : usage.used > 0
              ? 100
              : 0;

        if (percentage < ESTIMATE_WARNING_PERCENT) {
          return null;
        }

        return {
          ...subscriber,
          used: usage.used,
          limit: usage.limit,
          remaining: Math.max(
            usage.limit - usage.used,
            0,
          ),
          percentage,
        };
      })
      .filter((item) => item !== null)
      .sort((a, b) => b.percentage - a.percentage);
  }, [activeSubscribers]);

  const sentAnnouncements = useMemo(() => {
    const subscriberAccounts = getAccounts().filter(
        (account) =>
        account.platformRole === "SUBSCRIBER" && account.active
    );

    const announcements: Notification[] = subscriberAccounts.flatMap(
        (account) =>
        getNotifications(account.id).filter(
            (notification) =>
            notification.type === "ANNOUNCEMENT" &&
            notification.createdBy === "ADMIN"
        )
    );

    // Group the per-account copies of the same broadcast.
    const grouped = new Map<
        string,
        {
        notification: Notification;
        recipientIds: Set<string>;
        }
    >();

    for (const notification of announcements) {
        const key = [
        notification.title,
        notification.message,
        notification.createdAt,
        notification.priority,
        ].join("|");

        const existing = grouped.get(key);

        if (existing) {
        if (notification.accountId) {
            existing.recipientIds.add(notification.accountId);
        }
        } else {
        grouped.set(key, {
            notification,
            recipientIds: new Set(
            notification.accountId ? [notification.accountId] : []
            ),
        });
        }
    }

    return Array.from(grouped.values()).sort(
        (a, b) =>
        new Date(b.notification.createdAt).getTime() -
        new Date(a.notification.createdAt).getTime()
    );
    }, []);

  function handleBroadcast() {
    const cleanTitle = title.trim();
    const cleanMessage = message.trim();

    if (!cleanTitle || !cleanMessage) {
      toast.error("Please enter both a title and a message.");
      return;
    }

    if (activeSubscribers.length === 0) {
      toast.error("There are no active subscribers to notify.");
      return;
    }

    try {
      activeSubscribers.forEach((subscriber) => {
        createNotification({
          accountId: subscriber.accountId,
          createdBy: "ADMIN",
          title: cleanTitle,
          message: cleanMessage,
          type: "ANNOUNCEMENT",
          priority,
        });
      });

      toast.success(
        `Announcement sent to ${activeSubscribers.length} subscriber accounts.`,
      );

      setTitle("");
      setMessage("");
      setPriority("NORMAL");
      setRefreshKey((current) => current + 1);
    } catch {
      toast.error("Unable to send the announcement.");
    }
  }

  return (
    <div className="space-y-6 p-4 md:p-6">
      <div>
        <h1 className="text-2xl font-bold">
          Admin Notifications
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Send announcements and review subscriber alerts.
        </p>
      </div>

      {/* BROADCAST ANNOUNCEMENT */}
      <section className="space-y-4 rounded-xl border bg-card p-5">
        <div className="flex items-center gap-2">
          <Send className="size-5 text-primary" />
          <h2 className="text-lg font-semibold">
            Send Announcement
          </h2>
        </div>

        <div className="flex justify-start gap-10">
            <div className="space-y-2 w-[50%]">
                <Label htmlFor="notification-title">
                    Notification title
                </Label>

                <Input
                    id="notification-title"
                    value={title}
                    onChange={(event) => setTitle(event.target.value)}
                    placeholder="Enter notification title"
                    maxLength={120}
                />

                <p className="text-right text-xs text-muted-foreground">
                    {title.length}/120
                </p>
            </div>

            <div className="space-y-2">
                <label className="text-sm font-medium">
                    Priority
                </label>
                <Select
                    value={priority}
                    onValueChange={(value) =>
                    setPriority(value as NotificationPriority)
                    }
                >
                    <SelectTrigger className="w-[160px]">
                    <SelectValue placeholder="Select priority" />
                    </SelectTrigger>

                    <SelectContent>
                    <SelectItem value="LOW">Low</SelectItem>
                    <SelectItem value="NORMAL">Normal</SelectItem>
                    <SelectItem value="HIGH">High</SelectItem>
                    </SelectContent>
                </Select>
            </div>
        </div>

        <div className="space-y-2">
            <Label htmlFor="notification-message">
                Message
            </Label>

            <Textarea
                id="notification-message"
                value={message}
                onChange={(event) => setMessage(event.target.value)}
                placeholder="Write your announcement..."
                rows={5}
                maxLength={3000}
                className="h-20"
            />

            <p className="text-right text-xs text-muted-foreground">
                {message.length}/3000
            </p>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3">
          <p className="text-sm text-muted-foreground">
            Recipients: {activeSubscribers.length} active subscriber
            account(s)
          </p>

          <Button
            type="button"
            onClick={handleBroadcast}
          >
            <Send className="mr-2 size-4" />
            Send to All Subscribers
          </Button>
        </div>
      </section>

      {/* SUBSCRIPTION EXPIRY ALERTS */}
      <section className="space-y-4 rounded-xl border bg-card p-5">
        <div className="flex items-center gap-2">
          <CalendarClock className="size-5 text-amber-600" />
          <h2 className="text-lg font-semibold">
            Subscription Expiry Alerts
          </h2>
          <span className="rounded-full bg-amber-100 px-2 py-0.5 text-xs font-semibold text-amber-800">
            {expiryAlerts.length}
          </span>
        </div>

        <p className="text-sm text-muted-foreground">
          Active subscriber accounts with subscriptions that have
          expired or will expire within 30 days.
        </p>

        {expiryAlerts.length === 0 ? (
          <p className="rounded-lg border border-dashed p-6 text-center text-sm text-muted-foreground">
            No subscription expiry alerts.
          </p>
        ) : (
          <div className="rounded-md border">
            <Table>
                <TableHeader>
                <TableRow>
                    <TableHead>Subscriber</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Expiry date</TableHead>
                    <TableHead>Status</TableHead>
                </TableRow>
                </TableHeader>

                <TableBody>
                {expiryAlerts.map((subscriber) => (
                    <TableRow key={subscriber.accountId}>
                    <TableCell className="font-medium">
                        {subscriber.name}
                    </TableCell>

                    <TableCell>{subscriber.email}</TableCell>

                    <TableCell>{subscriber.expiryDate}</TableCell>

                    <TableCell>
                        {subscriber.daysRemaining < 0 ? (
                        <Badge variant="destructive">Expired</Badge>
                        ) : subscriber.daysRemaining === 0 ? (
                        <Badge variant="destructive">Expires today</Badge>
                        ) : (
                        <Badge variant="outline">
                            {subscriber.daysRemaining} day(s) left
                        </Badge>
                        )}
                    </TableCell>
                    </TableRow>
                ))}
                </TableBody>
            </Table>
            </div>
        )}
      </section>

      {/* ESTIMATE LIMIT ALERTS */}
      <section className="space-y-4 rounded-xl border bg-card p-5">
        <div className="flex items-center gap-2">
          <AlertTriangle className="size-5 text-orange-600" />
          <h2 className="text-lg font-semibold">
            Estimate Limit Alerts
          </h2>
          <span className="rounded-full bg-orange-100 px-2 py-0.5 text-xs font-semibold text-orange-800">
            {estimateAlerts.length}
          </span>
        </div>

        <p className="text-sm text-muted-foreground">
          Subscribers who have used at least{" "}
          {ESTIMATE_WARNING_PERCENT}% of their current estimate limit.
        </p>

        {estimateAlerts.length === 0 ? (
          <p className="rounded-lg border border-dashed p-6 text-center text-sm text-muted-foreground">
            No estimate limit alerts.
          </p>
        ) : (
          <div className="rounded-md border">
            <Table>
                <TableHeader>
                <TableRow>
                    <TableHead>Subscriber</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Used / Limit</TableHead>
                    <TableHead>Remaining</TableHead>
                    <TableHead>Usage</TableHead>
                </TableRow>
                </TableHeader>

                <TableBody>
                {estimateAlerts.map((subscriber) => (
                    <TableRow key={subscriber.accountId}>
                    <TableCell className="font-medium">
                        {subscriber.name}
                    </TableCell>

                    <TableCell>{subscriber.email}</TableCell>

                    <TableCell>
                        {subscriber.used} / {subscriber.limit}
                    </TableCell>

                    <TableCell>{subscriber.remaining}</TableCell>

                    <TableCell>
                        <Badge
                        variant={
                            subscriber.percentage >= 100
                            ? "destructive"
                            : "outline"
                        }
                        >
                        {Math.round(subscriber.percentage)}%
                        </Badge>
                    </TableCell>
                    </TableRow>
                ))}
                </TableBody>
            </Table>
            </div>
        )}
      </section>

      <Card>
        <CardHeader>
            <CardTitle>Sent Announcements</CardTitle>
            <CardDescription>
            Announcements sent by the admin to subscriber accounts.
            </CardDescription>
        </CardHeader>

        <CardContent>
            {sentAnnouncements.length === 0 ? (
            <p className="text-sm text-muted-foreground">
                No announcements have been sent yet.
            </p>
            ) : (
            <div className="space-y-4">
                {sentAnnouncements.map(
                ({ notification, recipientIds }) => (
                    <Card key={notification.id}>
                        <CardContent className="p-5">
                            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                            <div className="flex min-w-0 gap-3">
                                <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-primary/10">
                                {notification.type === "SYSTEM" ? (
                                    <AlertTriangle className="size-5 text-destructive" />
                                ) : notification.type === "ANNOUNCEMENT" ? (
                                    <Megaphone className="size-5 text-blue-500" />
                                ) : notification.type === "SUPPORT" ? (
                                    <UserCog className="size-5" />
                                ) : (
                                    <Bell className="size-5 text-amber-500" />
                                )}
                                </div>

                                <div className="min-w-0 space-y-1">
                                <h3 className="break-words font-semibold">
                                    {notification.title}
                                </h3>

                                <p className="whitespace-pre-wrap break-words text-sm text-muted-foreground">
                                    {notification.message}
                                </p>
                                </div>
                            </div>

                            <div className="flex shrink-0 flex-wrap gap-2">
                                <Badge
                                variant={
                                    notification.priority === "HIGH"
                                    ? "destructive"
                                    : "outline"
                                }
                                >
                                {notification.priority}
                                </Badge>
                            </div>
                            </div>

                            <div className="mt-4 flex flex-wrap gap-x-5 gap-y-2 border-t pt-3 text-xs text-muted-foreground">
                            <span>
                                Sent: {new Date(notification.createdAt).toLocaleString()}
                            </span>

                            <span>
                                Recipients: {recipientIds.size}
                            </span>
                            </div>
                        </CardContent>
                        </Card>
                    )
                )}
            </div>
            )}
        </CardContent>
        </Card>
    </div>
  );
}

export default AdminNotificationsPage;
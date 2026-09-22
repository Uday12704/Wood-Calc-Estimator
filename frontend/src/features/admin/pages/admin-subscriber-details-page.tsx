
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  AlertCircle,
  ArrowLeft,
  CalendarDays,
  CheckCircle2,
  CreditCard,
  Mail,
  Save,
  ShieldCheck,
  UserRound,
} from "lucide-react";
import { toast } from "react-toastify";

import {
  getAccounts,
  saveAccounts,
} from "@/features/auth/auth-storage";
import type { SubscriptionAccount } from "@/features/auth/types";

import type { Subscription } from "@/features/subscription/types";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { formatDate } from "@/lib/formatters";
import { calculateSubscriptionStatus, getDaysRemaining, getSubscription, saveSubscription } from "@/features/subscription/subscription-storage";

export default function AdminSubscriberDetailsPage() {
  const { accountId } = useParams<{ accountId: string }>();
  const navigate = useNavigate();

  const [account, setAccount] = useState<SubscriptionAccount | null>(null);
  const [subscription, setSubscription] = useState<Subscription | null>(null);

  const [planName, setPlanName] = useState("Pro");
  const [startDate, setStartDate] = useState("");
  const [expiryDate, setExpiryDate] = useState("");

  const daysRemaining = getDaysRemaining(expiryDate);

  useEffect(() => {
    if (!accountId) return;

    const foundAccount = getAccounts().find(
      (item) =>
        item.id === accountId &&
        item.platformRole === "SUBSCRIBER"
    );

    if (!foundAccount) {
      setAccount(null);
      setSubscription(null);
      return;
    }

    setAccount(foundAccount);

    const foundSubscription = getSubscription(accountId);
    setSubscription(foundSubscription);

    if (foundSubscription) {
      setPlanName(foundSubscription.planName);
      setStartDate(foundSubscription.startDate);
      setExpiryDate(foundSubscription.expiryDate);
    } else {
      setPlanName("Pro");
      setStartDate("");
      setExpiryDate("");
    }
  }, [accountId]);

  function handleAccountStatusChange(active: boolean) {
    if (!account) return;

    const updatedAccounts = getAccounts().map((item) =>
      item.id === account.id ? { ...item, active } : item
    );

    saveAccounts(updatedAccounts);
    setAccount({ ...account, active });

    toast.success(
      active
        ? "Subscriber account activated."
        : "Subscriber account deactivated."
    );
  }

  function handleSaveSubscription() {
    if (!account) return;

    if (!planName.trim() || !startDate || !expiryDate) {
      toast.error("Please complete all subscription fields.");
      return;
    }

    if (expiryDate < startDate) {
      toast.error("Expiry date cannot be earlier than the start date.");
      return;
    }

    const now = new Date().toISOString();

    saveSubscription(account.id, {
      planName: planName.trim(),
      startDate,
      expiryDate,
      status: calculateSubscriptionStatus(expiryDate),
      createdAt: subscription?.createdAt ?? now,
      updatedAt: now,
    });

    setSubscription(getSubscription(account.id));
    toast.success("Subscription saved successfully.");
  }

  if (!account) {
    return (
      <div className="mx-auto max-w-5xl space-y-4 p-5">
        <Button
          variant="outline"
          onClick={() => navigate("/admin/subscribers")}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to subscribers
        </Button>

        <Card>
          <CardContent className="py-12 text-center">
            <UserRound className="mx-auto mb-3 h-8 w-8 text-muted-foreground" />
            <h2 className="font-semibold">Subscriber not found</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              This subscriber account may have been removed or the URL is
              incorrect.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const subscriptionStatus = subscription
    ? calculateSubscriptionStatus(subscription.expiryDate)
    : null;

  const statusVariant =
    subscriptionStatus === "active" ? "success" : "destructive";

  return (
    <div className="mx-auto w-full max-w-7xl space-y-5 p-4 md:p-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-start gap-3">
          <Button
            variant="outline"
            size="icon"
            className="mt-1 shrink-0"
            onClick={() => navigate("/admin/subscribers")}
            aria-label="Back to subscribers"
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>

          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="text-2xl font-bold tracking-tight">
                Subscriber Details
              </h1>
              <Badge variant={account.active ? "success" : "destructive"}>
                {account.active ? "Active account" : "Inactive account"}
              </Badge>
            </div>
            <p className="mt-1 text-sm text-muted-foreground">
              Manage account access and subscription information.
            </p>
          </div>
        </div>
      </div>

      {/* Compact account summary */}
      <Card>
        <CardContent className="grid gap-4 p-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-muted p-2.5">
              <Mail className="h-5 w-5 text-muted-foreground" />
            </div>
            <div className="min-w-0">
              <p className="text-xs text-muted-foreground">Subscriber email</p>
              <p className="truncate text-sm font-semibold">{account.email}</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-muted p-2.5">
              <CalendarDays className="h-5 w-5 text-muted-foreground" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Registered on</p>
              <p className="text-sm font-semibold">
                {new Date(account.createdAt).toLocaleDateString()}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-muted p-2.5">
              <CreditCard className="h-5 w-5 text-muted-foreground" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Subscription plan</p>
              <p className="text-sm font-semibold">
                {subscription?.planName ?? "No plan assigned"}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-muted p-2.5">
              <ShieldCheck className="h-5 w-5 text-muted-foreground" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Subscription status</p>
              {subscriptionStatus ? (
                <Badge variant={statusVariant}>
                  {subscriptionStatus.toUpperCase()}
                </Badge>
              ) : (
                <Badge variant="outline">Not assigned</Badge>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Main two-column workspace */}
      <div className="grid items-start gap-5 lg:grid-cols-[0.85fr_1.15fr]">
        {/* Account access */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-base text-wood-primary">
              <UserRound className="h-5 w-5" />
              Account Access
            </CardTitle>
          </CardHeader>

          <CardContent className="space-y-5">
            <div className="space-y-1">
              <Label>Email address</Label>
              <div className="rounded-md border bg-muted/30 px-3 py-2.5 text-sm">
                {account.email}
              </div>
              <p className="text-xs text-muted-foreground">
                The subscriber's registered login email.
              </p>
            </div>

            <Separator />

            <div className="flex items-center justify-between gap-4">
              <div className="space-y-1">
                <p className="text-sm font-medium">Account activation</p>
                <p className="text-xs text-muted-foreground">
                  {account.active
                    ? "Account access is enabled."
                    : "Account access is disabled."}
                </p>
              </div>

              <Switch
                checked={account.active}
                onCheckedChange={handleAccountStatusChange}
                aria-label="Toggle subscriber account activation"
              />
            </div>

            <div
              className={`rounded-lg border p-3 ${
                account.active
                  ? "border-green-200 bg-green-50 dark:border-green-900 dark:bg-green-950/30"
                  : "border-amber-200 bg-amber-50 dark:border-amber-900 dark:bg-amber-950/30"
              }`}
            >
              <div>
                <div className="flex items-center gap-2">
                    {account.active ? <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-green-500" /> : <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-yellow-700"/>}
                  <p className="text-sm font-medium">
                    {account.active ? "Account is active" : "Account is inactive"}
                  </p>
                </div>
                  <p className="mt-1 text-xs text-muted-foreground">
                    {account.active
                      ? "The account is marked as active. Subscription validity is managed separately."
                      : "The account is marked as inactive. Reactivate it using the switch above."}
                  </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Subscription editor */}
        <Card>
          <CardHeader className="pb-3">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <CardTitle className="flex items-center gap-2 text-base text-wood-primary">
                <CreditCard className="h-5 w-5" />
                Subscription Management
              </CardTitle>

              {subscriptionStatus && (
                <Badge variant={statusVariant}>
                  {subscriptionStatus.toUpperCase()}
                </Badge>
              )}
            </div>
            <p className="text-sm text-muted-foreground">
              Assign a plan or update the subscriber's validity period.
            </p>
          </CardHeader>

          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="planName">Plan name</Label>
              <Input
                id="planName"
                value={planName}
                onChange={(event) => setPlanName(event.target.value)}
                placeholder="Enter plan name"
              />
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="startDate">Start date</Label>
                <Input
                  id="startDate"
                  type="date"
                  value={startDate}
                  onChange={(event) => setStartDate(event.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="expiryDate">Expiry date</Label>
                <Input
                  id="expiryDate"
                  type="date"
                  value={expiryDate}
                  onChange={(event) => setExpiryDate(event.target.value)}
                />
              </div>
              
              <div className="space-y-2">
                <h1 className="text-lg font-semibold">Days Remaining - {daysRemaining}</h1>
              </div>
            </div>

            <div className="rounded-lg bg-muted/40 p-3">
              <p className="text-xs font-medium text-muted-foreground">
                Subscription preview
              </p>
              <div className="mt-2 flex flex-wrap items-center justify-between gap-2">
                <div>
                  <p className="font-semibold">
                    {planName.trim() || "Unnamed plan"}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {formatDate(startDate) || "Start date not set"}{" "}
                    <span className="mx-1">→</span>
                    {formatDate(expiryDate) || "Expiry date not set"}
                  </p>
                </div>

                {expiryDate && (
                  <Badge variant="outline">
                    {calculateSubscriptionStatus(expiryDate).toUpperCase()}
                  </Badge>
                )}
              </div>
            </div>

            <div className="flex justify-end pt-1">
              <Button onClick={handleSaveSubscription} className="w-full sm:w-auto">
                <Save className="mr-2 h-4 w-4" />
                Save Subscription
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
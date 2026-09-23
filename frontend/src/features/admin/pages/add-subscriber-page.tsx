
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { UserPlus, ArrowLeft } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import {
  getAccounts,
  saveAccounts,
  getProfiles,
  saveProfiles,
} from "@/features/auth/auth-storage";

import type {
  SubscriptionAccount,
  AppProfile,
} from "@/features/auth/types";

import {
  saveSubscription,
} from "@/features/subscription/subscription-storage";

import {
  getEstimateUsage,
  saveEstimateUsage,
} from "@/features/subscription/subscription-usage-storage";

export default function AddSubscriberPage() {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [planName, setPlanName] = useState("Pro");
  const [startDate, setStartDate] = useState(
    new Date().toISOString().slice(0, 10)
  );
  const [expiryDate, setExpiryDate] = useState("");
  const [estimateLimit, setEstimateLimit] = useState("2000");
  const [isSubmitting, setIsSubmitting] = useState(false);

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const cleanName = name.trim();
    const cleanEmail = email.trim().toLowerCase();
    const cleanPassword = password;

    if (!cleanName || !cleanEmail || !cleanPassword) {
      toast.error("Please complete all required fields.");
      return;
    }

    if (cleanPassword.length < 6) {
      toast.error("Password must contain at least 6 characters.");
      return;
    }

    if (!planName.trim()) {
      toast.error("Please enter a subscription plan.");
      return;
    }

    if (!startDate || !expiryDate || expiryDate < startDate) {
      toast.error("Please enter valid subscription dates.");
      return;
    }

    const parsedLimit = Number(estimateLimit);

    if (
      !Number.isInteger(parsedLimit) ||
      parsedLimit < 1
    ) {
      toast.error("Estimate limit must be a positive whole number.");
      return;
    }

    setIsSubmitting(true);

    try {
      const accounts = getAccounts();

      const emailExists = accounts.some(
        (account) =>
          account.email.trim().toLowerCase() === cleanEmail
      );

      if (emailExists) {
        toast.error("An account with this email already exists.");
        return;
      }

      const accountId = crypto.randomUUID();
      const profileId = crypto.randomUUID();
      const now = new Date().toISOString();

      const newAccount: SubscriptionAccount = {
        id: accountId,
        email: cleanEmail,
        password: cleanPassword,
        platformRole: "SUBSCRIBER",
        active: true,
        createdAt: now,
      };

      const newOwnerProfile: AppProfile = {
        id: profileId,
        accountId,
        name: cleanName,
        role: "OWNER",
        active: true,
        createdAt: now,
      };

      const currentAccounts = getAccounts();
      const currentProfiles = getProfiles();

      saveAccounts([...currentAccounts, newAccount]);
      saveProfiles([...currentProfiles, newOwnerProfile]);

      saveSubscription(accountId, {
        planName: planName.trim(),
        startDate,
        expiryDate,
        status: "active",
        createdAt: now,
        updatedAt: now,
      });

      const initialUsage = getEstimateUsage(accountId, startDate);

      saveEstimateUsage({
        ...initialUsage,
        accountId,
        periodStartDate: startDate,
        used: 0,
        limit: parsedLimit,
        lastSequence: 0,
      });

      toast.success("Subscriber account created successfully.");
      navigate("/admin/subscribers");
    } catch (error) {
      console.error("Failed to create subscriber:", error);
      toast.error("Unable to create subscriber account.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="space-y-6 p-4 md:p-6">
      <div className="flex items-center gap-3">
        <Button
          type="button"
          variant="outline"
          size="icon"
          onClick={() => navigate("/admin/subscribers")}
          aria-label="Back to subscribers"
        >
          <ArrowLeft className="size-4" />
        </Button>

        <div>
          <h1 className="text-2xl font-bold tracking-tight">
            Add Subscriber
          </h1>
          <p className="text-sm text-muted-foreground">
            Create a subscriber account and configure its subscription.
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <UserPlus className="size-5" />
              Account Details
            </CardTitle>
            <CardDescription>
              Create the subscriber's login credentials and OWNER profile.
            </CardDescription>
          </CardHeader>

          <CardContent className="grid gap-5 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="subscriber-name">
                Subscriber name *
              </Label>
              <Input
                id="subscriber-name"
                value={name}
                onChange={(event) => setName(event.target.value)}
                placeholder="Enter subscriber name"
                maxLength={100}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="subscriber-email">
                Email address *
              </Label>
              <Input
                id="subscriber-email"
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="name@example.com"
                maxLength={254}
                required
              />
            </div>

            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="subscriber-password">
                Initial password *
              </Label>
              <Input
                id="subscriber-password"
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                placeholder="At least 6 characters"
                minLength={6}
                required
              />
              <p className="text-xs text-muted-foreground">
                This is a local mock implementation. Do not use real
                passwords until authentication is handled securely by
                your backend.
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Subscription Details</CardTitle>
            <CardDescription>
              Configure the plan validity and estimate allowance.
            </CardDescription>
          </CardHeader>

          <CardContent className="grid gap-5 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="plan-name">Plan name *</Label>
              <Input
                id="plan-name"
                value={planName}
                onChange={(event) => setPlanName(event.target.value)}
                placeholder="Pro"
                maxLength={80}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="estimate-limit">
                Estimate limit *
              </Label>
              <Input
                id="estimate-limit"
                type="number"
                min={1}
                step={1}
                value={estimateLimit}
                onChange={(event) =>
                  setEstimateLimit(event.target.value)
                }
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="subscription-start">
                Start date *
              </Label>
              <Input
                id="subscription-start"
                type="date"
                value={startDate}
                onChange={(event) => setStartDate(event.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="subscription-expiry">
                Expiry date *
              </Label>
              <Input
                id="subscription-expiry"
                type="date"
                min={startDate}
                value={expiryDate}
                onChange={(event) => setExpiryDate(event.target.value)}
                required
              />
            </div>
          </CardContent>
        </Card>

        <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
          <Button
            type="button"
            variant="outline"
            onClick={() => navigate("/admin/subscribers")}
          >
            Cancel
          </Button>

          <Button type="submit" disabled={isSubmitting}>
            <UserPlus className="mr-2 size-4" />
            {isSubmitting ? "Creating..." : "Create Subscriber"}
          </Button>
        </div>
      </form>
    </div>
  );
}
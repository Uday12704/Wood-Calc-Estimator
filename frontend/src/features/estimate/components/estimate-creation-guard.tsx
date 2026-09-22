
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useEffect } from "react";
import { toast } from "react-toastify";

import { useAuth } from "@/features/auth/auth-context";
import { getEstimateUsage } from "@/features/subscription/subscription-usage-storage";
import { checkSubscriptionAccess } from "@/features/subscription/subscription-access";
import { getSubscription } from "@/features/subscription/subscription-storage";

export function EstimateCreationGuard() {
  const { user } = useAuth();
  const location = useLocation();

  const isAdmin = user?.platformRole === "ADMIN";
  const subscription = user && !isAdmin
    ? getSubscription(user.accountId)
    : null;

  const usage = subscription && user
    ? getEstimateUsage(user.accountId, subscription.startDate)
    : null;

  const access = isAdmin
    ? { allowed: true, reason: "ACTIVE" as const }
    : !user
      ? { allowed: false, reason: "NO_SUBSCRIPTION" as const }
      : !subscription || !usage
        ? { allowed: false, reason: "NO_SUBSCRIPTION" as const }
        : checkSubscriptionAccess({
            subscription,
            estimateCount: usage.used,
            estimateLimit: usage.limit,
          });

  useEffect(() => {
    if (isAdmin || access.allowed || !user) return;

    switch (access.reason) {
      case "ESTIMATE_LIMIT_REACHED":
        toast.error(
          "You have reached your estimate limit. Contact the administrator to increase your limit.",
        );
        break;

      case "EXPIRED":
        toast.error(
          "Your subscription has expired. Renew your subscription to create estimates.",
        );
        break;

      case "NO_SUBSCRIPTION":
        toast.error(
          "No subscription was found. Please contact the administrator.",
        );
        break;
    }
  }, [isAdmin, access.allowed, access.reason, user, location.pathname]);

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (!access.allowed) {
    return (
      <Navigate
        to="/app/dashboard"
        replace
        state={{
          subscriptionAccessReason: access.reason,
        }}
      />
    );
  }

  return <Outlet />;
}

import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "@/features/auth/auth-context";
import { getSubscription } from "@/features/subscription/subscription-storage";
import { calculateSubscriptionStatus } from "@/features/subscription/subscription-storage";
import { toast } from "react-toastify";
import { useEffect } from "react";

export function SubscriptionExpiryGuard() {
  const { user } = useAuth();

  const subscription = user?.accountId
    ? getSubscription(user.accountId)
    : null;

  const isExpired =
    user?.platformRole !== "ADMIN" &&
    (!subscription ||
      calculateSubscriptionStatus(subscription.expiryDate) === "expired");

  useEffect(() => {
    if (isExpired) {
      toast.error(
        subscription
          ? "Your subscription has expired. Please renew your subscription to access this page."
          : "No active subscription was found. Please contact the administrator.",
        {
          toastId: "subscription-expired",
        },
      );
    }
  }, [isExpired, subscription]);

  if (!user?.accountId) {
    return <Navigate to="/login" replace />;
  }

  if (user.platformRole === "ADMIN") {
    return <Outlet />;
  }

  if (isExpired) {
    return <Navigate to="/app/dashboard" replace />;
  }

  return <Outlet />;
}
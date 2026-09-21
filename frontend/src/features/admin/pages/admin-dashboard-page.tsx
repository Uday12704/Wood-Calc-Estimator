
import AdminDashboardStats from "../components/admin-dashboard-stats";
import RecentSubscribers from "../components/recent-subscriber";
import RecentSupportRequests from "../components/recent-support-requests";
import ExpiringSubscriptions from "../components/expiring-subscriptions";
import AdminQuickActions from "../components/admin-quick-actions";

export function AdminDashboardPage() {
  return (
    <div className="space-y-6 p-5">
      {/* Page heading */}
      <div className="space-y-1">
        <h1 className="text-2xl font-bold tracking-tight">
          Admin Dashboard
        </h1>

        <p className="text-sm text-muted-foreground">
          Manage subscriber accounts, subscriptions, and customer
          support from one place.
        </p>
      </div>

      {/* Statistics cards */}
      <AdminDashboardStats />

      {/* Quick actions */}
      <AdminQuickActions />

      {/* Expiring subscriptions */}
      <ExpiringSubscriptions />

      {/* Recently registered subscribers */}
      <RecentSubscribers />

      {/* Recent support requests */}
      <RecentSupportRequests />
    </div>
  );
}
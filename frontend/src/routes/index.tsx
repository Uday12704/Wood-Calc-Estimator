import {
  Navigate,
  Route,
  Routes,
} from "react-router-dom";

import { AuthLayout } from "@/layouts/auth-layout";
import { DashboardLayout } from "@/layouts/dashboard-layout";

import { LoginPage } from "@/features/auth/pages/login-page";
import { DashboardPage } from "@/features/dashboard/dashboard-page";

import { ProtectedRoute } from "./protected-route";
import { RoleRoute } from "./role-route";
import { UnauthorizedPage } from "@/pages/unauthorized-page";
import { NewEstimatePage } from "@/features/estimate/pages/new-estimate-page";
import { CutSizeEstimatePage } from "@/features/estimate/pages/cut-size-estimate-page";
import { RoundSizeEstimatePage } from "@/features/estimate/pages/round-size-estimate-page";
import { EstimateHistoryPage } from "@/features/estimate/pages/estimate-history-page";
import { EditCutSizeEstimatePage } from "@/features/estimate/pages/edit-cut-size-estimate-page";
import { PreviewCutSizePage } from "@/features/estimate/pages/preview-cut-size-page";
import { PreviewRoundSizePage } from "@/features/estimate/pages/preview-round-size-page";
import { EditRoundSizeEstimatePage } from "@/features/estimate/pages/edit-round-size-estimate-page";
import { CustomEstimatePage } from "@/features/estimate/pages/custom-estimate-page";
import { PreviewCustomEstimatePage } from "@/features/estimate/pages/preview-custom-page";
import { EditCustomEstimatePage } from "@/features/estimate/pages/edit-custom-estimate-page";
import { DeliveryChecklistPage } from "@/features/delivery-checklist/pages/delivery-checklist-page";
import { DeliveryChecklistDetailPage } from "@/features/delivery-checklist/pages/delivery-checklist-detail-page";
import { SettingsPage } from "@/features/settings/pages/settings-page";
import { ProfileSelectionPage } from "@/features/auth/pages/profile-selection-page";
import Customers from "@/features/customers/pages/customers";
import { NotificationsPage } from "@/features/notifications/pages/notifications-page";
import CustomerSupportPage from "@/features/support/pages/customer-support-page";
import { AdminDashboardPage } from "@/features/admin/pages/admin-dashboard-page";
import AdminSubscribersPage from "@/features/admin/pages/admin-subscribers-page";
import AdminSubscriberDetailsPage from "@/features/admin/pages/admin-subscriber-details-page";
import AdminSupportPage from "@/features/admin/pages/admin-support-page";
import AdminSupportDetailsPage from "@/features/admin/pages/admin-support-details-page";
import AdminLayout from "@/layouts/admin-layout";
import { EstimateCreationGuard } from "@/features/estimate/components/estimate-creation-guard";
import { SubscriptionExpiryGuard } from "@/features/subscription/components/subscription-expiry-guard";
import AdminNotificationsPage from "@/features/admin/pages/admin-notifications-page";

export function AppRoutes() {
  return (
    <Routes>

      {/* PUBLIC */}

      <Route
        path="/login"
        element={
          <AuthLayout>
            <LoginPage />
          </AuthLayout>
        }
      />

      <Route
        path="/select-profile"
        element={<ProfileSelectionPage />}
      />

      <Route
        path="/unauthorized"
        element={<UnauthorizedPage />}
      />

      {/* AUTHENTICATED */}

      <Route element={<ProtectedRoute />}>

        {/* USER */}

        <Route
          element={
            <RoleRoute
              allowedRoles={["SUBSCRIBER", "ADMIN"]}
            />
          }
        >          
          <Route element={<DashboardLayout />}>
            {/* Dashboard remains accessible after expiry */}
            <Route
              path="/app/dashboard"
              element={<DashboardPage />}
            />

            <Route
              path="/app/notifications"
              element={<NotificationsPage />}
            />

            {/* All other subscriber pages require a valid subscription */}
            <Route element={<SubscriptionExpiryGuard />}>
              <Route element={<EstimateCreationGuard />}>
                <Route
                  path="/app/estimates/new"
                  element={<NewEstimatePage />}
                />

                <Route
                  path="/app/estimates/new/cut-size"
                  element={<CutSizeEstimatePage />}
                />

                <Route
                  path="/app/estimates/new/round-size"
                  element={<RoundSizeEstimatePage />}
                />

                <Route
                  path="/app/estimates/new/custom-estimate"
                  element={<CustomEstimatePage />}
                />
              </Route>

              <Route
                path="/app/estimates/history"
                element={<EstimateHistoryPage />}
              />

              <Route
                path="/app/estimates/preview-cut-size/:id"
                element={<PreviewCutSizePage />}
              />

              <Route
                path="/app/estimates/preview-round-size/:id"
                element={<PreviewRoundSizePage />}
              />

              <Route
                path="/app/estimates/preview-custom-estimate/:id"
                element={<PreviewCustomEstimatePage />}
              />

              <Route
                path="/app/estimates/edit-cut-size/:id"
                element={<EditCutSizeEstimatePage />}
              />

              <Route
                path="/app/estimates/edit-round-size/:id"
                element={<EditRoundSizeEstimatePage />}
              />

              <Route
                path="/app/estimates/edit-custom-estimate/:id"
                element={<EditCustomEstimatePage />}
              />

              <Route
                path="/app/delivery-checklist"
                element={<DeliveryChecklistPage />}
              />

              <Route
                path="/app/delivery-checklist/:type/:id"
                element={<DeliveryChecklistDetailPage />}
              />

              <Route
                path="/app/settings"
                element={<SettingsPage />}
              />

              <Route
                path="/app/customers"
                element={<Customers />}
              />

              <Route
                path="/app/support"
                element={<CustomerSupportPage />}
              />
            </Route>
          </Route>
        </Route>

        {/* ADMIN */}

        <Route
          element={
            <RoleRoute
              allowedRoles={["ADMIN"]}
            />
          }
        >

          {/* Admin routes will be added here */}
          <Route element={<AdminLayout />}>
            <Route
              path="/admin/dashboard"
              element={<AdminDashboardPage />}
              />

            <Route
              path="/admin/subscribers"
              element={<AdminSubscribersPage />}
            />

            <Route
              path="/admin/subscribers/:accountId"
              element={<AdminSubscriberDetailsPage />}
            />

            <Route 
              path="/admin/support" 
              element={<AdminSupportPage />} 
            />

            <Route
              path="/admin/support/:requestId"
              element={<AdminSupportDetailsPage />}
            />

            <Route
              path="/admin/notifications"
              element={<AdminNotificationsPage />}
            />
          </Route>
        </Route>
      </Route>

      {/* ROOT */}

      <Route
        path="/"
        element={
          <Navigate
            to="/app/dashboard"
            replace
          />
        }
      />

      {/* 404 */}

      <Route
        path="*"
        element={
          <div className="flex min-h-screen items-center justify-center">
            Page Not Found
          </div>
        }
      />

    </Routes>
  );
}
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
import { EstimatePreviewPage } from "@/features/estimate/pages/estimate-preview-page";
import { EditCutSizeEstimatePage } from "@/features/estimate/pages/edit-cut-size-estimate-page";

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
        path="/unauthorized"
        element={<UnauthorizedPage />}
      />

      {/* AUTHENTICATED */}

      <Route element={<ProtectedRoute />}>

        {/* USER */}

        <Route
          element={
            <RoleRoute
              allowedRoles={["USER", "ADMIN"]}
            />
          }
        >

          <Route
            element={<DashboardLayout />}
          >

            <Route
              path="/app/dashboard"
              element={<DashboardPage />}
            />

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
              path="/app/estimates/history"
              element={
                <EstimateHistoryPage />
              }
            />

            <Route
              path="/app/estimates/:id/preview"
              element={
                <EstimatePreviewPage />
              }
            />

            <Route
              path="/app/estimates/:id/edit"
              element={<EditCutSizeEstimatePage />}
            />

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

          <Route
            path="/admin/dashboard"
            element={
              <div className="p-6">
                Admin Dashboard
              </div>
            }
          />


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
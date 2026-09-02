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
              path="/app/estimates/new/custom-estimate"
              element={<CustomEstimatePage />}
            />

            <Route
              path="/app/estimates/history"
              element={
                <EstimateHistoryPage />
              }
            />

            <Route
              path="/app/estimates/preview-cut-size/:id"
              element={
                <PreviewCutSizePage />
              }
            />

            <Route
              path="/app/estimates/preview-round-size/:id"
              element={
                <PreviewRoundSizePage />
              }
            />
            
            <Route
              path="/app/estimates/preview-custom-estimate/:id"
              element={
                <PreviewCustomEstimatePage />
              }
            />

            <Route
              path="/app/estimates/edit-cut-size/:id"
              element={
                <EditCutSizeEstimatePage />
              }
            />
            
            <Route
              path="/app/estimates/edit-round-size/:id"
              element={
                <EditRoundSizeEstimatePage />
              }
            />
            
            <Route
              path="/app/estimates/edit-custom-estimate/:id"
              element={
                <EditCustomEstimatePage />
              }
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
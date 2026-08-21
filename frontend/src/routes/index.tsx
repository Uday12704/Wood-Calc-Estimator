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
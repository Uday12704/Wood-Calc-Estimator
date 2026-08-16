import { Navigate, Route, Routes } from "react-router-dom";

import { DashboardLayout } from "@/layouts/dashboard-layout";
import { DashboardPage } from "@/features/dashboard/dashboard-page";

export function AppRoutes() {
  return (
    <Routes>
      <Route
        path="/"
        element={<Navigate to="/app/dashboard" replace />}
      />

      <Route element={<DashboardLayout />}>
        <Route
          path="/app/dashboard"
          element={<DashboardPage />}
        />
      </Route>

      <Route
        path="*"
        element={<div>Page Not Found</div>}
      />
    </Routes>
  );
}
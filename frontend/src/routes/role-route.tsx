import {
  Navigate,
  Outlet,
} from "react-router-dom";

import { useAuth } from "@/features/auth/auth-context";
import type { UserRole } from "@/features/auth/types";

interface RoleRouteProps {
  allowedRoles: UserRole[];
}

export function RoleRoute({allowedRoles, }: RoleRouteProps) {

  const { user, isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-sm text-muted-foreground">
          Loading...
        </p>
      </div>
    );
  }

  if (!isAuthenticated || !user) {
    return (
      <Navigate
        to="/login"
        replace
      />
    );
  }

  if (!allowedRoles.includes(user.role)) {
    return (
      <Navigate
        to="/unauthorized"
        replace
      />
    );
  }

  return <Outlet />;
}
import { TreePine } from "lucide-react";
import { Navigate, useNavigate } from "react-router-dom";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { LoginForm } from "../components/login-form";
import { useAuth } from "../auth-context";
import type { LoginCredentials } from "../types";
import { useState } from "react";

export function LoginPage() {
  const {
    user,
    login,
    isAuthenticated,
    isLoading,
  } = useAuth();

  const navigate = useNavigate();

  const [error, setError] =
    useState<string | null>(null);

  if (isAuthenticated) {
    const destination =
      user?.platformRole === "ADMIN"
        ? "/admin/dashboard"
        : "/app/dashboard";

    return (
      <Navigate
        to={destination}
        replace
      />
    );
  }

  async function handleLogin(
    credentials: LoginCredentials,
  ) {
    setError(null);

    try {
      const authenticatedUser =
        await login(credentials);

      // Multiple subscriber profiles.
      // Stay on the login flow until a profile is selected.
      if (!authenticatedUser) {
        navigate("/select-profile", {
          replace: true,
        });
        return;
      }

      const destination =
        authenticatedUser.platformRole === "ADMIN"
          ? "/admin/dashboard"
          : "/app/dashboard";

      navigate(destination, {
        replace: true,
      });
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError(
          "Unable to sign in. Please try again.",
        );
      }
    }
  }

  return (
    <Card className="w-full max-w-md shadow-sm">

      <CardHeader className="space-y-4 text-center">

        <div className="mx-auto flex size-12 items-center justify-center rounded-xl bg-primary text-primary-foreground">
          <TreePine className="size-6" />
        </div>

        <div>
          <CardTitle className="text-2xl">
            Wood Estimator
          </CardTitle>

          <CardDescription className="mt-2">
            Sign in to manage your
            estimates and orders.
          </CardDescription>
        </div>

      </CardHeader>

      <CardContent>

        <LoginForm
          onSubmit={handleLogin}
          isLoading={isLoading}
          error={error}
        />

      </CardContent>

    </Card>
  );
}
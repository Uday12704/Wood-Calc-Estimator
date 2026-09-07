import { Navigate, useNavigate } from "react-router-dom";
import { User, LogOut } from "lucide-react";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";

import { useAuth } from "../auth-context";
import {
  getAccounts,
  getPendingAccountId,
  getProfiles,
  clearPendingAccountId,
} from "../auth-storage";

export function ProfileSelectionPage() {
  const {
    isAuthenticated,
    isLoading,
    selectProfile,
    logout,
  } = useAuth();

  const navigate = useNavigate();

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-sm text-muted-foreground">
          Loading...
        </p>
      </div>
    );
  }

  // If a profile is already selected, don't show
  // the profile selection screen again.
  if (isAuthenticated) {
    return (
      <Navigate
        to="/app/dashboard"
        replace
      />
    );
  }

  const accountId = getPendingAccountId();

  if (!accountId) {
    return (
      <Navigate
        to="/login"
        replace
      />
    );
  }

  const account = getAccounts().find(
    (item) =>
      item.id === accountId &&
      item.active,
  );

  if (!account) {
    clearPendingAccountId();

    return (
      <Navigate
        to="/login"
        replace
      />
    );
  }

  const profiles = getProfiles().filter(
    (profile) =>
      profile.accountId === account.id &&
      profile.active,
  );

  function handleProfileSelect(
    profileId: string,
  ) {
    try {
      const selectedUser =
        selectProfile(profileId);

      if (
        selectedUser.platformRole === "ADMIN"
      ) {
        navigate("/admin/dashboard", {
          replace: true,
        });
      } else {
        navigate("/app/dashboard", {
          replace: true,
        });
      }
    } catch (error) {
      console.error(
        "Profile selection failed:",
        error,
      );
    }
  }

  function handleLogout() {
    logout();
    navigate("/login", {
      replace: true,
    });
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-muted/30 p-4">
      <Card className="w-full max-w-2xl shadow-sm">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">
            Who is using this account?
          </CardTitle>

          <CardDescription>
            Select your profile to continue.
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {profiles.map((profile) => (
              <button
                key={profile.id}
                type="button"
                onClick={() =>
                  handleProfileSelect(
                    profile.id,
                  )
                }
                className="group rounded-xl border bg-background p-6 text-center transition hover:border-primary hover:bg-accent cursor-pointer"
              >
                <div className="mx-auto mb-4 flex size-16 items-center justify-center rounded-full bg-primary/10 text-primary">
                  <User className="size-8" />
                </div>

                <p className="font-semibold">
                  {profile.name}
                </p>

                <p className="mt-1 text-sm text-muted-foreground">
                  {profile.role === "OWNER"
                    ? "Owner"
                    : "User"}
                </p>
              </button>
            ))}
          </div>

          <div className="flex justify-center border-t pt-4">
            <Button
              variant="ghost"
              onClick={handleLogout}
            >
              <LogOut className="mr-2 size-4" />
              Sign out
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
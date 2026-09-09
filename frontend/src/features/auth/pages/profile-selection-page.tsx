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
import { useState } from "react";
import { toast } from "react-toastify";
import { Input } from "@/components/ui/input";

export function ProfileSelectionPage() {
  const {
    isAuthenticated,
    isLoading,
    selectProfile,
    logout,
  } = useAuth();

  const navigate = useNavigate();
  const [pinProfileId, setPinProfileId] =
    useState<string | null>(null);

  const [pin, setPin] = useState("");

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
    providedPin?: string,
  ) {
    try {
      const selectedUser =
        selectProfile(
          profileId,
          providedPin,
        );

      setPinProfileId(null);
      setPin("");

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
      if (
        error instanceof Error &&
        error.message === "PIN_REQUIRED"
      ) {
        setPinProfileId(profileId);
        setPin("");
        return;
      }

      if (
        error instanceof Error &&
        error.message === "Incorrect PIN."
      ) {
        toast.error("Incorrect PIN.");
        setPin("");
        return;
      }

      if (error instanceof Error) {
        toast.error(error.message);
        return;
      }

      toast.error(
        "Profile selection failed.",
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

          {pinProfileId && (
            <div className="rounded-xl border bg-muted/30 p-5">
              <div className="mb-4">
                <h3 className="font-semibold">
                  Enter Profile PIN
                </h3>

                <p className="text-sm text-muted-foreground">
                  Enter the 4-digit PIN to continue to{" "}
                  {
                    profiles.find(
                      (profile) =>
                        profile.id === pinProfileId,
                    )?.name
                  }.
                </p>
              </div>

              <div className="flex flex-col gap-3 sm:flex-row">
                <Input
                  type="password"
                  inputMode="numeric"
                  maxLength={4}
                  value={pin}
                  onChange={(event) =>
                    setPin(
                      event.target.value
                        .replace(/\D/g, "")
                        .slice(0, 4),
                    )
                  }
                  placeholder="Enter 4-digit PIN"
                  autoFocus
                  className="sm:max-w-xs"
                />

                <Button
                  type="button"
                  onClick={() => {
                    if (pin.length !== 4) {
                      toast.error(
                        "Please enter a 4-digit PIN.",
                      );
                      return;
                    }

                    handleProfileSelect(
                      pinProfileId,
                      pin,
                    );
                  }}
                  className="cursor-pointer"
                >
                  Continue
                </Button>

                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setPinProfileId(null);
                    setPin("");
                  }}
                  className="cursor-pointer"
                >
                  Cancel
                </Button>
              </div>
            </div>
          )}

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
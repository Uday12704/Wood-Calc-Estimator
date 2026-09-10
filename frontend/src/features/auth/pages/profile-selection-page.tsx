import { Navigate, useNavigate } from "react-router-dom";
import { User, LogOut, ShieldCheck } from "lucide-react";

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
import { requestOwnerPinRecovery, resetOwnerPin, verifyOwnerPinRecoveryOtp, type PinRecoveryRequest } from "../pin-recovery";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";

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

  const [isRecoveryOpen, setIsRecoveryOpen] =
    useState(false);

  const [recoveryRequest, setRecoveryRequest] =
    useState<PinRecoveryRequest | null>(null);

  const [recoveryOtp, setRecoveryOtp] =
    useState("");

  const [newOwnerPin, setNewOwnerPin] =
    useState("");

  const [confirmOwnerPin, setConfirmOwnerPin] =
    useState("");

  const [isRecoveryVerified, setIsRecoveryVerified] =
    useState(false);

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

  function handleForgotPin() {
    if (!account) {
      toast.error("Account not found.");
      return;
    }
    try {
      const request =
        requestOwnerPinRecovery(account.id);

      setRecoveryRequest(request);
      setRecoveryOtp("");
      setNewOwnerPin("");
      setConfirmOwnerPin("");
      setIsRecoveryVerified(false);
      setIsRecoveryOpen(true);

      toast.success(
        `OTP sent to ${request.recoveryEmail}`,
      );
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Unable to start PIN recovery.",
      );
    }
  }

  function handleRecoveryOtpVerify() {
    if (!recoveryRequest) {
      return;
    }

    const isValid =
      verifyOwnerPinRecoveryOtp(
        recoveryRequest,
        recoveryOtp,
      );

    if (!isValid) {
      toast.error("Incorrect OTP.");
      return;
    }

    setIsRecoveryVerified(true);
    toast.success("OTP verified.");
  }

  function handleResetOwnerPin() {
    if (!recoveryRequest) {
      return;
    }

    if (!isRecoveryVerified) {
      toast.error("Please verify the OTP first.");
      return;
    }

    if (!/^\d{4}$/.test(newOwnerPin)) {
      toast.error(
        "Owner PIN must be exactly 4 digits.",
      );
      return;
    }

    if (newOwnerPin !== confirmOwnerPin) {
      toast.error("PINs do not match.");
      return;
    }

    try {
      resetOwnerPin(
        recoveryRequest.accountId,
        recoveryRequest.profileId,
        newOwnerPin,
      );

      toast.success(
        "Owner PIN reset successfully.",
      );

      // Close recovery dialog
      setIsRecoveryOpen(false);

      // Return to Owner PIN entry
      setPinProfileId(
        recoveryRequest.profileId,
      );

      // Put the new PIN into the input
      setPin(newOwnerPin);

      // Clear recovery state
      setRecoveryRequest(null);
      setRecoveryOtp("");
      setNewOwnerPin("");
      setConfirmOwnerPin("");
      setIsRecoveryVerified(false);
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Unable to reset Owner PIN.",
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

                {profiles.find(
                  (profile) =>
                    profile.id === pinProfileId,
                )?.role === "OWNER" && (
                  <button
                    type="button"
                    className="mt-2 text-left text-sm text-primary hover:underline sm:self-center cursor-pointer"
                    onClick={handleForgotPin}
                  >
                    Forgot PIN?
                  </button>
                )}

            </div>
          )}

          <div className="flex justify-center border-t pt-4">
            <Button
              variant="ghost"
              onClick={handleLogout}
              className="cursor-pointer"
            >
              <LogOut className="mr-2 size-4" />
              Sign out
            </Button>
          </div>
        </CardContent>
      </Card>

      <Dialog
        open={isRecoveryOpen}
        onOpenChange={(open) => {
          setIsRecoveryOpen(open);

          if (!open) {
            setRecoveryRequest(null);
            setRecoveryOtp("");
            setNewOwnerPin("");
            setConfirmOwnerPin("");
            setIsRecoveryVerified(false);
          }
        }}
      >
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <div className="mb-3 flex size-10 items-center justify-center rounded-full bg-primary/10 text-primary">
              <ShieldCheck className="size-5" />
            </div>

            <DialogTitle>
              Recover Owner PIN
            </DialogTitle>

            <DialogDescription>
              Verify the OTP sent to the
              Owner's recovery email to create
              a new PIN.
            </DialogDescription>
          </DialogHeader>

          {recoveryRequest && (
            <div className="space-y-5">

              {/* Recovery email */}
              <div className="rounded-lg border p-3">
                <p className="text-xs text-muted-foreground">
                  Recovery email
                </p>

                <p className="mt-1 text-sm font-medium">
                  {recoveryRequest.recoveryEmail}
                </p>
              </div>

              {/* OTP */}
              <div className="space-y-2">
                <label
                  htmlFor="profile-recovery-otp"
                  className="text-sm font-medium"
                >
                  Verification OTP
                </label>

                <Input
                  id="profile-recovery-otp"
                  inputMode="numeric"
                  maxLength={6}
                  value={recoveryOtp}
                  onChange={(event) =>
                    setRecoveryOtp(
                      event.target.value
                        .replace(/\D/g, "")
                        .slice(0, 6),
                    )
                  }
                  placeholder="Enter 6-digit OTP"
                />
              </div>

              <Button
                type="button"
                className="w-full"
                onClick={
                  handleRecoveryOtpVerify
                }
                disabled={
                  recoveryOtp.length !== 6 ||
                  isRecoveryVerified
                }
              >
                {isRecoveryVerified
                  ? "OTP Verified"
                  : "Verify OTP"}
              </Button>

              {/* New PIN */}
              {isRecoveryVerified && (
                <div className="space-y-4 border-t pt-5">

                  <div className="space-y-2">
                    <label
                      htmlFor="profile-new-owner-pin"
                      className="text-sm font-medium"
                    >
                      New Owner PIN
                    </label>

                    <Input
                      id="profile-new-owner-pin"
                      type="password"
                      inputMode="numeric"
                      maxLength={4}
                      value={newOwnerPin}
                      onChange={(event) =>
                        setNewOwnerPin(
                          event.target.value
                            .replace(/\D/g, "")
                            .slice(0, 4),
                        )
                      }
                      placeholder="Enter new 4-digit PIN"
                    />
                  </div>

                  <div className="space-y-2">
                    <label
                      htmlFor="profile-confirm-owner-pin"
                      className="text-sm font-medium"
                    >
                      Confirm Owner PIN
                    </label>

                    <Input
                      id="profile-confirm-owner-pin"
                      type="password"
                      inputMode="numeric"
                      maxLength={4}
                      value={confirmOwnerPin}
                      onChange={(event) =>
                        setConfirmOwnerPin(
                          event.target.value
                            .replace(/\D/g, "")
                            .slice(0, 4),
                        )
                      }
                      placeholder="Confirm new 4-digit PIN"
                    />
                  </div>

                  <Button
                    type="button"
                    className="w-full"
                    onClick={
                      handleResetOwnerPin
                    }
                    disabled={
                      newOwnerPin.length !== 4 ||
                      confirmOwnerPin.length !== 4
                    }
                  >
                    Reset Owner PIN
                  </Button>

                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
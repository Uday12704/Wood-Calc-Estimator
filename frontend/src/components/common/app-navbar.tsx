import {
  Bell,
  Calculator,
  LogOut,
  Moon,
  Settings,
  ShieldCheck,
  Sun,
  User,
} from "lucide-react";

import { Link, useLocation, useNavigate } from "react-router-dom";
import { useTheme } from "next-themes";

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { SidebarTrigger } from "@/components/ui/sidebar";
import { useAuth } from "@/features/auth/auth-context";
import { Button } from "../ui/button";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { getProfiles } from "@/features/auth/auth-storage";
import { getSecuritySettings } from "@/features/settings/services/settings-storage";
import { Input } from "../ui/input";
import { requestOwnerPinRecovery, resetOwnerPin, verifyOwnerPinRecoveryOtp, type PinRecoveryRequest } from "@/features/auth/pin-recovery";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "../ui/dialog";
import { getUnreadNotificationCount } from "@/features/notifications/notification-utils";

const pageTitles: Record<string, string> = {
  "/app/dashboard": "Dashboard",

  "/app/estimates/new": "New Estimate",
  "/app/estimates/new/cut-size": "Cut Size Estimate",
  "/app/estimates/new/round-size": "Round Size Estimate",
  
  "/app/estimates/history": "Estimate History",
  "/app/customers": "Customers",
  "/app/delivery-checklist": "Delivery Checklist",
  "/app/notifications": "Notifications",
  "/app/settings": "Settings",
  "/app/support": "Customer Support",
};

interface AppNavbarProps {
  onCalculatorOpen: () => void;
}

export function AppNavbar({
  onCalculatorOpen
}: AppNavbarProps) {
  const location = useLocation();
  const navigate = useNavigate();

  const { theme, setTheme } = useTheme();

  const currentPage =
    pageTitles[location.pathname] ?? "Wood Estimator";

  const { user, logout, selectProfile } = useAuth();

  const [
    unreadNotificationCount,
    setUnreadNotificationCount,
  ] = useState(0);

  useEffect(() => {
    const updateUnreadCount = () => {
      if (!user?.accountId) {
        setUnreadNotificationCount(0);
        return;
      }

      setUnreadNotificationCount(
        getUnreadNotificationCount(
          user.accountId,
        ),
      );
    };

    updateUnreadCount();

    window.addEventListener(
      "wood-calc-notifications-updated",
      updateUnreadCount,
    );

    return () => {
      window.removeEventListener(
        "wood-calc-notifications-updated",
        updateUnreadCount,
      );
    };
  }, [user?.accountId]);

  const [isProfileSwitcherOpen, setIsProfileSwitcherOpen] =
    useState(false);

  const [selectedProfileId, setSelectedProfileId] =
    useState<string | null>(null);

  const [pin, setPin] = useState("");

  const [isRecoveryOpen, setIsRecoveryOpen] = useState(false);
  const [recoveryRequest, setRecoveryRequest] =
    useState<PinRecoveryRequest | null>(null);
  const [recoveryOtp, setRecoveryOtp] = useState("");
  const [newOwnerPin, setNewOwnerPin] = useState("");
  const [confirmOwnerPin, setConfirmOwnerPin] = useState("");
  const [isRecoveryVerified, setIsRecoveryVerified] =
  useState(false);

  const handleForgotPin = () => {
    if (!user) {
      return;
    }

    try {
      const request = requestOwnerPinRecovery(
        user.accountId,
      );

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
  };

  const handleRecoveryOtpVerify = () => {
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
  };

  const handleResetOwnerPin = () => {
    if (!recoveryRequest) {
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

      setIsRecoveryOpen(false);
      setRecoveryRequest(null);
      setRecoveryOtp("");
      setNewOwnerPin("");
      setConfirmOwnerPin("");
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Unable to reset Owner PIN.",
      );
    }
  };

  function handleSwitchProfile() {
    if (!user?.accountId) {
      toast.error(
        "Unable to determine the current account.",
      );
      return;
    }

    setSelectedProfileId(null);
    setPin("");

    setIsProfileSwitcherOpen(true);
  }

  function handleProfileSelect(
    profileId: string,
  ) {
    if (!user?.accountId) {
      return;
    }

    const profiles = getProfiles().filter(
      (profile) =>
        profile.accountId === user.accountId &&
        profile.active,
    );

    const targetProfile = profiles.find(
      (profile) =>
        profile.id === profileId,
    );

    if (!targetProfile) {
      toast.error(
        "Selected profile is not available.",
      );
      return;
    }

    // Clicking the currently active profile
    // does not require a PIN.
    if (
      targetProfile.id === user.profileId
    ) {
      setIsProfileSwitcherOpen(false);
      return;
    }

    const securitySettings =
      getSecuritySettings(user.accountId);

    if (securitySettings.pinEnabled) {
      setSelectedProfileId(profileId);
      setPin("");
      return;
    }

    performProfileSwitch(profileId);
  }

  function performProfileSwitch(
    profileId: string,
    providedPin?: string,
  ) {
    try {
      const selectedUser =
        selectProfile(
          profileId,
          providedPin,
        );

      setIsProfileSwitcherOpen(false);
      setSelectedProfileId(null);
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
        setSelectedProfileId(profileId);
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
        "Profile switching failed.",
      );
    }
  }

  function handlePinSubmit() {
    if (!selectedProfileId) {
      return;
    }

    if (pin.length !== 4) {
      toast.error(
        "Please enter a 4-digit PIN.",
      );
      return;
    }

    performProfileSwitch(
      selectedProfileId,
      pin,
    );
  }

  return (
    <nav className="sticky top-0 z-20 flex h-16 items-center justify-between border-b bg-background px-4">

      {/* LEFT SIDE */}
      <div className="flex items-center gap-4">

        <SidebarTrigger />

        <div className="hidden h-5 w-px bg-border sm:block" />

        <span className="text-sm font-semibold">
          {currentPage}
        </span>

      </div>

      {/* RIGHT SIDE */}
      <div className="flex items-center gap-2">

        <Button
          type="button"
          onClick={onCalculatorOpen}
          className="cursor-pointer"
          variant="outline"
        >
          <Calculator className="size-5" />
        </Button>

          <Link
            to="/app/notifications"
            className="inline-flex"
          >
            <Button
              variant="outline"
              size="icon"
              className="relative"
            >
              <Bell className="size-5" />

              {unreadNotificationCount > 0 && (
                <span className="absolute -right-1 -top-1 flex min-w-4 items-center justify-center rounded-full bg-wood-secondary px-1 text-[10px] font-semibold leading-4 text-destructive-foreground">
                  {unreadNotificationCount > 99
                    ? "99+"
                    : unreadNotificationCount}
                </span>
              )}

              <span className="sr-only">
                Notifications
              </span>
            </Button>
          </Link>

        {/* THEME */}
        <DropdownMenu>
          <DropdownMenuTrigger
            className="relative inline-flex size-9 items-center justify-center rounded-md border bg-background transition-colors hover:bg-accent hover:text-accent-foreground outline-none"
          >

            {theme === "light" ? (
              <Sun className="size-4" />
            ) : (
              <Moon className="size-4" />
            )}

            <span className="sr-only">
              Change theme
            </span>

          </DropdownMenuTrigger>

          <DropdownMenuContent align="end">

            <DropdownMenuGroup>

              <DropdownMenuLabel>
                Appearance
              </DropdownMenuLabel>

              <DropdownMenuItem
                onClick={() => setTheme("light")}
              >
                Light

                {theme === "light" && (
                  <span className="ml-auto">
                    ✓
                  </span>
                )}
              </DropdownMenuItem>

              <DropdownMenuItem
                onClick={() => setTheme("dark")}
              >
                Dark

                {theme === "dark" && (
                  <span className="ml-auto">
                    ✓
                  </span>
                )}
              </DropdownMenuItem>

              <DropdownMenuItem
                onClick={() => setTheme("system")}
              >
                System

                {theme === "system" && (
                  <span className="ml-auto">
                    ✓
                  </span>
                )}
              </DropdownMenuItem>

            </DropdownMenuGroup>

          </DropdownMenuContent>

        </DropdownMenu>

        {/* USER MENU */}

        <DropdownMenu>
          <DropdownMenuTrigger
            className="inline-flex size-9 items-center justify-center rounded-full outline-none ring-offset-background focus-visible:ring-2 focus-visible:ring-ring"
          >
            <Avatar className="size-9">
              <AvatarImage
                src=""
                alt="User profile"
              />
              <AvatarFallback>
                {user?.name
                ?.slice(0, 2)
                .toUpperCase()}
              </AvatarFallback>
            </Avatar>

            <span className="sr-only">
              Open user menu
            </span>

          </DropdownMenuTrigger>
          <DropdownMenuContent
            align="end"
            sideOffset={8}
            className="w-35"
          >
            <DropdownMenuGroup>
              <DropdownMenuLabel>
                My Account
              </DropdownMenuLabel>

              <DropdownMenuSeparator />

              <DropdownMenuItem
                onClick={handleSwitchProfile}
              >
                <User className="mr-2 size-4" />
                    Switch Profile
              </DropdownMenuItem>

              <DropdownMenuItem
                onClick={() => navigate("/app/settings")}
              >
                <Settings className="mr-2 size-4" />
                    Settings
              </DropdownMenuItem>

            </DropdownMenuGroup>

            <DropdownMenuSeparator />

            <DropdownMenuItem
              variant="destructive"
              onClick={logout}
            >
              <LogOut className="mr-2 size-4" />

              Logout
            </DropdownMenuItem>

          </DropdownMenuContent>

        </DropdownMenu>

      </div>
      <Dialog
        open={isProfileSwitcherOpen}
        onOpenChange={(open) => {
          setIsProfileSwitcherOpen(open);

          if (!open) {
            setSelectedProfileId(null);
            setPin("");
          }
        }}
      >
        <DialogContent className="sm:max-w-md">
          {!selectedProfileId ? (
            <>
              <DialogHeader>
                <DialogTitle>
                  Switch Profile
                </DialogTitle>

                <DialogDescription>
                  Select the profile you want to use.
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-2">
                {getProfiles()
                  .filter(
                    (profile) =>
                      profile.accountId ===
                        user?.accountId &&
                      profile.active,
                  )
                  .map((profile) => (
                    <button
                      key={profile.id}
                      type="button"
                      onClick={() =>
                        handleProfileSelect(profile.id)
                      }
                      className="flex w-full items-center gap-3 rounded-lg border p-4 text-left transition hover:bg-accent"
                    >
                      <div className="flex size-10 items-center justify-center rounded-full bg-primary/10 text-primary">
                        <User className="size-5" />
                      </div>

                      <div>
                        <p className="font-medium">
                          {profile.name}
                        </p>

                        <p className="text-sm text-muted-foreground">
                          {profile.role === "OWNER"
                            ? "Owner"
                            : "User"}
                        </p>
                      </div>

                      {profile.id === user?.profileId && (
                        <span className="ml-auto text-xs text-muted-foreground">
                          Current
                        </span>
                      )}
                    </button>
                  ))}
              </div>

              <div className="flex justify-end">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() =>
                    setIsProfileSwitcherOpen(false)
                  }
                >
                  Cancel
                </Button>
              </div>
            </>
          ) : (
            <>
              <DialogHeader>
                <div className="mb-3 flex size-10 items-center justify-center rounded-full bg-primary/10 text-primary">
                  <ShieldCheck className="size-5" />
                </div>

                <DialogTitle>
                  Enter Profile PIN
                </DialogTitle>

                <DialogDescription>
                  Enter the 4-digit PIN to switch to{" "}
                  {getProfiles().find(
                    (profile) =>
                      profile.id === selectedProfileId,
                  )?.name}
                  .
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-2">
                <label
                  htmlFor="switch-profile-pin"
                  className="text-sm font-medium"
                >
                  Profile PIN
                </label>

                <Input
                  id="switch-profile-pin"
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
                  onKeyDown={(event) => {
                    if (event.key === "Enter") {
                      handlePinSubmit();
                    }
                  }}
                />

                {getProfiles().find(
                  (profile) =>
                    profile.id === selectedProfileId,
                )?.role === "OWNER" && (
                  <button
                    type="button"
                    className="text-sm text-primary hover:underline"
                    onClick={handleForgotPin}
                  >
                    Forgot PIN?
                  </button>
                )}
              </div>

              <div className="flex justify-end gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setSelectedProfileId(null);
                    setPin("");
                  }}
                >
                  Back
                </Button>

                <Button
                  type="button"
                  onClick={handlePinSubmit}
                >
                  Continue
                </Button>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>

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
              Verify the OTP sent to the Owner's
              recovery email to create a new PIN.
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
                  htmlFor="recovery-otp"
                  className="text-sm font-medium"
                >
                  Verification OTP
                </label>

                <Input
                  id="recovery-otp"
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
                onClick={handleRecoveryOtpVerify}
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
                      htmlFor="new-owner-pin"
                      className="text-sm font-medium"
                    >
                      New Owner PIN
                    </label>

                    <Input
                      id="new-owner-pin"
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
                      htmlFor="confirm-owner-pin"
                      className="text-sm font-medium"
                    >
                      Confirm Owner PIN
                    </label>

                    <Input
                      id="confirm-owner-pin"
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
                    onClick={handleResetOwnerPin}
                    disabled={
                      !isRecoveryVerified ||
                      newOwnerPin.length !== 4 ||
                      confirmOwnerPin.length !== 4
                    }
                  >
                    Reset Owner PIN
                  </Button>
                </div>
              )}

              <div className="flex justify-end">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() =>
                    setIsRecoveryOpen(false)
                  }
                >
                  Cancel
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </nav>
  );
}
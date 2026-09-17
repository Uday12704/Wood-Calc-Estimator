import { useEffect, useState } from "react";
import { KeyRound, Mail, Save, ShieldCheck } from "lucide-react";
import { toast } from "react-toastify";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import { useAuth } from "@/features/auth/auth-context";
import {
  getAccounts,
  getProfiles,
  saveAccounts,
} from "@/features/auth/auth-storage";

import type { SecuritySettings } from "../types";

import {
  getSecuritySettings,
  saveSecuritySettings,
} from "../services/settings-storage";
import type { AppProfile } from "@/features/auth/types";
import { createNotification } from "@/features/notifications/notification-storage";

export function ChangePasswordCard() {
  const { user } = useAuth();

  /* ---------------------------------- */
  /* Security / PIN state */
  /* ---------------------------------- */

  const [securitySettings, setSecuritySettings] =
    useState<SecuritySettings>({
      pinEnabled: false,
      profilePins: {},
      recoveryEmail: "",
      recoveryEmailVerified: false,
    });

  const [profiles, setProfiles] = useState<AppProfile[]>([]);

  const [pinValues, setPinValues] =
    useState<Record<string, string>>({});

  const [isSavingPin, setIsSavingPin] =
    useState(false);

  const [recoveryEmail, setRecoveryEmail] =
    useState("");

  const [isSavingRecoveryEmail, setIsSavingRecoveryEmail] =
    useState(false);

  const [otp, setOtp] = useState("");

  const [generatedOtp, setGeneratedOtp] =
    useState<string | null>(null);

  const [isOtpVerificationOpen, setIsOtpVerificationOpen] =
    useState(false);

  const [isVerifyingOtp, setIsVerifyingOtp] =
    useState(false);

  /* ---------------------------------- */
  /* Password state */
  /* ---------------------------------- */

  const [currentPassword, setCurrentPassword] =
    useState("");

  const [newPassword, setNewPassword] =
    useState("");

  const [confirmPassword, setConfirmPassword] =
    useState("");

  const [isSaving, setIsSaving] =
    useState(false);

  /* ---------------------------------- */
  /* Permissions */
  /* ---------------------------------- */

  const isOwner =
    user?.platformRole === "SUBSCRIBER" &&
    user.profileRole === "OWNER";

  /* ---------------------------------- */
  /* Load security settings */
  /* ---------------------------------- */

  useEffect(() => {
    if (!user?.accountId) {
      return;
    }

    const settings = getSecuritySettings(
      user.accountId,
    );

    const accountProfiles = getProfiles().filter(
      (profile) =>
        profile.accountId === user.accountId &&
        profile.active,
    );

    setSecuritySettings(settings);
    setPinValues(settings.profilePins);
    setProfiles(accountProfiles);
    setRecoveryEmail(
      settings.recoveryEmail ?? "",
    );
  }, [user?.accountId]);

  /* ---------------------------------- */
  /* Password */
  /* ---------------------------------- */

  function resetForm() {
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
  }

  function handleChangePassword() {
    if (!isOwner) {
      toast.error(
        "Only the account owner can change the password.",
      );
      return;
    }

    if (!currentPassword) {
      toast.error(
        "Current password is required.",
      );
      return;
    }

    if (!newPassword) {
      toast.error(
        "New password is required.",
      );
      return;
    }

    if (newPassword.length < 6) {
      toast.error(
        "New password must be at least 6 characters.",
      );
      return;
    }

    if (newPassword === currentPassword) {
      toast.error(
        "New password must be different from the current password.",
      );
      return;
    }

    if (newPassword !== confirmPassword) {
      toast.error(
        "New password and confirmation do not match.",
      );
      return;
    }

    const accounts = getAccounts();

    const account = accounts.find(
      (item) =>
        item.id === user?.accountId &&
        item.active,
    );

    if (!account) {
      toast.error(
        "Subscription account not found.",
      );
      return;
    }

    if (account.password !== currentPassword) {
      toast.error(
        "Current password is incorrect.",
      );
      return;
    }

    setIsSaving(true);

    try {
      const updatedAccounts = accounts.map(
        (item) =>
          item.id === account.id
            ? {
                ...item,
                password: newPassword,
              }
            : item,
      );

      saveAccounts(updatedAccounts);

      createNotification({
        accountId: user.accountId,
        createdBy: user.profileId,
        title: "Security Alert",
        message:
          "Your subscription password was changed successfully.",
        type: "SYSTEM",
        priority: "HIGH",
        notificationKey: `password-changed-${user.accountId}-${Date.now()}`,
      });

      resetForm();

      toast.success(
        "Password changed successfully.",
      );
    } finally {
      setIsSaving(false);
    }
  }

  /* ---------------------------------- */
  /* PIN */
  /* ---------------------------------- */

  function handlePinChange(
    profileId: string,
    value: string,
  ) {
    // Allow only numbers.
    const numericValue = value.replace(
      /\D/g,
      "",
    );

    // Maximum 4 digits.
    const limitedValue =
      numericValue.slice(0, 4);

    setPinValues((previous) => ({
      ...previous,
      [profileId]: limitedValue,
    }));
  }

  function handlePinSystemChange(
    enabled: boolean,
  ) {
    if (!isOwner) {
      toast.error(
        "Only the account owner can change PIN settings.",
      );
      return;
    }

    if (enabled) {
      const missingPin = profiles.find(
        (profile) =>
          !pinValues[profile.id] ||
          pinValues[profile.id].length !== 4,
      );

      if (missingPin) {
        toast.error(
          `Please set a 4-digit PIN for ${missingPin.name}.`,
        );
        return;
      }
    }

    setSecuritySettings((previous) => ({
      ...previous,
      pinEnabled: enabled,
    }));
  }

  function generateOtp(): string {
    return Math.floor(
      100000 + Math.random() * 900000,
    ).toString();
  }

  function handleSaveRecoveryEmail() {
    if (!isOwner) {
      toast.error(
        "Only the account owner can manage the recovery email.",
      );
      return;
    }

    if (!user?.accountId) {
      return;
    }

    const email =
      recoveryEmail.trim().toLowerCase();

    if (!email) {
      toast.error(
        "Recovery email is required.",
      );
      return;
    }

    const emailPattern =
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailPattern.test(email)) {
      toast.error(
        "Please enter a valid email address.",
      );
      return;
    }

    setIsSavingRecoveryEmail(true);

    try {
      const emailChanged =
        securitySettings.recoveryEmail !== email;

      /*
      * If the email is already verified and
      * hasn't changed, there is nothing to
      * verify again.
      */
      if (
        !emailChanged &&
        securitySettings.recoveryEmailVerified
      ) {
        toast.info(
          "This recovery email is already verified.",
        );

        return;
      }

      const newOtp = generateOtp();

      /*
      * TEMPORARY DEVELOPMENT OTP
      *
      * In production this OTP must be generated
      * and sent by the backend.
      */
      setGeneratedOtp(newOtp);

      const updatedSecurity: SecuritySettings = {
        ...securitySettings,
        recoveryEmail: email,
        recoveryEmailVerified: false,
      };

      saveSecuritySettings(
        user.accountId,
        updatedSecurity,
      );

      createNotification({
        accountId: user.accountId,
        createdBy: user.profileId,
        title: "Security Alert",
        message:
          `Recovery email was changed to ${email}. Please verify the new email address.`,
        type: "SYSTEM",
        priority: "HIGH",
        notificationKey: `recovery-email-changed-${user.accountId}-${Date.now()}`,
      });

      setSecuritySettings(updatedSecurity);
      setRecoveryEmail(email);

      setOtp("");
      setIsOtpVerificationOpen(true);

      /*
      * Temporary development helper.
      * Remove this when backend email delivery
      * is implemented.
      */
      console.log(
        `Recovery OTP for ${email}: ${newOtp}`,
      );

      toast.success(
        "Verification OTP generated. Check the development console.",
      );
    } finally {
      setIsSavingRecoveryEmail(false);
    }
  }

  function handleVerifyOtp() {
    if (!isOwner) {
      toast.error(
        "Only the account owner can verify the recovery email.",
      );
      return;
    }

    if (!user?.accountId) {
      return;
    }

    if (!generatedOtp) {
      toast.error(
        "No verification OTP is available.",
      );
      return;
    }

    if (otp.length !== 6) {
      toast.error(
        "Please enter the 6-digit OTP.",
      );
      return;
    }

    setIsVerifyingOtp(true);

    try {
      if (otp !== generatedOtp) {
        toast.error(
          "Incorrect verification OTP.",
        );
        setOtp("");
        return;
      }

      const updatedSecurity: SecuritySettings = {
        ...securitySettings,
        recoveryEmailVerified: true,
      };

      saveSecuritySettings(
        user.accountId,
        updatedSecurity,
      );

      createNotification({
        accountId: user.accountId,
        createdBy: user.profileId,
        title: "Security Alert",
        message:
          `Your recovery email ${recoveryEmail} was verified successfully.`,
        type: "SYSTEM",
        priority: "HIGH",
        notificationKey: `recovery-email-verified-${user.accountId}-${Date.now()}`,
      });

      setSecuritySettings(updatedSecurity);

      setGeneratedOtp(null);
      setOtp("");
      setIsOtpVerificationOpen(false);

      toast.success(
        "Recovery email verified successfully.",
      );
    } finally {
      setIsVerifyingOtp(false);
    }
  }

  function handleSavePins() {
    if (!isOwner) {
      toast.error(
        "Only the account owner can modify PIN settings.",
      );
      return;
    }

    if (!user?.accountId) {
      return;
    }

    for (const profile of profiles) {
      const pin = pinValues[profile.id] ?? "";

      if (pin.length !== 4) {
        toast.error(
          `PIN for ${profile.name} must be exactly 4 digits.`,
        );
        return;
      }
    }

    setIsSavingPin(true);

    try {
      const updatedSecurity: SecuritySettings = {
        ...securitySettings,

        pinEnabled: securitySettings.pinEnabled,

        profilePins: profiles.reduce(
          (result, profile) => {
            result[profile.id] =
              pinValues[profile.id];

            return result;
          },
          {} as Record<string, string>,
        ),
      };

      saveSecuritySettings(
        user.accountId,
        updatedSecurity,
      );

      createNotification({
        accountId: user.accountId,
        createdBy: user.profileId,
        title: "Security Alert",
        message:
          "Profile PIN settings were changed successfully.",
        type: "SYSTEM",
        priority: "HIGH",
        notificationKey: `pin-settings-changed-${user.accountId}-${Date.now()}`,
      });

      setSecuritySettings(updatedSecurity);
      setPinValues(updatedSecurity.profilePins);

      toast.success(
        "PIN settings saved successfully.",
      );
    } finally {
      setIsSavingPin(false);
    }
  }

  /* ---------------------------------- */
  /* Non-owner view */
  /* ---------------------------------- */

  if (!isOwner) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg text-wood-primary">
            <KeyRound className="size-5" />
            Security
          </CardTitle>

          <p className="text-sm text-muted-foreground">
            Password and PIN settings are managed
            by the account owner.
          </p>
        </CardHeader>

        <CardContent>
          <div className="rounded-md border border-dashed p-6 text-center text-sm text-muted-foreground">
            Only the account owner can change the
            subscription password or manage profile
            PINs.
          </div>
        </CardContent>
      </Card>
    );
  }

  /* ---------------------------------- */
  /* Owner view */
  /* ---------------------------------- */

  return (
    <div className="space-y-6">
      {/* PASSWORD CARD */}

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg text-wood-primary">
            <KeyRound className="size-5" />
            Change Password
          </CardTitle>

          <p className="text-sm text-muted-foreground">
            Change the password for your subscription
            account.
          </p>
        </CardHeader>

        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            {/* CURRENT PASSWORD */}

            <div className="space-y-2">
              <label
                htmlFor="current-password"
                className="text-sm font-medium"
              >
                Current Password
              </label>

              <Input
                id="current-password"
                type="password"
                value={currentPassword}
                onChange={(event) =>
                  setCurrentPassword(
                    event.target.value,
                  )
                }
                placeholder="Enter current password"
                autoComplete="current-password"
              />
            </div>

            {/* NEW PASSWORD */}

            <div className="space-y-2">
              <label
                htmlFor="new-password"
                className="text-sm font-medium"
              >
                New Password
              </label>

              <Input
                id="new-password"
                type="password"
                value={newPassword}
                onChange={(event) =>
                  setNewPassword(
                    event.target.value,
                  )
                }
                placeholder="Enter new password"
                autoComplete="new-password"
              />
            </div>

            {/* CONFIRM PASSWORD */}

            <div className="space-y-2">
              <label
                htmlFor="confirm-password"
                className="text-sm font-medium"
              >
                Confirm New Password
              </label>

              <Input
                id="confirm-password"
                type="password"
                value={confirmPassword}
                onChange={(event) =>
                  setConfirmPassword(
                    event.target.value,
                  )
                }
                placeholder="Confirm new password"
                autoComplete="new-password"
              />
            </div>
          </div>

          <div className="pt-4 flex justify-end">
            <Button
              type="button"
              onClick={handleChangePassword}
              disabled={isSaving}
              className="cursor-pointer"
            >
              <Save className="mr-2 size-4" />

              {isSaving
                ? "Changing..."
                : "Change Password"}
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg text-wood-primary">
            <Mail className="size-5" />
            Owner Recovery Email
          </CardTitle>

          <p className="text-sm text-muted-foreground">
            This personal email will be used to recover
            the Owner PIN if it is forgotten.
          </p>
        </CardHeader>

        <CardContent className="space-y-4">
          <div className="space-y-2">
            <label
              htmlFor="recovery-email"
              className="text-sm font-medium"
            >
              Recovery Email
            </label>

            <Input
              id="recovery-email"
              type="email"
              value={recoveryEmail}
              onChange={(event) =>
                setRecoveryEmail(
                  event.target.value,
                )
              }
              placeholder="Enter your personal email"
              autoComplete="email"
            />

            <p className="text-xs text-muted-foreground">
              Use an email address that only the account
              owner can access. Do not use the shared
              subscription email.
            </p>
          </div>

          <div className="flex items-center gap-2 rounded-md border p-3">
            <span
              className={
                securitySettings.recoveryEmailVerified
                ? "size-2 rounded-full bg-green-500"
                : "size-2 rounded-full bg-yellow-500"
              }
              />

            <span className="text-sm">
              {securitySettings.recoveryEmailVerified
                ? "Recovery email verified"
                : "Recovery email not verified"}
            </span>
          </div>
                {isOtpVerificationOpen &&
                  generatedOtp && (
                    <div className="rounded-md border border-dashed p-4">
                      <p className="text-sm font-medium">
                        Development OTP
                      </p>
    
                      <p className="mt-1 text-2xl font-bold tracking-widest">
                        {generatedOtp}
                      </p>
    
                      <p className="mt-1 text-xs text-muted-foreground">
                        This OTP is displayed only for local
                        development. It will be sent by email
                        when the backend is implemented.
                      </p>
                    </div>
                  )}
    
                  {isOtpVerificationOpen && (
                  <div className="space-y-4 rounded-md border p-4">
                    <div>
                      <p className="text-sm font-semibold">
                        Verify Recovery Email
                      </p>
    
                      <p className="text-xs text-muted-foreground">
                        Enter the 6-digit verification code for{" "}
                        <span className="font-medium">
                          {recoveryEmail}
                        </span>
                        .
                      </p>
                    </div>
    
                    <div className="space-y-2">
                      <label
                        htmlFor="recovery-email-otp"
                        className="text-sm font-medium"
                      >
                        Verification OTP
                      </label>
    
                      <Input
                        id="recovery-email-otp"
                        type="text"
                        inputMode="numeric"
                        maxLength={6}
                        value={otp}
                        onChange={(event) =>
                          setOtp(
                            event.target.value
                              .replace(/\D/g, "")
                              .slice(0, 6),
                          )
                        }
                        placeholder="Enter 6-digit OTP"
                        autoComplete="one-time-code"
                      />
                    </div>
    
                    <div className="flex justify-end gap-2">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => {
                          setOtp("");
                          setGeneratedOtp(null);
                          setIsOtpVerificationOpen(false);
                        }}
                        disabled={isVerifyingOtp}
                        className="cursor-pointer"
                      >
                        Cancel
                      </Button>
    
                      <Button
                        type="button"
                        onClick={handleVerifyOtp}
                        disabled={isVerifyingOtp}
                        className="cursor-pointer"
                      >
                        {isVerifyingOtp
                          ? "Verifying..."
                          : "Verify Email"}
                      </Button>
                    </div>
                  </div>
                )}

          <div className="flex justify-end">
            <Button
              type="button"
              onClick={handleSaveRecoveryEmail}
              disabled={isSavingRecoveryEmail}
              className="cursor-pointer"
            >
              <Save className="mr-2 size-4" />

              {isSavingRecoveryEmail
                ? "Saving..."
                : "Save Recovery Email"}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* PROFILE PIN CARD */}

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg text-wood-primary">
            <ShieldCheck className="size-5" />
            Profile PIN Protection
          </CardTitle>

          <p className="text-sm text-muted-foreground">
            Require a 4-digit PIN when switching
            to a protected profile.
          </p>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* ENABLE / DISABLE */}

          <div className="flex items-center justify-between rounded-md border p-4">
            <div className="space-y-1">
              <p className="text-sm font-medium">
                Enable PIN Protection
              </p>

              <p className="text-xs text-muted-foreground">
                Profiles will require their assigned
                PIN when switching profiles.
              </p>
            </div>

            <Button
              type="button"
              variant={
                securitySettings.pinEnabled
                  ? "default"
                  : "outline"
              }
              onClick={() =>
                handlePinSystemChange(
                  !securitySettings.pinEnabled,
                )
              }
              className="cursor-pointer"
            >
              {securitySettings.pinEnabled
                ? "Enabled"
                : "Disabled"}
            </Button>
          </div>

          {/* PROFILE PIN LIST */}

          <div className="space-y-4">
            <div>
              <h3 className="text-sm font-semibold">
                Profile PINs
              </h3>

              <p className="text-xs text-muted-foreground">
                Assign a unique 4-digit PIN to each
                active profile.
              </p>
            </div>

            {profiles.map((profile) => (
              <div
                key={profile.id}
                className="grid gap-3 rounded-md border p-4 md:grid-cols-[1fr_180px]"
              >
                <div className="flex flex-col justify-center">
                  <p className="text-sm font-medium">
                    {profile.name}
                  </p>

                  <p className="text-xs text-muted-foreground">
                    {profile.role === "OWNER"
                      ? "Owner"
                      : "User"}
                  </p>
                </div>

                <Input
                  type="password"
                  inputMode="numeric"
                  maxLength={4}
                  value={
                    pinValues[profile.id] ?? ""
                  }
                  onChange={(event) =>
                    handlePinChange(
                      profile.id,
                      event.target.value,
                    )
                  }
                  placeholder="4-digit PIN"
                  autoComplete="new-password"
                />
              </div>
            ))}
          </div>

          {/* SAVE PIN */}

          <div className="flex justify-end">
            <Button
              type="button"
              onClick={handleSavePins}
              disabled={isSavingPin}
              className="cursor-pointer"
            >
              <Save className="mr-2 size-4" />

              {isSavingPin
                ? "Saving..."
                : "Save PIN Settings"}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
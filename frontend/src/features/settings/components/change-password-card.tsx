import { useState } from "react";
import { KeyRound, Save } from "lucide-react";
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
  saveAccounts,
} from "@/features/auth/auth-storage";

export function ChangePasswordCard() {
  const { user } = useAuth();

  const [currentPassword, setCurrentPassword] =
    useState("");

  const [newPassword, setNewPassword] =
    useState("");

  const [confirmPassword, setConfirmPassword] =
    useState("");

  const [isSaving, setIsSaving] =
    useState(false);

  const canChangePassword =
    user?.platformRole === "SUBSCRIBER" &&
    user.profileRole === "OWNER";

  function resetForm() {
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
  }

  function handleChangePassword() {
    if (!canChangePassword) {
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
        item.id === user.accountId &&
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

      resetForm();

      toast.success(
        "Password changed successfully.",
      );
    } finally {
      setIsSaving(false);
    }
  }

  if (!canChangePassword) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg text-wood-primary">
            <KeyRound className="size-5" />
            Security
          </CardTitle>

          <p className="text-sm text-muted-foreground">
            Password settings are managed by the
            account owner.
          </p>
        </CardHeader>

        <CardContent>
          <div className="rounded-md border border-dashed p-6 text-center text-sm text-muted-foreground">
            Only the account owner can change the
            subscription password.
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg text-wood-primary">
          <KeyRound className="size-5" />
          Security
        </CardTitle>

        <p className="text-sm text-muted-foreground">
          Change the password for your subscription
          account.
        </p>
      </CardHeader>

      <CardContent>
        <div className="flex justify-between gap-4 space-y-4">
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
          <div className="pt-2 flex justify-end">
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
  );
}
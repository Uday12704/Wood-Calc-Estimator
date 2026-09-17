import { useEffect, useState } from "react";
import {
  Pencil,
  Plus,
  Save,
  Trash2,
  Users,
  X,
} from "lucide-react";
import { toast } from "react-toastify";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

import { useAuth } from "@/features/auth/auth-context";
import {
  getProfiles,
  saveProfiles,
} from "@/features/auth/auth-storage";
import type { AppProfile } from "@/features/auth/types";
import { createNotification } from "@/features/notifications/notification-storage";

interface UserForm {
  name: string;
  active: boolean;
}

const EMPTY_FORM: UserForm = {
  name: "",
  active: true,
};

const MAX_PROFILES = 3;

export function UserManagementCard() {
  const { user } = useAuth();

  const [profiles, setProfiles] = useState<AppProfile[]>(
    [],
  );

  const [form, setForm] =
    useState<UserForm>(EMPTY_FORM);

  const [editingId, setEditingId] =
    useState<string | null>(null);

  /*
   * Only the subscriber account owner
   * can manage profiles.
   */
  const canManageUsers =
    user?.platformRole === "SUBSCRIBER" &&
    user.profileRole === "OWNER";

  useEffect(() => {
    if (!user?.accountId) {
      setProfiles([]);
      return;
    }

    const accountProfiles = getProfiles().filter(
      (profile) =>
        profile.accountId === user.accountId,
    );

    setProfiles(accountProfiles);
  }, [user?.accountId]);

  const isEditing = editingId !== null;

  const profileLimitReached =
    profiles.length >= MAX_PROFILES;

  function resetForm() {
    setForm(EMPTY_FORM);
    setEditingId(null);
  }

  function updateForm(
    field: keyof UserForm,
    value: string | boolean,
  ) {
    setForm((current) => ({
      ...current,
      [field]: value,
    }));
  }

  function handleAdd() {
    if (!canManageUsers) {
      toast.error(
        "Only the account owner can manage users.",
      );
      return;
    }

    if (profileLimitReached) {
      toast.error(
        "Maximum of 3 profiles is allowed.",
      );
      return;
    }

    const name = form.name.trim();

    if (!name) {
      toast.error("User name is required.");
      return;
    }

    const duplicateName = profiles.some(
      (profile) =>
        profile.name.toLowerCase() ===
        name.toLowerCase(),
    );

    if (duplicateName) {
      toast.error(
        "A user with this name already exists.",
      );
      return;
    }

    const newProfile: AppProfile = {
      id: crypto.randomUUID(),
      accountId: user!.accountId,
      name,
      role: "USER",
      active: form.active,
      createdAt: new Date().toISOString(),
    };

    const allProfiles = getProfiles();

    const updatedProfiles = [
      ...allProfiles,
      newProfile,
    ];

    saveProfiles(updatedProfiles);

    setProfiles((current) => [
      ...current,
      newProfile,
    ]);

    createNotification({
      accountId: user.accountId,
      createdBy: user.profileId,
      title: "User Alert",
      message: `Profile "${newProfile.name}" was added successfully.`,
      type: "SYSTEM",
      priority: "HIGH",
      notificationKey: `profile-added-${user.accountId}-${Date.now()}`,
    });

    toast.success(
      "User added successfully.",
    );

    resetForm();
  }

  function handleEdit(profile: AppProfile) {
    if (!canManageUsers) {
      toast.error(
        "Only the account owner can manage users.",
      );
      return;
    }

    if (profile.role === "OWNER") {
      toast.error(
        "The account owner cannot be edited as another user.",
      );
      return;
    }

    setEditingId(profile.id);

    setForm({
      name: profile.name,
      active: profile.active,
    });
  }

  function handleUpdate() {
    if (!canManageUsers) {
      toast.error(
        "Only the account owner can manage users.",
      );
      return;
    }

    if (!editingId) {
      return;
    }

    const name = form.name.trim();

    if (!name) {
      toast.error("User name is required.");
      return;
    }

    const duplicateName = profiles.some(
      (profile) =>
        profile.id !== editingId &&
        profile.name.toLowerCase() ===
          name.toLowerCase(),
    );

    if (duplicateName) {
      toast.error(
        "A user with this name already exists.",
      );
      return;
    }

    const allProfiles = getProfiles();

    const updatedProfiles = allProfiles.map(
      (profile) =>
        profile.id === editingId
          ? {
              ...profile,
              name,
              active: form.active,
            }
          : profile,
    );

    saveProfiles(updatedProfiles);

    setProfiles((current) =>
      current.map((profile) =>
        profile.id === editingId
          ? {
              ...profile,
              name,
              active: form.active,
            }
          : profile,
      ),
    );

    createNotification({
      accountId: user.accountId,
      createdBy: user.profileId,
      title: "User Alert",
      message:
        `Profile "${name}" was updated successfully.`,
      type: "SYSTEM",
      priority: "HIGH",
      notificationKey: `profile-updated-${user.accountId}-${editingId}-${Date.now()}`,
    });

    toast.success(
      "User updated successfully.",
    );

    resetForm();
  }

  function handleDelete(profile: AppProfile) {
    if (!canManageUsers) {
      toast.error(
        "Only the account owner can manage users.",
      );
      return;
    }

    if (profile.role === "OWNER") {
      toast.error(
        "The account owner cannot be removed.",
      );
      return;
    }

    const confirmed = window.confirm(
      `Are you sure you want to remove "${profile.name}"?`,
    );

    if (!confirmed) {
      return;
    }

    const allProfiles = getProfiles();

    const updatedProfiles = allProfiles.filter(
      (item) => item.id !== profile.id,
    );

    saveProfiles(updatedProfiles);

    setProfiles((current) =>
      current.filter(
        (item) => item.id !== profile.id,
      ),
    );

    createNotification({
      accountId: user.accountId,
      createdBy: user.profileId,
      title: "Security Alert",
      message:
        `Profile "${profile.name}" was removed successfully.`,
      type: "SYSTEM",
      priority: "HIGH",
      notificationKey: `profile-deleted-${user.accountId}-${profile.id}-${Date.now()}`,
    });

    if (editingId === profile.id) {
      resetForm();
    }

    toast.success(
      "User removed successfully.",
    );
  }

  /*
   * User 2 and User 3 can see the profiles,
   * but they cannot modify them.
   */
  if (!canManageUsers) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg text-wood-primary">
            <Users className="size-5" />
            User Management
          </CardTitle>

          <p className="text-sm text-muted-foreground">
            Only the account owner can manage
            users.
          </p>
        </CardHeader>

        <CardContent>
          {profiles.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              No users configured.
            </p>
          ) : (
            <div className="overflow-hidden rounded-lg border">
              {profiles.map((profile) => (
                <div
                  key={profile.id}
                  className="flex items-center justify-between border-b px-4 py-3 last:border-b-0"
                >
                  <div>
                    <p className="text-sm font-medium">
                      {profile.name}
                    </p>

                    <p className="text-xs text-muted-foreground">
                      {profile.role === "OWNER"
                        ? "Owner"
                        : "User"}
                    </p>
                  </div>

                  <Badge
                    variant={
                      profile.active
                        ? "success"
                        : "secondary"
                    }
                  >
                    {profile.active
                      ? "Active"
                      : "Inactive"}
                  </Badge>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between gap-3 text-lg">
          <span className="flex items-center gap-2 text-wood-primary">
            <Users className="size-5" />
            User Management
          </span>

          <Badge
            variant={
              profileLimitReached
                ? "destructive"
                : "secondary"
            }
          >
            {profiles.length} / {MAX_PROFILES}
          </Badge>
        </CardTitle>

        <p className="text-sm text-muted-foreground">
          Manage the users who can access this
          subscription account. Maximum 3 profiles
          are allowed.
        </p>
      </CardHeader>

      <CardContent className="space-y-5">
        {/* USER FORM */}

        <div className="rounded-lg border bg-muted/20 p-4">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h3 className="text-sm font-semibold">
                {isEditing
                  ? "Edit User"
                  : "Add User"}
              </h3>

              <p className="mt-0.5 text-xs text-muted-foreground">
                {isEditing
                  ? "Update the selected user's profile."
                  : "Create a new user profile."}
              </p>
            </div>

            {isEditing && (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={resetForm}
                className="cursor-pointer"
              >
                <X className="mr-1.5 size-4" />
                Cancel
              </Button>
            )}
          </div>

          <div className="grid gap-4 md:grid-cols-[1fr_160px_auto] md:items-end">
            {/* NAME */}

            <div className="space-y-2">
              <label
                htmlFor="user-name"
                className="text-sm font-medium"
              >
                Name
              </label>

              <Input
                id="user-name"
                value={form.name}
                onChange={(event) =>
                  updateForm(
                    "name",
                    event.target.value,
                  )
                }
                placeholder="User name"
              />
            </div>

            {/* STATUS */}

            <div className="space-y-2">
              <label className="text-sm font-medium">
                Status
              </label>

              <label className="flex h-10 cursor-pointer items-center gap-2 rounded-md border bg-background px-3 text-sm">
                <input
                  type="checkbox"
                  checked={form.active}
                  onChange={(event) =>
                    updateForm(
                      "active",
                      event.target.checked,
                    )
                  }
                  className="size-4"
                />

                Active
              </label>
            </div>

            {/* ACTION */}

            <Button
              type="button"
              onClick={
                isEditing
                  ? handleUpdate
                  : handleAdd
              }
              className="cursor-pointer"
              disabled={
                !isEditing &&
                profileLimitReached
              }
            >
              {isEditing ? (
                <>
                  <Save className="mr-2 size-4" />
                  Update
                </>
              ) : (
                <>
                  <Plus className="mr-2 size-4" />
                  Add User
                </>
              )}
            </Button>
          </div>

          {profileLimitReached &&
            !isEditing && (
              <p className="mt-3 text-xs text-destructive">
                Maximum profile limit reached.
                Remove an existing user to add
                another.
              </p>
            )}
        </div>

        {/* USER LIST */}

        {profiles.length === 0 ? (
          <div className="rounded-lg border border-dashed p-8 text-center">
            <Users className="mx-auto mb-3 size-8 text-muted-foreground" />

            <h3 className="text-sm font-semibold">
              No users configured
            </h3>

            <p className="mt-1 text-xs text-muted-foreground">
              Add your first user above.
            </p>
          </div>
        ) : (
          <div className="overflow-hidden rounded-lg border">
            {/* HEADER */}

            <div className="hidden grid-cols-[1fr_140px_120px_100px] border-b bg-muted/40 px-4 py-2.5 text-xs font-medium text-muted-foreground sm:grid">
              <span>Name</span>
              <span>Role</span>
              <span>Status</span>
              <span className="text-right">
                Actions
              </span>
            </div>

            {/* ROWS */}

            {profiles.map((profile) => (
              <div
                key={profile.id}
                className="grid gap-3 border-b px-4 py-3 last:border-b-0 sm:grid-cols-[1fr_140px_120px_100px] sm:items-center"
              >
                <div>
                  <p className="text-sm font-medium">
                    {profile.name}
                  </p>
                </div>

                <div>
                  <Badge variant="outline">
                    {profile.role === "OWNER"
                      ? "Owner"
                      : "User"}
                  </Badge>
                </div>

                <div>
                  <Badge
                    variant={
                      profile.active
                        ? "success"
                        : "secondary"
                    }
                  >
                    {profile.active
                      ? "Active"
                      : "Inactive"}
                  </Badge>
                </div>

                <div className="flex justify-end gap-1">
                  {profile.role === "USER" && (
                    <>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() =>
                          handleEdit(profile)
                        }
                        title="Edit user"
                      >
                        <Pencil className="size-4" />
                      </Button>

                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() =>
                          handleDelete(profile)
                        }
                        title="Remove user"
                        className="text-destructive hover:text-destructive"
                      >
                        <Trash2 className="size-4" />
                      </Button>
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
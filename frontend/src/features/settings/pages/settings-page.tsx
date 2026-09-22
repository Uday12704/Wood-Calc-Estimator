import {
  Settings,
} from "lucide-react";

import { BusinessInfoCard } from "../components/business-info-card";
import { WoodCategoryCard } from "../components/wood-category-card";
import { UserManagementCard } from "../components/user-management-card";
import { ChangePasswordCard } from "../components/change-password-card";
import { PrintSettingsCard } from "../components/print-settings-card";

export function SettingsPage() {
  return (
    <div className="space-y-6">
      {/* PAGE HEADER */}

      <div>
        <h1 className="text-2xl font-semibold tracking-tight">
          <span className="flex items-center gap-2 text-wood-secondary"><Settings /> Settings</span>
        </h1>

        <p className="mt-1 text-sm text-muted-foreground">
          Manage your business, wood categories, users, print preferences,
          and security settings.
        </p>
      </div>

      {/* BUSINESS INFORMATION */}
      <BusinessInfoCard />

      {/* WOOD CATEGORIES */}
      <WoodCategoryCard />

      {/* PRINT SETTINGS */}
      <PrintSettingsCard />

      {/* USER MANAGEMENT */}
      <UserManagementCard />

      {/* CHANGE PASSWORD */}
      <ChangePasswordCard />
    </div>
  );
}
import { useEffect, useRef, useState } from "react";
import { Building2, ImagePlus, Save, Trash2 } from "lucide-react";
import { toast } from "react-toastify";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

import {
  getBusinessSettings,
  saveBusinessSettings,
} from "../services/settings-storage";

import type { BusinessSettings } from "../types";
import { useAuth } from "@/features/auth/auth-context";

export function BusinessInfoCard() {
  const { user } = useAuth();
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const [form, setForm] = useState<BusinessSettings>(() =>
    user?.accountId
      ? getBusinessSettings(user.accountId)
      : {
          businessName: "",
          phone: "",
          address: "",
          gstin: "",
          logo: "",
        },
  );

  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (!user?.accountId) {
      return;
    }

    setForm(getBusinessSettings(user.accountId));
  }, [user?.accountId]);

  function updateField(
    field: keyof BusinessSettings,
    value: string,
  ) {
    setForm((current) => ({
      ...current,
      [field]: value,
    }));
  }

  function handleLogoUpload(
    event: React.ChangeEvent<HTMLInputElement>,
  ) {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    if (!file.type.startsWith("image/")) {
      toast.error("Please select a valid image file.");
      return;
    }

    const maxSize = 2 * 1024 * 1024;

    if (file.size > maxSize) {
      toast.error("Logo size must be less than 2 MB.");
      return;
    }

    const reader = new FileReader();

    reader.onload = () => {
      const result = reader.result;

      if (typeof result !== "string") {
        toast.error("Failed to read the logo.");
        return;
      }

      setForm((current) => ({
        ...current,
        logo: result,
      }));
    };

    reader.onerror = () => {
      toast.error("Failed to upload the logo.");
    };

    reader.readAsDataURL(file);
  }

  function handleRemoveLogo() {
    setForm((current) => ({
      ...current,
      logo: "",
    }));

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  }

  function handleSave() {
    const businessName = form.businessName.trim();

    if (!businessName) {
      toast.error("Business name is required.");
      return;
    }

    setIsSaving(true);

    try {
      if (!user?.accountId) {
        toast.error("Unable to identify the subscriber account.");
        return;
      }

      saveBusinessSettings(user.accountId, {
        ...form,
        businessName,
        phone: form.phone.trim(),
        address: form.address.trim(),
        gstin: form.gstin.trim(),
      });

      toast.success("Business information saved successfully.");
    } catch (error) {
      console.error(
        "Failed to save business information:",
        error,
      );

      toast.error(
        "Failed to save business information.",
      );
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg text-wood-primary">
          <Building2 className="size-5" />
          Business Information
        </CardTitle>

        <p className="text-sm text-muted-foreground">
          Manage the business details used throughout the
          application and printed documents.
        </p>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* BUSINESS NAME + PHONE */}

        <div className="grid gap-5 md:grid-cols-2">
          <div className="space-y-2">
            <label
              htmlFor="business-name"
              className="text-sm font-medium"
            >
              Business Name <span className="text-red-500">*</span>
            </label>

            <Input
              id="business-name"
              value={form.businessName}
              required
              onChange={(event) =>
                updateField(
                  "businessName",
                  event.target.value,
                )
              }
              placeholder="Enter business name"
            />
          </div>

          <div className="space-y-2">
            <label
              htmlFor="business-phone"
              className="text-sm font-medium"
            >
              Phone Number
            </label>

            <Input
              id="business-phone"
              value={form.phone}
              onChange={(event) =>
                updateField(
                  "phone",
                  event.target.value,
                )
              }
              placeholder="Enter phone number"
              type="tel"
            />
          </div>
        </div>

        {/* ADDRESS */}

        <div className="space-y-2">
          <label
            htmlFor="business-address"
            className="text-sm font-medium"
          >
            Address
          </label>

          <Textarea
            id="business-address"
            value={form.address}
            onChange={(event) =>
              updateField(
                "address",
                event.target.value,
              )
            }
            placeholder="Enter business address"
            rows={4}
          />
        </div>

        {/* GSTIN + LOGO */}

        <div className="grid gap-5 md:grid-cols-2">
          {/* GSTIN */}

          <div className="space-y-2">
            <label
              htmlFor="business-gstin"
              className="text-sm font-medium"
            >
              GSTIN
            </label>

            <Input
              id="business-gstin"
              value={form.gstin}
              onChange={(event) =>
                updateField(
                  "gstin",
                  event.target.value.toUpperCase(),
                )
              }
              placeholder="Enter GSTIN"
            />
          </div>

          {/* LOGO */}

          <div className="space-y-2">
            <label className="text-sm font-medium">
              Logo
            </label>

            <div className="flex flex-wrap items-center gap-3">
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleLogoUpload}
              />

              <Button
                type="button"
                variant="outline"
                onClick={() =>
                  fileInputRef.current?.click()
                }
                className="cursor-pointer"
              >
                <ImagePlus className="mr-2 size-4" />
                Upload Logo
              </Button>

              {form.logo && (
                <>
                  <div className="flex size-12 items-center justify-center overflow-hidden rounded-md border bg-muted">
                    <img
                      src={form.logo}
                      alt="Business logo"
                      className="max-h-full max-w-full object-contain"
                    />
                  </div>

                  <Button
                    type="button"
                    variant="ghost"
                    onClick={handleRemoveLogo}
                    className="text-destructive hover:text-destructive cursor-pointer border-gray"
                  >
                    <Trash2 className="mr-2 size-4" />
                    Remove
                  </Button>
                </>
              )}
            </div>

            <p className="text-xs text-muted-foreground">
              JPG, PNG, WEBP or other image formats. Maximum
              size: 2 MB.
            </p>
          </div>
        </div>

        {/* SAVE */}

        <div className="flex justify-end border-t pt-5">
          <Button
            type="button"
            onClick={handleSave}
            disabled={isSaving}
            className="cursor-pointer"
          >
            <Save className="mr-2 size-4" />

            {isSaving
              ? "Saving..."
              : "Save Business Information"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
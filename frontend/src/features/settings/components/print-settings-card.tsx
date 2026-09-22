
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { useAuth } from "@/features/auth/auth-context";
import {
    getBusinessSettings,
  getPrintSettings,
  savePrintSettings,
} from "../services/settings-storage";

import type { BusinessNameFont } from "../types";
import { Printer } from "lucide-react";

const FONT_OPTIONS: { label: string; value: BusinessNameFont }[] = [
  { label: "Helvetica", value: "Helvetica" },
  { label: "Times Roman", value: "Times-Roman" },
  { label: "Courier", value: "Courier" },
  { label: "Helvetica Bold", value: "Helvetica-Bold" },
  { label: "Times Bold", value: "Times-Bold" },
  { label: "Courier Bold", value: "Courier-Bold" },
  { label: "Helvetica Oblique", value: "Helvetica-Oblique" },
  { label: "Times Italic", value: "Times-Italic" },
  { label: "Courier Oblique", value: "Courier-Oblique" },
  { label: "Helvetica Bold Oblique", value: "Helvetica-BoldOblique" },
];

export function PrintSettingsCard() {
  const { user } = useAuth();
  const accountId = user?.accountId ?? "";

  const [termsAndConditions, setTermsAndConditions] = useState("");
  const [businessName, setBusinessName] = useState("");
  const [businessNameFont, setBusinessNameFont] =
    useState<BusinessNameFont>("Helvetica");

  useEffect(() => {
    if (!accountId) return;

    const settings = getPrintSettings(accountId);

    setTermsAndConditions(settings.termsAndConditions);

    const business = getBusinessSettings(accountId);
    setBusinessName(business.businessName?.trim() || "");
    setBusinessNameFont(settings.businessNameFont);
  }, [accountId]);

  function handleSave() {
    if (!accountId) {
      toast.error("Unable to identify your account.");
      return;
    }

    savePrintSettings(accountId, {
      termsAndConditions,
      businessNameFont,
    });

    toast.success("Print settings saved successfully.");
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex gap-2 items-center text-wood-primary text-lg">
            <Printer />Print Settings
        </CardTitle>
        <CardDescription>
          Customize the terms and business name appearance on your estimate PDFs.
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="terms-and-conditions" className="font-semibold">
            Terms & Conditions
          </Label>

          <Textarea
            id="terms-and-conditions"
            placeholder="Enter your terms and conditions..."
            value={termsAndConditions}
            onChange={(event) =>
              setTermsAndConditions(event.target.value)
            }
            rows={6}
          />

          <p className="text-xs text-muted-foreground">
            These terms will be included in your estimate PDFs.
          </p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="business-name-font" className="font-semibold">
            Business Name Font
          </Label>

          <Select
            value={businessNameFont}
            onValueChange={(value) =>
              setBusinessNameFont(value as BusinessNameFont)
            }
          >
            <SelectTrigger id="business-name-font">
              <SelectValue placeholder="Select a font" />
            </SelectTrigger>

            <SelectContent>
              {FONT_OPTIONS.map((font) => (
                <SelectItem
                  key={font.value}
                  value={font.value}
                >
                  {font.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <div className="rounded-md border p-4">
            <p className="text-xs text-muted-foreground mb-2">
              Business name preview
            </p>

            <p
              className="text-xl"
              style={{
                fontFamily:
                  businessNameFont.startsWith("Times")
                    ? "serif"
                    : businessNameFont.startsWith("Courier")
                      ? "monospace"
                      : "Arial, sans-serif",
                fontWeight: businessNameFont.includes("Bold")
                  ? "bold"
                  : "normal",
                fontStyle:
                  businessNameFont.includes("Oblique") ||
                  businessNameFont.includes("Italic")
                    ? "italic"
                    : "normal",
              }}
            >
              {businessName || "Sample Business Name"}
            </p>
          </div>
        </div>

        <Button onClick={handleSave}>
          Save Print Settings
        </Button>
      </CardContent>
    </Card>
  );
}
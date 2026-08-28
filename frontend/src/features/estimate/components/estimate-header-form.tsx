import type { ChangeEvent } from "react";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import type { EstimateHeader } from "../types";
import { Badge } from "@/components/ui/badge";

interface EstimateHeaderFormProps {
  value: EstimateHeader;
  onChange: (
    value: EstimateHeader,
  ) => void;
}

export function EstimateHeaderForm({
  value,
  onChange,
}: EstimateHeaderFormProps) {
  function handleChange(
    field: keyof EstimateHeader,
    event: ChangeEvent<HTMLInputElement>,
  ) {
    onChange({
      ...value,
      [field]: event.target.value,
    });
  }

  return (
    <Card>
      <CardHeader>

        <div className="flex justify-between">
            <CardTitle className="text-lg font-semibold">
            Document Information
            </CardTitle>
            
            <div className="flex items-center gap-3 rounded-lg border bg-muted/30 p-3">
                <span className="text-sm font-medium">
                    Status
                </span>

                <Badge
                 variant={value.status === "ON_HOLD" ? "warning" : "success"}>
                  {value.status}
                </Badge>
            </div>

        </div>
        
      </CardHeader>

      <CardContent className="space-y-6">

        {/* DOCUMENT DETAILS */}

        <div className="grid gap-4 md:grid-cols-3">

          <div className="space-y-2">
            <Label htmlFor="document-title">
              Document Title
            </Label>

            <Input
              id="document-title"
              value={value.documentTitle}
              onChange={(event) =>
                handleChange(
                  "documentTitle",
                  event,
                )
              }
              placeholder="Estimate"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="estimate-number">
              Estimate Number
            </Label>

            <Input
              id="estimate-number"
              value={value.estimateNumber}
              readOnly
              className="bg-muted"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="estimate-date">
              Date
            </Label>

            <Input
              id="estimate-date"
              type="date"
              value={value.date}
              onChange={(event) =>
                handleChange(
                  "date",
                  event,
                )
              }
            />
          </div>

        </div>

        {/* PARTY DETAILS */}

        <div className="grid gap-4 md:grid-cols-3">

          <div className="space-y-2">
            <Label htmlFor="party-name">
              Party Name
              <span className="ml-1 text-destructive">
                *
              </span>
            </Label>

            <Input
              id="party-name"
              value={value.partyName}
              onChange={(event) =>
                handleChange(
                  "partyName",
                  event,
                )
              }
              placeholder="Enter customer / party name"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="contact-number">
              Contact Number
            </Label>

            <Input
              id="contact-number"
              type="tel"
              value={value.contactNumber}
              onChange={(event) =>
                handleChange(
                  "contactNumber",
                  event,
                )
              }
              placeholder="Enter contact number"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="reference">
              Reference
            </Label>

            <Input
              id="reference"
              value={value.reference}
              onChange={(event) =>
                handleChange(
                  "reference",
                  event,
                )
              }
              placeholder="Optional reference"
            />
          </div>

        </div>

        {/* STATUS */}

      </CardContent>
    </Card>
  );
}
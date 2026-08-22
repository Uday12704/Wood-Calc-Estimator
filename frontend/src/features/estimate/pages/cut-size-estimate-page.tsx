import { useState } from "react";

import {
  EstimateHeaderForm,
} from "../components/estimate-header-form";

import type {
  EstimateHeader,
} from "../types";

import {
  generateEstimateNumber,
} from "../utils/estimate-number";

import {
  getTodayDate,
} from "../utils/date";

export function CutSizeEstimatePage() {
  const [header, setHeader] =
    useState<EstimateHeader>(() => ({
      documentTitle: "Cut Size Estimate",
      estimateNumber:
        generateEstimateNumber(),
      date: getTodayDate(),
      partyName: "",
      contactNumber: "",
      reference: "",
      status: "ON_HOLD",
    }));

  return (
    <div className="space-y-6">

      {/* PAGE HEADER */}

      <div>
        <h1 className="text-2xl font-semibold tracking-tight">
          Cut Size Estimate
        </h1>

        <p className="mt-1 text-sm text-muted-foreground">
          Create a new cut-size wood estimate.
        </p>
      </div>

      {/* ESTIMATE HEADER */}

      <EstimateHeaderForm
        value={header}
        onChange={setHeader}
      />

    </div>
  );
}
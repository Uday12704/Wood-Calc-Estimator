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

export function RoundSizeEstimatePage() {
  const [header, setHeader] =
    useState<EstimateHeader>(() => ({
      documentTitle: "Round Size Estimate",
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
          Round Size Estimate
        </h1>

        <p className="mt-1 text-sm text-muted-foreground">
          Create a new round-size wood estimate.
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
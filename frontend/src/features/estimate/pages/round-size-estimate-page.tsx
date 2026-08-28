import { useState } from "react";

import {
  EstimateHeaderForm,
} from "../components/estimate-header-form";

import type {
  EstimateHeader,
  RoundSizeItem,
} from "../types";

import {
  generateEstimateNumber,
} from "../utils/estimate-number";

import {
  getTodayDate,
} from "../utils/date";
import { RoundSizeItemsTable } from "../components/round-size-items-table";
import { woodCategories } from "../data/wood-categories";

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

  const [items, setItems] =
    useState<RoundSizeItem[]>([
      {
        id: crypto.randomUUID(),

        woodType: "",
        logNo: "",
        length: "",
        girth: "",

        cbm: 0,
        cft: 0,

        note: "",
      },
    ]);

    const [cftEnabled, setCftEnabled] = useState(false);

    const [pricePerCbm, setPricePerCbm] = useState<number | "">("");

    const totalCbm = items.reduce(
      (sum, item) =>
        sum + item.cbm,
      0,
    );

    const totalCft = cftEnabled
      ? items.reduce(
          (sum, item) =>
            sum + item.cft,
          0,
        )
      : 0;

    const roundedTotalCbm =
      Number(totalCbm.toFixed(3));

    const roundedTotalCft =
      Number(totalCft.toFixed(2));

    const subtotal =
      roundedTotalCbm *
      (pricePerCbm === ""
        ? 0
        : pricePerCbm);

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

      <RoundSizeItemsTable
        items={items}
        categories={woodCategories}
        cftEnabled={cftEnabled}
        onCftEnabledChange={
          setCftEnabled
        }
        onChange={setItems}
      />

    </div>
  );
}
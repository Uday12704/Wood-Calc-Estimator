import { useState } from "react";

import {
  EstimateHeaderForm,
} from "../components/estimate-header-form";

import {
  WoodItemsTable,
} from "../components/wood-items-table";

import {
  woodCategories,
} from "../data/wood-categories";

import type {
  EstimateHeader,
  WoodItem,
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
      documentTitle: "Estimate",
      estimateNumber:
        generateEstimateNumber(),
      date: getTodayDate(),
      partyName: "",
      contactNumber: "",
      reference: "",
      status: "ON_HOLD",
    }));

  const [items, setItems] =
    useState<WoodItem[]>([
      {
        id: crypto.randomUUID(),

        breadth: "",
        height: "",

        woodType: "",

        pricePerUnit: "",

        length: "",
        quantity: 1,

        note: "",

        totalCft: 0,
        lineTotal: 0,
      },
    ]);

  return (
    <div className="space-y-6">

      <div>
        <h1 className="text-2xl font-semibold tracking-tight">
          New Estimate
        </h1>

        <p className="mt-1 text-sm text-muted-foreground">
          Build, calculate and share in
          seconds.
        </p>
      </div>

      <EstimateHeaderForm
        value={header}
        onChange={setHeader}
      />

      <WoodItemsTable
        items={items}
        categories={woodCategories}
        onChange={setItems}
      />

    </div>
  );
}
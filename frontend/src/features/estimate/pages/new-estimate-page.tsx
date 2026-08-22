import {
  useNavigate,
} from "react-router-dom";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import {
  EstimateTypeSelector,
} from "../components/estimate-type-selector";

import type {
  EstimateType,
} from "../types";

export function NewEstimatePage() {
  const navigate = useNavigate();

  function handleTypeSelect(
    type: EstimateType,
  ) {
    if (type === "CUT_SIZE") {
      navigate(
        "/app/estimates/new/cut-size",
      );

      return;
    }

    navigate(
      "/app/estimates/new/round-size",
    );
  }

  return (
    <div className="space-y-6">

      {/* PAGE HEADER */}

      <div>
        <h1 className="text-2xl font-semibold tracking-tight">
          New Estimate
        </h1>

        <p className="mt-1 text-sm text-muted-foreground">
          Choose the type of wood estimate
          you want to create.
        </p>
      </div>


      {/* TYPE SELECTION */}

      <Card>

        <CardHeader>
          <CardTitle className="text-lg font-semibold">
            Select Estimate Type
          </CardTitle>

          <CardDescription>
            Choose the calculation method
            based on the type of wood.
          </CardDescription>
        </CardHeader>

        <CardContent>

          <EstimateTypeSelector
            onSelect={handleTypeSelect}
          />

        </CardContent>

      </Card>

    </div>
  );
}
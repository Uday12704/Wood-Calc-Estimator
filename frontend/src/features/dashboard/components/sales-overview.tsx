import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

import {
  Bar,
  BarChart,
  CartesianGrid,
  XAxis,
} from "recharts";

import type { SalesData } from "../types";
import { formatCurrency } from "@/lib/formatters";

interface SalesOverviewProps {
  data: SalesData[];
}

const chartConfig = {
  sales: {
    label: "Sales",
  },
};

export function SalesOverview({
  data,
}: SalesOverviewProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>
          Sales Overview
        </CardTitle>

        <CardDescription>
          Confirmed sales over the last 6 months
        </CardDescription>
      </CardHeader>

      <CardContent>
        <ChartContainer
          config={chartConfig}
          className="h-[300px] w-full"
        >
          <BarChart
            accessibilityLayer
            data={data}
            margin={{
              left: 12,
              right: 12,
            }}
          >
            <CartesianGrid
              vertical={false}
            />

            <XAxis
              dataKey="month"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
            />

            <ChartTooltip
              cursor={false}
              content={
                <ChartTooltipContent
                  formatter={(value) => 
                    formatCurrency(Number(value))
                  }
                />
              }
            />

            <Bar
              dataKey="sales"
              radius={6}
              fill="var(--wood-secondary)"
            />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
import { useState } from "react";

import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";

import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";

import UnitConverter from "./unitConverter";
import NumericCalculator from "./numericCalculator";
import CftCalculator from "./cftCalculator";

interface CalculatorDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function CalculatorDrawer({
  open,
  onOpenChange,
}: CalculatorDrawerProps) {
  const [activeTool, setActiveTool] =
    useState("unit");

  return (
    <Drawer
      open={open}
      onOpenChange={onOpenChange}
      swipeDirection="right"
    >
      <DrawerContent className="h-full w-full sm:max-w-md">
        <DrawerHeader>
          <DrawerTitle>Quick Calculator</DrawerTitle>

          <DrawerDescription>
            Quick tools for measurements and
            calculations.
          </DrawerDescription>
        </DrawerHeader>

        <div className="flex-1 overflow-y-auto px-4 py-2">
          <Tabs
            value={activeTool}
            onValueChange={setActiveTool}
            className="w-full"
          >
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="unit">
                Unit Converter
              </TabsTrigger>

              <TabsTrigger value="numeric">
                Numeric
              </TabsTrigger>

              <TabsTrigger value="cft">
                CFT
              </TabsTrigger>
            </TabsList>

            <TabsContent
              value="unit"
              className="mt-5"
            >
              <UnitConverter />
            </TabsContent>

            <TabsContent
              value="numeric"
              className="mt-5"
            >
              <NumericCalculator />
            </TabsContent>

            <TabsContent
              value="cft"
              className="mt-5"
            >
              <CftCalculator />
            </TabsContent>
          </Tabs>
        </div>
      </DrawerContent>
    </Drawer>
  );
}
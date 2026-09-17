import { useState } from "react";
import { Outlet } from "react-router-dom";

import {
  SidebarInset,
  SidebarProvider,
} from "@/components/ui/sidebar";

import { AppSidebar } from "@/components/common/app-sidebar";
import { AppNavbar } from "@/components/common/app-navbar";
import CalculatorDrawer from "@/components/calculator/calculatorDrawer";

export function DashboardLayout() {
  const [calculatorOpen, setCalculatorOpen] =
    useState(false);

  return (
    <SidebarProvider>
      <AppSidebar
        onCalculatorOpen={() =>
          setCalculatorOpen(true)
        }
      />

      <SidebarInset>
        <AppNavbar 
          onCalculatorOpen={() =>
            setCalculatorOpen(true)
          }
      />

        <main className="flex-1 p-4 md:p-6">
          <Outlet />
        </main>

        <CalculatorDrawer
          open={calculatorOpen}
          onOpenChange={setCalculatorOpen}
        />
      </SidebarInset>
    </SidebarProvider>
  );
}
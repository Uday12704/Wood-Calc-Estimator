
import { Outlet } from "react-router-dom";

import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";

import { Separator } from "@/components/ui/separator";
import AdminSidebar from "@/features/admin/components/admin-sidebar";

export function AdminLayout() {
  return (
    <SidebarProvider>
      <AdminSidebar />

      <SidebarInset>
        <header className="flex h-14 shrink-0 items-center gap-2 border-b px-4">
          <SidebarTrigger />

          <Separator orientation="vertical" className="mr-2 h-4" />

          <div className="flex flex-1 items-center">
            <span className="text-sm font-semibold">
              Wood Calc Admin
            </span>
          </div>
        </header>

        <main className="min-w-0 flex-1">
          <Outlet />
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}

export default AdminLayout;
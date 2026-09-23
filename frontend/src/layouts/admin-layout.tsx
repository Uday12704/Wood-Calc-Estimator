import { Outlet } from "react-router-dom";

import {
  SidebarInset,
  SidebarProvider,
} from "@/components/ui/sidebar";

import AdminSidebar from "@/features/admin/components/admin-sidebar";
import AdminNavbar from "@/features/admin/components/admin-navbar";

export function AdminLayout() {
  return (
    <SidebarProvider>
      <AdminSidebar />

      <SidebarInset>
        <AdminNavbar />

        <main className="min-w-0 flex-1">
          <Outlet />
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}

export default AdminLayout;
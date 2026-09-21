
import {
  LayoutDashboard,
  Users,
  CreditCard,
  LifeBuoy,
} from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarSeparator,
} from "@/components/ui/sidebar";

import { NavLink } from "react-router-dom";
import logo from "../../../assets/logo.jpeg";

interface AdminNavigationItem {
  title: string;
  url: string;
  icon: React.ComponentType<{ className?: string }>;
}

interface AdminNavigationGroup {
  label: string;
  items: AdminNavigationItem[];
}

const adminNavigationGroups: AdminNavigationGroup[] = [
  {
    label: "Main",
    items: [
      {
        title: "Dashboard",
        url: "/admin/dashboard",
        icon: LayoutDashboard,
      },
    ],
  },
  {
    label: "Management",
    items: [
      {
        title: "Subscribers",
        url: "/admin/subscribers",
        icon: Users,
      },
      {
        title: "Add Subscriber",
        url: "/admin/add-subscriber",
        icon: CreditCard,
      },
    ],
  },
  {
    label: "Support",
    items: [
      {
        title: "Support Requests",
        url: "/admin/support",
        icon: LifeBuoy,
      },
    ],
  },
];

export function AdminSidebar() {
  return (
    <Sidebar collapsible="icon">
      {/* Header */}
      <SidebarHeader>
        <div className="flex items-center gap-3 py-2 bg-secondary">
            {/* Logo */}
            <div className="flex shrink-0 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                <img src={logo} alt="Company Logo" className="h-10 w-auto" />
            </div>

            {/* Company */}
            <div className="min-w-0 flex-1 group-data-[collapsible=icon]:hidden">
                <p className="truncate text-sm font-semibold">
                TIMEST
                </p>

                <p className="truncate text-xs text-muted-foreground">
                Pro
                </p>
            </div>
        </div>
      </SidebarHeader>

      <SidebarSeparator />

      {/* Navigation */}
      <SidebarContent>
        {adminNavigationGroups.map((group) => (
          <SidebarGroup key={group.label}>
            <SidebarGroupLabel>
              {group.label}
            </SidebarGroupLabel>

            <SidebarGroupContent>
              <SidebarMenu>
                {group.items.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton
                      tooltip={item.title}
                    >
                      <NavLink
                        to={item.url}
                        end={item.url === "/admin/dashboard"}
                        className={({ isActive }) =>
                          isActive
                            ? "font-semibold flex items-center gap-2"
                            : "flex items-center gap-2"
                        }
                      >
                        <item.icon className="text-wood-primary" />
                        <span>{item.title}</span>
                      </NavLink>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>

      {/* Footer */}
      <SidebarFooter>
        <div className="rounded-lg border bg-sidebar-accent p-3 group-data-[collapsible=icon]:hidden">
          <p className="text-xs font-medium">
            Admin Workspace
          </p>
          <p className="mt-1 text-xs text-muted-foreground">
            Manage subscribers, subscriptions, and support.
          </p>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}

export default AdminSidebar;
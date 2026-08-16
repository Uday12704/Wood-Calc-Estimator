import {
    Bell,
  Calculator,
  ClipboardCheck,
  FileText,
  History,
  LayoutDashboard,
  LifeBuoy,
  Settings,
  Truck,
  Users,
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

interface NavigationItem {
  title: string;
  url: string;
  icon: React.ComponentType<{ className?: string }>;
}

interface NavigationGroup {
  label: string;
  items: NavigationItem[];
}

const navigationGroups: NavigationGroup[] = [
  {
    label: "Main",
    items: [
      {
        title: "Dashboard",
        url: "/app/dashboard",
        icon: LayoutDashboard,
      },
    ],
  },

  {
    label: "Estimates",
    items: [
      {
        title: "New Estimate",
        url: "/app/estimates/new",
        icon: FileText,
      },
      {
        title: "History",
        url: "/app/estimates/history",
        icon: History,
      },
      {
        title: "Confirmed Orders",
        url: "/app/estimates/confirmed",
        icon: ClipboardCheck,
      },
    ],
  },

  {
    label: "Management",
    items: [
      {
        title: "Customers",
        url: "/app/customers",
        icon: Users,
      },
      {
        title: "Delivery Checklist",
        url: "/app/delivery-checklist",
        icon: Truck,
      },
    ],
  },

  {
    label: "Tools",
    items: [
      {
        title: "Quick Calculator",
        url: "/app/calculator",
        icon: Calculator,
      },
    ],
  },

  {
    label: "System",
    items: [
      {
        title: "Notifications",
        url: "/app/notifications",
        icon: Bell,
      },
      {
        title: "Settings",
        url: "/app/settings",
        icon: Settings,
      },
      {
        title: "Customer Support",
        url: "/app/support",
        icon: LifeBuoy,
      },
    ],
  },
];

export function AppSidebar() {
  return (
    <Sidebar collapsible="icon">
        {/* HEADER */}
        <SidebarHeader>
            <div className="flex items-center gap-3 py-2">
                {/* Logo */}
                <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                    <span className="text-sm font-bold">
                    W
                    </span>
                </div>

                {/* Company */}
                <div className="min-w-0 flex-1 group-data-[collapsible=icon]:hidden">
                    <p className="truncate text-sm font-semibold">
                    Wood Estimator
                    </p>

                    <p className="truncate text-xs text-muted-foreground">
                    Pro
                    </p>
                </div>
            </div>
        </SidebarHeader>

      <SidebarSeparator />

      <SidebarContent>
        {/* Navigation */}
        {navigationGroups.map((group) => (
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
                        className={({ isActive }) =>
                          isActive
                            ? "flex items-center gap-2 py-1 font-semibold"
                            : "flex items-center gap-2 py-1"
                        }
                      >
                        <item.icon className="text-wood-primary"/>
                        <span>
                          {item.title}
                        </span>
                      </NavLink>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>

      <SidebarFooter>
        {/* FOOTER */}
        {/* Subscription */}
        <div className="rounded-lg border bg-card p-3 group-data-[collapsible=icon]:hidden">

          <div className="flex items-center justify-between">
            <span className="text-xs font-medium">
              Subscription
            </span>

            <span className="text-[10px] font-medium text-green-600">
              Active
            </span>
          </div>

          <p className="mt-1 text-xs text-muted-foreground">
            Expires Aug 31, 2027
          </p>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
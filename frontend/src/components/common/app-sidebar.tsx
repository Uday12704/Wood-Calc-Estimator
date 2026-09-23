import {
  Bell,
  Calculator,
  ClipboardCheck,
  FileText,
  History,
  LayoutDashboard,
  LifeBuoy,
  Settings,
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
import { calculateSubscriptionStatus, getSubscription } from "@/features/subscription/subscription-storage";
import { useAuth } from "@/features/auth/auth-context";
import { formatDate } from "@/lib/formatters";
import logo from "../../assets/logo.jpeg";

interface NavigationItem {
  title: string;
  url?: string;
  icon: React.ComponentType<{
    className?: string;
  }>;
  action?: "calculator";
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
        icon: ClipboardCheck,
      },
    ],
  },

  {
    label: "Tools",
    items: [
      {
        title: "Quick Calculator",
        icon: Calculator,
        action: "calculator",
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

interface AppSidebarProps {
  onCalculatorOpen: () => void;
}

export function AppSidebar({
  onCalculatorOpen,
}: AppSidebarProps) {
  
  const { user } = useAuth();

  if(!user){
    return;
  }

  const subscription =
    getSubscription(user.accountId);

  if (!subscription) {
    return null;
  }

  const subscriptionStatus =
    calculateSubscriptionStatus(
      subscription.expiryDate,
    );

  return (
    <Sidebar collapsible="icon">
        {/* HEADER */}
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
                    {item.action === "calculator" ? (
                      <SidebarMenuButton
                        tooltip={item.title}
                        onClick={onCalculatorOpen}
                        className="cursor-pointer"
                      >
                        <item.icon className="text-wood-primary" />
                        <span>{item.title}</span>
                      </SidebarMenuButton>
                    ) : (
                      <SidebarMenuButton tooltip={item.title}>
                        <NavLink
                          to={item.url ?? "#"}
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
                    )}
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
        <div className="rounded-lg border bg-sidebar-accent p-3 group-data-[collapsible=icon]:hidden">

          <div className="flex items-center justify-between">
            <span className="text-xs font-medium">
              Subscription
            </span>

            <span className="text-[10px] font-medium text-green-600">
              {subscriptionStatus}
            </span>
          </div>

          <p className="mt-1 text-xs text-muted-foreground">
            Expires on {formatDate(subscription.expiryDate)}
          </p>
        </div>
        <p className="ml-2 text-[10px] text-muted-foreground group-data-[collapsible=icon]:hidden">© 2026 Timest. All rights reserved.</p>
      </SidebarFooter>
    </Sidebar>
  );
}
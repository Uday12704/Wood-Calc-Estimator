import {
  Bell,
  LogOut,
  Moon,
  Settings,
  Sun,
  User,
} from "lucide-react";

import { Link, useLocation, useNavigate } from "react-router-dom";
import { useTheme } from "next-themes";

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { SidebarTrigger } from "@/components/ui/sidebar";
import { useAuth } from "@/features/auth/auth-context";
import { Button } from "../ui/button";

const pageTitles: Record<string, string> = {
  "/app/dashboard": "Dashboard",

  "/app/estimates/new": "New Estimate",
  "/app/estimates/new/cut-size": "Cut Size Estimate",
  "/app/estimates/new/round-size": "Round Size Estimate",
  
  "/app/estimates/history": "Estimate History",
  "/app/estimates/confirmed": "Confirmed Orders",
  "/app/customers": "Customers",
  "/app/delivery": "Delivery Checklist",
  "/app/calculator": "Quick Calculator",
  "/app/notifications": "Notifications",
  "/app/settings": "General Settings",
  "/app/support": "Customer Support",
};

export function AppNavbar() {
  const location = useLocation();
  const navigate = useNavigate();

  const { theme, setTheme } = useTheme();

  const currentPage =
    pageTitles[location.pathname] ?? "Wood Estimator";

  const { user, logout } = useAuth();

  return (
    <nav className="sticky top-0 z-20 flex h-16 items-center justify-between border-b bg-background px-4">

      {/* LEFT SIDE */}
      <div className="flex items-center gap-4">

        <SidebarTrigger />

        <div className="hidden h-5 w-px bg-border sm:block" />

        <span className="text-sm font-semibold">
          {currentPage}
        </span>

      </div>

      {/* RIGHT SIDE */}
      <div className="flex items-center gap-2">

          <Link
            to="/app/notifications"
            className="inline-flex"
          >
            <Button
              variant="outline"
              size="icon"
              className="relative"
            >
              <Bell className="size-5" />

              <span className="absolute right-1 top-1 size-2 rounded-full bg-destructive" />

              <span className="sr-only">
                Notifications
              </span>
            </Button>
          </Link>

        {/* THEME */}
        <DropdownMenu>
          <DropdownMenuTrigger
            className="relative inline-flex size-9 items-center justify-center rounded-md border bg-background transition-colors hover:bg-accent hover:text-accent-foreground outline-none"
          >

            {theme === "light" ? (
              <Sun className="size-4" />
            ) : (
              <Moon className="size-4" />
            )}

            <span className="sr-only">
              Change theme
            </span>

          </DropdownMenuTrigger>

          <DropdownMenuContent align="end">

            <DropdownMenuGroup>

              <DropdownMenuLabel>
                Appearance
              </DropdownMenuLabel>

              <DropdownMenuItem
                onClick={() => setTheme("light")}
              >
                Light

                {theme === "light" && (
                  <span className="ml-auto">
                    ✓
                  </span>
                )}
              </DropdownMenuItem>

              <DropdownMenuItem
                onClick={() => setTheme("dark")}
              >
                Dark

                {theme === "dark" && (
                  <span className="ml-auto">
                    ✓
                  </span>
                )}
              </DropdownMenuItem>

              <DropdownMenuItem
                onClick={() => setTheme("system")}
              >
                System

                {theme === "system" && (
                  <span className="ml-auto">
                    ✓
                  </span>
                )}
              </DropdownMenuItem>

            </DropdownMenuGroup>

          </DropdownMenuContent>

        </DropdownMenu>

        {/* USER MENU */}

        <DropdownMenu>
          <DropdownMenuTrigger
            className="inline-flex size-9 items-center justify-center rounded-full outline-none ring-offset-background focus-visible:ring-2 focus-visible:ring-ring"
          >
            <Avatar className="size-9">
              <AvatarImage
                src=""
                alt="User profile"
              />
              <AvatarFallback>
                {user?.name
                ?.slice(0, 2)
                .toUpperCase()}
              </AvatarFallback>
            </Avatar>

            <span className="sr-only">
              Open user menu
            </span>

          </DropdownMenuTrigger>
          <DropdownMenuContent
            align="end"
            sideOffset={8}
          >
            <DropdownMenuGroup>
              <DropdownMenuLabel>
                My Account
              </DropdownMenuLabel>

              <DropdownMenuSeparator />

              <DropdownMenuItem
                onClick={() => navigate("/app/settings")}
              >
                <User className="mr-2 size-4" />
                    Profile
              </DropdownMenuItem>

              <DropdownMenuItem
                onClick={() => navigate("/app/settings")}
              >
                <Settings className="mr-2 size-4" />
                    Settings
              </DropdownMenuItem>

            </DropdownMenuGroup>

            <DropdownMenuSeparator />

            <DropdownMenuItem
              variant="destructive"
              onClick={logout}
            >
              <LogOut className="mr-2 size-4" />

              Logout
            </DropdownMenuItem>

          </DropdownMenuContent>

        </DropdownMenu>

      </div>
    </nav>
  );
}
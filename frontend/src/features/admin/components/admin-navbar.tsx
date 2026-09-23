import { Bell, LogOut, Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { useLocation, useNavigate } from "react-router-dom";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
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
import { Button } from "@/components/ui/button";

import { useAuth } from "@/features/auth/auth-context";

const adminPageTitles: Record<string, string> = {
  "/admin/dashboard": "Dashboard",
  "/admin/subscribers": "Subscribers",
  "/admin/add-subscriber": "Add Subscriber",
  "/admin/support": "Support Requests",
  "/admin/notifications": "Notifications",
};

export function AdminNavbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { theme, setTheme } = useTheme();
  const { user, logout } = useAuth();

  const currentPage =
    adminPageTitles[location.pathname] ?? "Admin Workspace";

  const initials =
    user?.name?.slice(0, 2).toUpperCase() || "AD";

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
        {/* NOTIFICATIONS */}
        <Button
          type="button"
          variant="outline"
          size="icon"
          aria-label="Admin notifications"
          onClick={() => navigate("/admin/notifications")}
        >
          <Bell className="size-5" />
        </Button>

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

        {/* ADMIN PROFILE MENU */}
        <DropdownMenu>
          <DropdownMenuTrigger>
            <Avatar className="size-9">
                <AvatarImage
                    src=""
                    alt="User profile"
                />
                <AvatarFallback>
                    {initials}
                </AvatarFallback>
            </Avatar>
            <span className="sr-only">
              Open admin menu
            </span>
          </DropdownMenuTrigger>

          <DropdownMenuContent align="end" sideOffset={8} className="w-35">
            <DropdownMenuGroup>
            <DropdownMenuLabel>
              <div className="flex flex-col">
                <span>{user?.name || "Administrator"}</span>
                <span className="text-xs font-normal text-muted-foreground">
                  {user?.email}
                </span>
              </div>
            </DropdownMenuLabel>

            <DropdownMenuSeparator />

            <DropdownMenuItem
              variant="destructive"
              onClick={logout}
            >
              <LogOut className="mr-2 size-4" />
              Logout
            </DropdownMenuItem>
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </nav>
  );
}

export default AdminNavbar;
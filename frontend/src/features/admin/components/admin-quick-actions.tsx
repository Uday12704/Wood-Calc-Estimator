
import {
  UserPlus,
  CreditCard,
  UserRoundCog,
  Headset,
  ArrowUpRight,
} from "lucide-react";

import { useNavigate } from "react-router-dom";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { Button } from "@/components/ui/button";

const quickActions = [
  {
    title: "Add Subscriber",
    description: "Register a new subscriber account",
    icon: UserPlus,
    path: null,
  },
  {
    title: "Activate Subscription",
    description: "Activate or extend a subscription",
    icon: CreditCard,
    path: null,
  },
  {
    title: "Manage Subscribers",
    description: "View and manage subscriber accounts",
    icon: UserRoundCog,
    path: "/admin/subscribers",
  },
  {
    title: "Support Requests",
    description: "Review customer support requests",
    icon: Headset,
    path: "/admin/support",
  },
];

export function AdminQuickActions() {
  const navigate = useNavigate();

  return (
    <Card>
      <CardHeader>
        <CardTitle>Quick Actions</CardTitle>

        <p className="text-sm text-muted-foreground">
          Common tasks for managing the platform.
        </p>
      </CardHeader>

      <CardContent>
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          {quickActions.map((action) => {
            const Icon = action.icon;

            return (
              <div
                key={action.title}
                className="flex flex-col justify-between gap-4 rounded-lg border p-4"
              >
                <div className="space-y-2">
                  <div className="flex size-9 items-center justify-center rounded-md bg-muted">
                    <Icon className="size-4" />
                  </div>

                  <h3 className="font-medium">
                    {action.title}
                  </h3>

                  <p className="text-sm text-muted-foreground">
                    {action.description}
                  </p>
                </div>

                <Button
                  variant="outline"
                  className="w-full justify-between"
                  disabled={!action.path}
                  onClick={() => {
                    if (action.path) {
                      navigate(action.path);
                    }
                  }}
                >
                  {action.path ? "Open" : "Coming soon"}
                  <ArrowUpRight className="size-4" />
                </Button>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}

export default AdminQuickActions;
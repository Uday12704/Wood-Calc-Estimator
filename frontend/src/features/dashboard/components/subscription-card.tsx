import {
  CalendarDays,
  CheckCircle2,
  Clock3,
  AlertTriangle,
} from "lucide-react";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { Badge } from "@/components/ui/badge";
import { formatDate } from "@/lib/formatters";

interface SubscriptionCardProps {
  expiryDate: string;
  status: "active" | "expiring" | "expired";
}

function getDaysRemaining(expiryDate: string) {
  const today = new Date();

  const expiry = new Date(expiryDate);

  const difference =
    expiry.getTime() - today.getTime();

  return Math.ceil(
    difference / (1000 * 60 * 60 * 24),
  );
}

export function SubscriptionCard({
  expiryDate,
  status,
}: SubscriptionCardProps) {
  const daysRemaining = getDaysRemaining(expiryDate);

  const statusConfig = {
    active: {
      label: "Active",
      icon: CheckCircle2,
    },
    expiring: {
      label: "Expiring Soon",
      icon: AlertTriangle,
    },
    expired: {
      label: "Expired",
      icon: Clock3,
    },
  };

  const config = statusConfig[status];

  const StatusIcon = config.icon;

  return (
    <Card className="h-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-base">
            Subscription
          </CardTitle>

          <Badge variant={status === "active" ? "secondary" : status === "expired" ? "destructive" : "warning"} className={status === "active" ? "bg-green-200" : ""} >
            <StatusIcon className={status === "active" ? "mr-1 size-3.5 text-green-600" : "mr-1 size-3.5"} />

            <p className={status === "active" ? "text-green-700" : ""}>
              {config.label}
            </p>
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-5">

        <div className="flex items-center gap-3">
          <div className="flex size-10 items-center justify-center rounded-lg bg-primary/10">
            <CalendarDays className="size-5 text-primary" />
          </div>

          <div>
            <p className="text-xs text-muted-foreground">
              Renewal / Expiry Date
            </p>

            <p className="font-semibold">
              {formatDate(expiryDate)}
            </p>
          </div>
        </div>

        <div className="rounded-lg bg-muted/50 p-3">
          {status === "expired" ? (
            <div>
              <p className="font-medium text-destructive">
                Subscription expired
              </p>

              <p className="mt-1 text-xs text-muted-foreground">
                Contact the administrator to renew your subscription.
              </p>
            </div>
          ) : (
            <>
              <p className="text-2xl font-bold">
                {daysRemaining}
              </p>

              <p className="text-xs text-muted-foreground">
                days remaining
              </p>
            </>
          )}
        </div>

      </CardContent>
    </Card>
  );
}
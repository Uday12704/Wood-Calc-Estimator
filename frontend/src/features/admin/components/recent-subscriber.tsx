
import { useMemo } from "react";
import { CalendarDays, Users } from "lucide-react";

import { getAccounts } from "@/features/auth/auth-storage";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { Badge } from "@/components/ui/badge";

export function RecentSubscribers() {
  const subscribers = useMemo(() => {
    return getAccounts()
      .filter(
        (account) => account.platformRole === "SUBSCRIBER",
      )
      .sort(
        (a, b) =>
          new Date(b.createdAt).getTime() -
          new Date(a.createdAt).getTime(),
      )
      .slice(0, 5);
  }, []);

  function formatDate(dateString: string) {
    const date = new Date(dateString);

    if (Number.isNaN(date.getTime())) {
      return "Date unavailable";
    }

    return date.toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  }

  return (
    <Card className="rounded-xl">
      <CardHeader>
        <div className="flex items-center gap-2">
          <div className="flex size-10 items-center justify-center rounded-lg bg-blue-100">
            <Users className="size-5 text-blue-600" />
          </div>

          <div>
            <CardTitle className="text-lg">
              Recently Registered Subscribers
            </CardTitle>

            <p className="mt-1 text-sm text-muted-foreground">
              The five most recently created subscriber accounts
            </p>
          </div>
        </div>
      </CardHeader>

      <CardContent>
        {subscribers.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <Users className="mb-3 size-8 text-muted-foreground" />

            <p className="font-medium">
              No subscriber accounts found
            </p>

            <p className="mt-1 text-sm text-muted-foreground">
              Newly registered subscribers will appear here.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {subscribers.map((account) => (
              <div
                key={account.id}
                className="flex flex-col gap-3 rounded-lg border p-4 sm:flex-row sm:items-center sm:justify-between"
              >
                <div className="flex min-w-0 items-center gap-3">
                  <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-muted">
                    <Users className="size-5 text-muted-foreground" />
                  </div>

                  <div className="min-w-0">
                    <p className="truncate font-medium">
                      {account.email}
                    </p>

                    <div className="mt-1 flex items-center gap-1.5 text-sm text-muted-foreground">
                      <CalendarDays className="size-4 shrink-0" />

                      <span>
                        Registered {formatDate(account.createdAt)}
                      </span>
                    </div>
                  </div>
                </div>

                <Badge
                  variant={account.active ? "success" : "destructive"}
                  className="w-fit"
                >
                  {account.active ? "Active" : "Inactive"}
                </Badge>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export default RecentSubscribers;
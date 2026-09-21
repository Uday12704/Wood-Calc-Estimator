
import { useMemo } from "react";
import {
  MessageSquare,
  CalendarDays,
  Inbox,
} from "lucide-react";

import { getAllSupportRequests } from "@/features/support/support-storage";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { Badge } from "@/components/ui/badge";

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

function getStatusVariant(
  status: string,
): "default" | "secondary" | "destructive" | "outline" {
  switch (status) {
    case "OPEN":
      return "default";
    case "IN_PROGRESS":
      return "secondary";
    case "WAITING_FOR_USER":
      return "outline";
    case "RESOLVED":
    case "CLOSED":
      return "secondary";
    default:
      return "outline";
  }
}

function formatLabel(value: string) {
  return value
    .toLowerCase()
    .replace(/_/g, " ")
    .replace(/\b\w/g, (letter) => letter.toUpperCase());
}

export function RecentSupportRequests() {
  const requests = useMemo(
    () => getAllSupportRequests().slice(0, 5),
    [],
  );

  return (
    <Card className="rounded-xl">
      <CardHeader>
        <div className="flex items-center gap-2">
          <div className="flex size-10 items-center justify-center rounded-lg bg-blue-100">
            <MessageSquare className="size-5 text-blue-600" />
          </div>

          <div>
            <CardTitle className="text-lg">
              Recent Support Requests
            </CardTitle>

            <p className="mt-1 text-sm text-muted-foreground">
              The five latest requests from subscribers
            </p>
          </div>
        </div>
      </CardHeader>

      <CardContent>
        {requests.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <Inbox className="mb-3 size-8 text-muted-foreground" />

            <p className="font-medium">
              No support requests yet
            </p>

            <p className="mt-1 text-sm text-muted-foreground">
              New subscriber requests will appear here.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {requests.map((request) => (
              <div
                key={`${request.accountId}-${request.id}`}
                className="space-y-3 rounded-lg border p-4"
              >
                <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                  <div className="min-w-0">
                    <p className="text-xs font-medium text-muted-foreground">
                      {request.requestNumber}
                    </p>

                    <p className="mt-1 break-words font-medium">
                      {request.subject}
                    </p>
                  </div>

                  <Badge variant={getStatusVariant(request.status)}>
                    {formatLabel(request.status)}
                  </Badge>
                </div>

                <p className="line-clamp-2 whitespace-pre-wrap text-sm text-muted-foreground">
                  {request.message}
                </p>

                <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                  <Badge variant="outline">
                    {formatLabel(request.category)}
                  </Badge>

                  <Badge variant="outline">
                    {formatLabel(request.priority)} priority
                  </Badge>

                  <span className="flex items-center gap-1">
                    <CalendarDays className="size-3.5" />
                    {formatDate(request.createdAt)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export default RecentSupportRequests;
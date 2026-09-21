
import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Headset, Search } from "lucide-react";

import { getAllSupportRequests } from "@/features/support/support-storage";
import type {
  SupportRequest,
  SupportStatus,
} from "@/features/support/types";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

const statusVariant = (status: SupportStatus) => {
  switch (status) {
    case "OPEN":
      return "default";
    case "IN_PROGRESS":
      return "warning";
    case "WAITING_FOR_USER":
      return "outline";
    case "RESOLVED":
      return "success";
    case "CLOSED":
      return "secondary";
    default:
      return "outline";
  }
};

export default function AdminSupportPage() {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");

  const requests = useMemo(() => {
    return getAllSupportRequests();
  }, []);

  const filteredRequests = requests.filter((request: SupportRequest) => {
    const searchText = search.trim().toLowerCase();

    const matchesSearch =
      !searchText ||
      request.requestNumber.toLowerCase().includes(searchText) ||
      request.subject.toLowerCase().includes(searchText) ||
      request.message.toLowerCase().includes(searchText) ||
      request.accountId.toLowerCase().includes(searchText);

    const matchesStatus =
      statusFilter === "ALL" || request.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  return (
    <div className="mx-auto w-full max-w-7xl space-y-5 p-4 md:p-6">
      <div className="flex items-center gap-3">
        <Button
          variant="outline"
          size="icon"
          onClick={() => navigate("/admin/dashboard")}
          aria-label="Back to admin dashboard"
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>

        <div>
          <h1 className="text-2xl font-bold tracking-tight">
            Support Requests
          </h1>
          <p className="text-sm text-muted-foreground">
            Review and manage support requests from subscribers.
          </p>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[
          {
            label: "All Requests",
            value: requests.length,
          },
          {
            label: "Open",
            value: requests.filter((item) => item.status === "OPEN").length,
          },
          {
            label: "In Progress",
            value: requests.filter(
              (item) => item.status === "IN_PROGRESS"
            ).length,
          },
          {
            label: "Resolved",
            value: requests.filter(
              (item) =>
                item.status === "RESOLVED" || item.status === "CLOSED"
            ).length,
          },
        ].map((stat) => (
          <Card key={stat.label}>
            <CardContent className="p-4">
              <p className="text-sm text-muted-foreground">{stat.label}</p>
              <p className="mt-1 text-2xl font-bold">{stat.value}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-base">
            <Headset className="h-5 w-5" />
            Request Inbox
          </CardTitle>
        </CardHeader>

        <CardContent className="space-y-4">
          <div className="flex flex-col gap-3 md:flex-row">
            <div className="relative w-full md:max-w-sm">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search subject, request number, message..."
                className="pl-9"
              />
            </div>

            <select
              value={statusFilter}
              onChange={(event) => setStatusFilter(event.target.value)}
              className="h-10 rounded-md border bg-background px-3 text-sm"
              aria-label="Filter support requests by status"
            >
              <option value="ALL">All statuses</option>
              <option value="OPEN">Open</option>
              <option value="IN_PROGRESS">In progress</option>
              <option value="WAITING_FOR_USER">Waiting for user</option>
              <option value="RESOLVED">Resolved</option>
              <option value="CLOSED">Closed</option>
            </select>
          </div>

          <div className="overflow-x-auto rounded-md border">
            <table className="w-full text-sm">
              <thead className="bg-muted/50">
                <tr className="text-left">
                  <th className="p-3 font-medium">Request</th>
                  <th className="p-3 font-medium">Subject</th>
                  <th className="p-3 font-medium">Category</th>
                  <th className="p-3 font-medium">Priority</th>
                  <th className="p-3 font-medium">Status</th>
                  <th className="p-3 font-medium">Submitted</th>
                  <th className="p-3 text-right font-medium">Action</th>
                </tr>
              </thead>

              <tbody>
                {filteredRequests.length === 0 ? (
                  <tr>
                    <td
                      colSpan={7}
                      className="p-8 text-center text-muted-foreground"
                    >
                      No support requests match your filters.
                    </td>
                  </tr>
                ) : (
                  filteredRequests.map((request) => (
                    <tr key={request.id} className="border-t">
                      <td className="whitespace-nowrap p-3 font-medium">
                        {request.requestNumber}
                      </td>

                      <td className="min-w-48 p-3">
                        <p className="font-medium">{request.subject}</p>
                        <p className="mt-1 max-w-xs truncate text-xs text-muted-foreground">
                          {request.message}
                        </p>
                      </td>

                      <td className="whitespace-nowrap p-3">
                        {request.category.replaceAll("_", " ")}
                      </td>

                      <td className="whitespace-nowrap p-3">
                        <Badge
                          variant={
                            request.priority === "HIGH"
                              ? "destructive"
                              : "outline"
                          }
                        >
                          {request.priority}
                        </Badge>
                      </td>

                      <td className="whitespace-nowrap p-3">
                        <Badge variant={statusVariant(request.status)}>
                          {request.status.replaceAll("_", " ")}
                        </Badge>
                      </td>

                      <td className="whitespace-nowrap p-3">
                        {new Date(request.createdAt).toLocaleDateString()}
                      </td>

                      <td className="whitespace-nowrap p-3 text-right">
                        <Button
                          size="sm"
                          onClick={() => navigate(`/admin/support/${request.id}`)}
                        >
                            View
                        </Button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          <p className="text-sm text-muted-foreground">
            Showing {filteredRequests.length} of {requests.length} requests.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
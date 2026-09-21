
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeft,
  Send,
  MessageSquare,
  CalendarDays,
  X,
  Pencil,
} from "lucide-react";
import { toast } from "react-toastify";

import {
  getAllSupportRequests,
  getSupportMessages,
  saveSupportMessage,
  saveSupportRequest,
  updateSupportMessage,
} from "@/features/support/support-storage";

import type {
  SupportRequest,
  SupportMessage,
  SupportStatus,
} from "@/features/support/types";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const statusOptions: SupportStatus[] = [
  "OPEN",
  "IN_PROGRESS",
  "WAITING_FOR_USER",
  "RESOLVED",
  "CLOSED",
];

function formatStatus(status: SupportStatus) {
  return status.replaceAll("_", " ");
}

export default function AdminSupportDetailsPage() {
  const { requestId } = useParams<{ requestId: string }>();
  const navigate = useNavigate();

  const [request, setRequest] = useState<SupportRequest | null>(null);
  const [messages, setMessages] = useState<SupportMessage[]>([]);
  const [reply, setReply] = useState("");
  const [status, setStatus] = useState<SupportStatus>("OPEN");

  const [editingMessageId, setEditingMessageId] = useState<string | null>(null);
  const [editedMessageText, setEditedMessageText] = useState("");

  useEffect(() => {
    if (!requestId) return;

    const foundRequest =
      getAllSupportRequests().find((item) => item.id === requestId) ?? null;

    setRequest(foundRequest);

    if (foundRequest) {
      setStatus(foundRequest.status);
      setMessages(
        getSupportMessages(foundRequest.accountId, foundRequest.id)
      );
    }
  }, [requestId]);

  function handleStartEditing(message: SupportMessage) {
    if (message.senderType !== "ADMIN") {
        return;
    }

    setEditingMessageId(message.id);
    setEditedMessageText(message.message);
    }

    function handleCancelEditing() {
    setEditingMessageId(null);
    setEditedMessageText("");
    }

    function handleSaveEditedMessage(messageId: string) {
    if (!request) return;

    const text = editedMessageText.trim();

    if (!text) {
        toast.error("Message cannot be empty.");
        return;
    }

    try {
        const updatedMessage = updateSupportMessage(
        request.accountId,
        messageId,
        text,
        );

        if (!updatedMessage) {
        toast.error("Unable to find the admin message.");
        return;
        }

        setMessages((previous) =>
        previous.map((message) =>
            message.id === messageId ? updatedMessage : message,
        ),
        );

        handleCancelEditing();
        toast.success("Message updated.");
    } catch (error) {
        toast.error(
        error instanceof Error
            ? error.message
            : "Unable to update message.",
        );
    }
}

  function handleStatusChange(nextStatus: SupportStatus) {
    if (!request) return;

    const updatedRequest: SupportRequest = {
      ...request,
      status: nextStatus,
      updatedAt: new Date().toISOString(),
    };

    saveSupportRequest(request.accountId, updatedRequest);
    setRequest(updatedRequest);
    setStatus(nextStatus);

    toast.success("Support request status updated.");
  }

  function handleSendReply() {
    if (!request) return;

    const messageText = reply.trim();

    if (!messageText) {
      toast.error("Please enter a reply.");
      return;
    }

    const newMessage: SupportMessage = {
      id: crypto.randomUUID(),
      requestId: request.id,
      accountId: request.accountId,
      senderType: "ADMIN",
      senderId: "ADMIN",
      message: messageText,
      createdAt: new Date().toISOString(),
    };

    saveSupportMessage(request.accountId, newMessage);

    const updatedRequest: SupportRequest = {
      ...request,
      updatedAt: new Date().toISOString(),
    };

    saveSupportRequest(request.accountId, updatedRequest);

    setRequest(updatedRequest);
    setMessages((previous) => [...previous, newMessage]);
    setReply("");

    toast.success("Reply added to the conversation.");
  }

  if (!request) {
    return (
      <div className="mx-auto max-w-5xl space-y-4 p-5">
        <Button
          variant="outline"
          onClick={() => navigate("/admin/support")}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to support requests
        </Button>

        <Card>
          <CardContent className="py-10 text-center">
            <p className="font-semibold">Support request not found</p>
            <p className="mt-1 text-sm text-muted-foreground">
              The request may have been removed or the URL may be incorrect.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-7xl space-y-5 p-4 md:p-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-start gap-3">
          <Button
            variant="outline"
            size="icon"
            onClick={() => navigate("/admin/support")}
            aria-label="Back to support requests"
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>

          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="text-2xl font-bold tracking-tight">
                {request.requestNumber}
              </h1>
              <Badge variant="outline">{formatStatus(request.status)}</Badge>
            </div>
            <p className="mt-1 text-sm text-muted-foreground">
              Support request details and conversation.
            </p>
          </div>
        </div>
      </div>

      <div className="grid items-start gap-5 lg:grid-cols-[minmax(0,1fr)_300px]">
        {/* Conversation */}
        <div className="space-y-5">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">{request.subject}</CardTitle>
              <div className="flex flex-wrap gap-2 pt-1">
                <Badge variant="outline">{request.category}</Badge>
                <Badge
                  variant={
                    request.priority === "HIGH" ? "destructive" : "secondary"
                  }
                >
                  {request.priority} priority
                </Badge>
              </div>
            </CardHeader>

            <CardContent>
              <div className="rounded-lg bg-muted/40 p-4">
                <p className="whitespace-pre-wrap text-sm leading-6">
                  {request.message}
                </p>
                <p className="mt-3 text-xs text-muted-foreground">
                  Submitted {new Date(request.createdAt).toLocaleString()}
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-base">
                <MessageSquare className="h-5 w-5" />
                Conversation
              </CardTitle>
            </CardHeader>

            <CardContent className="space-y-4">
              {messages.length === 0 ? (
                <p className="py-5 text-center text-sm text-muted-foreground">
                  No additional messages yet.
                </p>
              ) : (
                messages.map((message) => (
                    
                  <div
                    key={message.id}
                    className={`flex ${
                      message.senderType === "ADMIN"
                        ? "justify-end"
                        : "justify-start"
                    }`}
                  >
                    {editingMessageId === message.id ? (
                    <div className="w-full space-y-3">
                        <Textarea
                        value={editedMessageText}
                        onChange={(event) => setEditedMessageText(event.target.value)}
                        className="min-h-24 bg-background"
                        aria-label="Edit message"
                        />

                        <div className="flex flex-wrap justify-end gap-2">
                        <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={handleCancelEditing}
                        >
                            <X className="mr-2 h-4 w-4" />
                            Cancel
                        </Button>

                        <Button
                            type="button"
                            size="sm"
                            onClick={() => handleSaveEditedMessage(message.id)}
                        >
                            Save changes
                        </Button>
                        </div>
                    </div>
                    ) : (
                    <div
                      className="max-w-[90%] rounded-xl px-3 sm:max-w-[80%] bg-muted group"
                    >
                        <div className={`flex items-center ${message.senderType === "ADMIN" ? "justify-end space-x-2" : ""}`}>
                            <p className="text-xs font-semibold mb-1">
                                {message.senderType === "ADMIN"
                                ? "Admin"
                                : "Subscriber"}
                            </p>
                            {message.senderType === "ADMIN" && (
                            <div className="hidden group-hover:flex">
                                <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                onClick={() => handleStartEditing(message)}
                                className="cursor-pointer"
                                >
                                <Pencil className="h-4 w-4" />
                                Edit
                                </Button>
                            </div>
                            )}
                        </div>
                        <p className={message.senderType === "ADMIN" ? "whitespace-pre-wrap text-sm leading-6 rounded-2xl px-3 py-2 bg-blue-600 text-white" : "whitespace-pre-wrap text-sm leading-6 rounded-2xl px-3 py-2 border bg-gray-600 text-white"}>
                            {message.message}
                        </p>
                        <p className="mt-2 text-xs opacity-70">
                            {new Date(message.createdAt).toLocaleString()}
                        </p>
                    </div>
                    )}
                  </div>
                ))
              )}

              <Separator />

              <div className="space-y-2">
                <Label htmlFor="admin-reply">Write a reply</Label>
                <Textarea
                  id="admin-reply"
                  value={reply}
                  onChange={(event) => setReply(event.target.value)}
                  placeholder="Enter your response to the subscriber..."
                  rows={4}
                />
              </div>

              <div className="flex justify-end">
                <Button onClick={handleSendReply} className="cursor-pointer">
                  <Send className="mr-2 h-4 w-4" />
                  Send Reply
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Request information and status */}
        <div className="space-y-5">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Request Information</CardTitle>
            </CardHeader>

            <CardContent className="space-y-4 text-sm">
              <div>
                <p className="text-muted-foreground">Request number</p>
                <p className="mt-1 font-medium">{request.requestNumber}</p>
              </div>

              <div>
                <p className="text-muted-foreground">Subscriber account ID</p>
                <p className="mt-1 break-all font-medium">
                  {request.accountId}
                </p>
              </div>

              <div>
                <p className="text-muted-foreground">Category</p>
                <p className="mt-1 font-medium">{request.category}</p>
              </div>

              <div>
                <p className="text-muted-foreground">Priority</p>
                <p className="mt-1 font-medium">{request.priority}</p>
              </div>

              <div>
                <p className="text-muted-foreground">Last updated</p>
                <p className="mt-1 flex items-center gap-2 font-medium">
                  <CalendarDays className="h-4 w-4 text-muted-foreground" />
                  {new Date(request.updatedAt).toLocaleString()}
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Update Status</CardTitle>
            </CardHeader>

            <CardContent className="space-y-3">
              <Label htmlFor="request-status">Request status</Label>
                <Select
                value={status}
                onValueChange={(value) =>
                    handleStatusChange(value as SupportStatus)
                }
                >
                <SelectTrigger id="request-status" className="w-full">
                    <SelectValue placeholder="Select request status" />
                </SelectTrigger>

                <SelectContent>
                    {statusOptions.map((option) => (
                    <SelectItem key={option} value={option}>
                        {formatStatus(option)}
                    </SelectItem>
                    ))}
                </SelectContent>
                </Select>

              <p className="text-xs text-muted-foreground">
                Status changes are saved immediately.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
import { useEffect, useMemo, useState } from "react";
import { toast } from "react-toastify";
import {
  ArrowRight,
  Calculator,
  CheckCircle2,
  CircleHelp,
  Clock3,
  FileText,
  Headphones,
  Inbox,
  LockKeyhole,
  MessageCircle,
  MessageSquare,
  Search,
  Send,
  Settings2,
  ShieldCheck,
  Sparkles,
  TextAlignCenter,
  UserRound,
  X,
  Zap,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { useAuth } from "@/features/auth/auth-context";
import { getSupportMessages, getSupportRequests, saveSupportMessage, saveSupportRequest } from "../support-storage";
import type {
  SupportCategory,
  SupportMessage,
  SupportPriority,
  SupportRequest,
  SupportStatus,
} from "../types";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";

const categoryOptions: {
  value: SupportCategory;
  label: string;
}[] = [
  {
    value: "GENERAL",
    label: "General Question",
  },
  {
    value: "ACCOUNT",
    label: "Account & Login",
  },
  {
    value: "SUBSCRIPTION",
    label: "Subscription",
  },
  {
    value: "ESTIMATE",
    label: "Estimate / Calculation",
  },
  {
    value: "PRINTING",
    label: "Printing / PDF",
  },
  {
    value: "SETTINGS",
    label: "Settings",
  },
  {
    value: "TECHNICAL",
    label: "Technical Problem",
  },
  {
    value: "OTHER",
    label: "Other",
  },
];

const helpTopics = [
  {
    title: "Estimates",
    description:
      "Need help with calculations or estimates?",
    icon: Calculator,
    category: "ESTIMATE" as SupportCategory,
  },
  {
    title: "PDF & Printing",
    description:
      "Having trouble with PDF or printing?",
    icon: FileText,
    category: "PRINTING" as SupportCategory,
  },
  {
    title: "Account & Security",
    description:
      "Issues with login, PIN or account settings?",
    icon: LockKeyhole,
    category: "ACCOUNT" as SupportCategory,
  },
];

export default function CustomerSupportPage() {
  const { user } = useAuth();

  const [subject, setSubject] = useState("");
  const [category, setCategory] =
    useState<SupportCategory>("GENERAL");
  const [priority, setPriority] =
    useState<SupportPriority>("NORMAL");
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] =
    useState(false);
  const [supportRequests, setSupportRequests] =
    useState<SupportRequest[]>([]);

  const [requestSearch, setRequestSearch] =
    useState("");

  const [requestStatus, setRequestStatus] =
    useState<"ALL" | SupportStatus>("ALL");

  const [selectedRequest, setSelectedRequest] =
    useState<SupportRequest | null>(null);

  const [replyMessage, setReplyMessage] =
    useState("");

  const [conversationMessages, setConversationMessages] =
    useState<SupportMessage[]>([]);

  useEffect(() => {
    if (!user?.accountId) {
        setSupportRequests([]);
        return;
    }

    setSupportRequests(
        getSupportRequests(user.accountId),
    );
    }, [user?.accountId]);

  const filteredRequests = useMemo(() => {
    const search = requestSearch
        .trim()
        .toLowerCase();

    return supportRequests.filter((request) => {
        const matchesSearch =
        !search ||
        request.requestNumber
            .toLowerCase()
            .includes(search) ||
        request.subject
            .toLowerCase()
            .includes(search);

        const matchesStatus =
        requestStatus === "ALL" ||
        request.status === requestStatus;

        return matchesSearch && matchesStatus;
    });
    }, [
    supportRequests,
    requestSearch,
    requestStatus,
    ]);

  const handleSubmit = () => {
    if (!user) {
      return;
    }

    const trimmedSubject = subject.trim();
    const trimmedMessage = message.trim();

    if (!trimmedSubject) {
      toast.error("Please enter a subject.");
      return;
    }

    if (!trimmedMessage) {
      toast.error("Please describe your issue.");
      return;
    }

    setIsSubmitting(true);

    try {
      const now = new Date().toISOString();

      const requestId = crypto.randomUUID();

      const requestNumber = `SUP-${Date.now()
        .toString()
        .slice(-6)}`;

      saveSupportRequest(
        user.accountId,
        {
          id: requestId,
          requestNumber,
          accountId: user.accountId,
          createdBy: user.profileId,
          subject: trimmedSubject,
          category,
          priority,
          message: trimmedMessage,
          status: "OPEN",
          createdAt: now,
          updatedAt: now,
        },
      );

      setSupportRequests(
        getSupportRequests(user.accountId),
      );

      setSubject("");
      setCategory("GENERAL");
      setPriority("NORMAL");
      setMessage("");

      toast.success(
        `Support request ${requestNumber} submitted successfully.`,
      );
    } catch {
      toast.error(
        "Unable to submit the support request. Please try again.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleHelpTopicClick = (
    topicCategory: SupportCategory,
  ) => {
    setCategory(topicCategory);

    document
      .getElementById("support-request-form")
      ?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
  };

  const getCategoryLabel = (
    value: SupportCategory,
    ): string => {
    return (
        categoryOptions.find(
        (option) => option.value === value,
        )?.label ?? "Other"
    );
  };

  const getStatusLabel = (
    status: SupportStatus,
    ): string => {
    switch (status) {
        case "OPEN":
        return "Open";

        case "IN_PROGRESS":
        return "In Progress";

        case "WAITING_FOR_USER":
        return "Waiting for You";

        case "RESOLVED":
        return "Resolved";

        case "CLOSED":
        return "Closed";

        default:
        return status;
    }
  };

  const getStatusIcon = (
    status: SupportStatus,
    ) => {
    switch (status) {
        case "OPEN":
        return Inbox;

        case "IN_PROGRESS":
        return Clock3;

        case "WAITING_FOR_USER":
        return MessageSquare;

        case "RESOLVED":
        return CheckCircle2;

        case "CLOSED":
        return CheckCircle2;

        default:
        return CircleHelp;
    }
  };

  const getPriorityLabel = (
    value: SupportPriority,
    ): string => {
    switch (value) {
        case "LOW":
        return "Low";

        case "NORMAL":
        return "Normal";

        case "HIGH":
        return "High";

        default:
        return value;
    }
  };

  const formatSupportDate = (
    date: string,
    ): string => {
    return new Date(date).toLocaleDateString(
        "en-IN",
        {
        day: "2-digit",
        month: "short",
        year: "numeric",
        },
    );
  };

  const handleViewRequest = (
    request: SupportRequest,
    ) => {
    setSelectedRequest(request);
    setReplyMessage("");

    if (user?.accountId) {
        setConversationMessages(
        getSupportMessages(
            user.accountId,
            request.id,
        ),
        );
    }
  };

  const handleSendReply = () => {
    if (
        !user ||
        !selectedRequest ||
        !replyMessage.trim()
    ) {
        return;
    }

    const now = new Date().toISOString();

    const newMessage: SupportMessage = {
        id: crypto.randomUUID(),
        requestId: selectedRequest.id,
        accountId: user.accountId,
        senderType: "USER",
        senderId: user.profileId,
        message: replyMessage.trim(),
        createdAt: now,
    };

    saveSupportMessage(
        user.accountId,
        newMessage,
    );

    const updatedRequest: SupportRequest = {
        ...selectedRequest,
        updatedAt: now,
    };

    saveSupportRequest(
        user.accountId,
        updatedRequest,
    );

    setConversationMessages((current) => [
        ...current,
        newMessage,
    ]);

    setSelectedRequest(updatedRequest);

    setSupportRequests(
        getSupportRequests(user.accountId),
    );

    setReplyMessage("");

    toast.success("Reply sent successfully.");
  };

  return (
    <div className="space-y-6 pb-8">
      {/* ─────────────────────────────────────
          Page Header
      ───────────────────────────────────── */}

      <div>
        <div className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10">
            <Headphones className="h-5 w-5 text-primary" />
          </div>

          <div>
            <h1 className="text-2xl font-semibold tracking-tight text-wood-primary">
              Customer Support
            </h1>

            <p className="text-sm text-muted-foreground">
              We're here to help you get the most out of
              Wood Estimator.
            </p>
          </div>
        </div>
      </div>

      {/* ─────────────────────────────────────
          Hero
      ───────────────────────────────────── */}

      <Card className="relative overflow-hidden border-0 bg-gradient-to-br from-primary/10 via-background to-primary/5 shadow-sm">
        <div className="pointer-events-none absolute -right-20 -top-20 h-48 w-48 rounded-full bg-primary/10 blur-3xl" />

        <div className="pointer-events-none absolute -bottom-20 -left-10 h-40 w-40 rounded-full bg-primary/10 blur-3xl" />

        <CardContent className="relative p-6 md:p-8">
          <div className="grid gap-8 md:grid-cols-[1fr_auto] md:items-center">
            <div className="max-w-2xl">
              <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-background/70 px-3 py-1.5 text-xs font-medium text-primary backdrop-blur">
                <Sparkles className="h-3.5 w-3.5 text-wood-secondary" />
                We're here to help
              </div>

              <h2 className="text-2xl font-bold tracking-tight md:text-3xl">
                Need a hand with something?
              </h2>

              <p className="mt-3 max-w-xl text-sm leading-6 text-muted-foreground md:text-base">
                Tell us what you're facing and our support
                team will help you find a solution. Whether
                it's an estimate, PDF, account or technical
                issue, we've got you covered.
              </p>

              <div className="mt-6 flex flex-wrap gap-3">
                <Button
                  onClick={() =>
                    document
                      .getElementById(
                        "support-request-form",
                      )
                      ?.scrollIntoView({
                        behavior: "smooth",
                        block: "start",
                      })
                  }
                >
                  Create Support Request
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>

                <div className="flex items-center gap-2 rounded-lg border bg-background/70 px-3 py-2 text-xs text-muted-foreground">
                  <Zap className="h-4 w-4 text-primary" />
                  Usually reviewed within 24 hours
                </div>
              </div>
            </div>

            <div className="hidden md:flex">
              <div className="relative flex h-36 w-36 items-center justify-center rounded-3xl border bg-background/80 shadow-sm backdrop-blur">
                <div className="absolute inset-3 rounded-2xl border border-wood-secondary/40" />

                <Headphones className="relative h-16 w-16 text-wood-primary" />

                <div className="absolute -right-3 -top-3 flex h-10 w-10 items-center justify-center rounded-xl border bg-background shadow-sm">
                  <MessageSquare className="h-5 w-5 text-wood-secondary" />
                </div>

                <div className="absolute -bottom-3 -left-3 flex h-10 w-10 items-center justify-center rounded-xl border bg-background shadow-sm">
                  <CheckCircle2 className="h-5 w-5 text-wood-secondary" />
                </div>
              </div>
            </div>
          </div>

          <div className="mt-8 grid gap-3 border-t pt-5 sm:grid-cols-3">
            <div className="flex items-center gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-background">
                <Zap className="h-4 w-4 text-primary" />
              </div>

              <div>
                <p className="text-xs font-medium">
                  Fast Response
                </p>

                <p className="text-xs text-muted-foreground">
                  Usually within 24 hours
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-background">
                <ShieldCheck className="h-4 w-4 text-primary" />
              </div>

              <div>
                <p className="text-xs font-medium">
                  Secure Support
                </p>

                <p className="text-xs text-muted-foreground">
                  Your account stays protected
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-background">
                <UserRound className="h-4 w-4 text-primary" />
              </div>

              <div>
                <p className="text-xs font-medium">
                  Personalized Help
                </p>

                <p className="text-xs text-muted-foreground">
                  Support linked to your account
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* ─────────────────────────────────────
          Help Topics
      ───────────────────────────────────── */}

      <div>
        <div className="mb-4">
          <h2 className="text-lg font-semibold">
            What can we help you with?
          </h2>

          <p className="mt-1 text-sm text-muted-foreground">
            Select a topic to get started quickly.
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          {helpTopics.map((topic) => {
            const Icon = topic.icon;

            return (
              <Card
                key={topic.title}
                className="group cursor-pointer transition-all duration-200 hover:-translate-y-0.5 hover:border-primary/30 hover:shadow-md"
                onClick={() =>
                  handleHelpTopicClick(
                    topic.category,
                  )
                }
              >
                <CardContent className="p-5">
                  <div className="flex items-start justify-between">
                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 transition-colors group-hover:bg-primary/15">
                      <Icon className="h-5 w-5 text-primary" />
                    </div>

                    <ArrowRight className="h-4 w-4 text-muted-foreground transition-transform group-hover:translate-x-1 group-hover:text-primary" />
                  </div>

                  <h3 className="mt-4 font-semibold">
                    {topic.title}
                  </h3>

                  <p className="mt-1 text-sm leading-5 text-muted-foreground">
                    {topic.description}
                  </p>

                  <div className="mt-4 text-xs font-medium text-primary">
                    Get help →
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>

      {/* ─────────────────────────────────────
          Support Request Form
      ───────────────────────────────────── */}

      <Card
        id="support-request-form"
        className="overflow-hidden"
      >
        <CardHeader className="border-b bg-muted/20 px-6 py-5">
          <div className="flex items-start gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10">
              <MessageSquare className="h-5 w-5 text-primary" />
            </div>

            <div>
              <CardTitle className="text-lg">
                Create a Support Request
              </CardTitle>

              <CardDescription className="mt-1">
                Give us a few details and we'll take it
                from there.
              </CardDescription>
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-6 p-6">
          {/* Subject */}
          <div className="space-y-2">
            <Label htmlFor="support-subject">
              Subject
            </Label>

            <Input
              id="support-subject"
              value={subject}
              onChange={(event) =>
                setSubject(event.target.value)
              }
              placeholder="What do you need help with?"
              maxLength={120}
              className="h-11"
            />

            <p className="text-xs text-muted-foreground">
              Keep it short and descriptive.
            </p>
          </div>

          {/* Category + Priority */}
          <div className="grid gap-5 md:grid-cols-2">
            <div className="space-y-2">
              <Label>Category</Label>

              <Select
                value={category}
                onValueChange={(value) =>
                  setCategory(
                    value as SupportCategory,
                  )
                }
              >
                <SelectTrigger className="h-11">
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>

                <SelectContent className="w-50 p-2">
                  {categoryOptions.map(
                    (option) => (
                      <SelectItem
                        key={option.value}
                        value={option.value}
                      >
                        {option.label}
                      </SelectItem>
                    ),
                  )}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Priority</Label>

              <Select
                value={priority}
                onValueChange={(value) =>
                  setPriority(
                    value as SupportPriority,
                  )
                }
              >
                <SelectTrigger className="h-11">
                  <SelectValue placeholder="Select priority" />
                </SelectTrigger>

                <SelectContent className="p-1">
                  <SelectItem value="LOW">
                    Low
                  </SelectItem>

                  <SelectItem value="NORMAL">
                    Normal
                  </SelectItem>

                  <SelectItem value="HIGH">
                    High
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Message */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="support-message">
                Tell us more
              </Label>

              <span className="text-xs text-muted-foreground">
                {message.length}/2000
              </span>
            </div>

            <Textarea
              id="support-message"
              value={message}
              onChange={(event) =>
                setMessage(event.target.value)
              }
              placeholder="Describe what happened, what you expected, and any steps you've already tried..."
              className="min-h-36 resize-y"
              maxLength={2000}
            />
          </div>

          {/* Submit Area */}
          <div className="flex flex-col gap-4 rounded-xl border bg-muted/20 p-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-start gap-3">
              <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                <CircleHelp className="h-4 w-4 text-primary" />
              </div>

              <div>
                <p className="text-sm font-medium">
                  Need a quick resolution?
                </p>

                <p className="text-xs text-muted-foreground">
                  Include screenshots or specific details
                  when possible.
                </p>
              </div>
            </div>

            <Button
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="shrink-0 cursor-pointer"
            >
              {isSubmitting
                ? "Submitting..."
                : "Send Request"}

              <Send className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* ─────────────────────────────────────
            My Support Requests
        ───────────────────────────────────── */}

      <Card className="overflow-hidden">
        <CardHeader className="border-b bg-muted/20 px-6 py-5">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-start gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10">
                <Inbox className="h-5 w-5 text-primary" />
                </div>

                <div>
                <CardTitle className="text-lg">
                    My Support Requests
                </CardTitle>

                <CardDescription className="mt-1">
                    Track your submitted requests and their
                    current status.
                </CardDescription>
                </div>
            </div>

            <div className="rounded-lg bg-primary/10 px-3 py-1.5 text-sm font-medium text-primary">
                {supportRequests.length}{" "}
                {supportRequests.length === 1
                ? "Request"
                : "Requests"}
            </div>
            </div>
        </CardHeader>

        <CardContent className="p-6">
            {supportRequests.length > 0 ? (
            <div className="space-y-5">
                {/* Search + Filters */}
                <div className="flex flex-col gap-3 lg:flex-row">
                <div className="relative flex-1">
                    <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />

                    <Input
                    value={requestSearch}
                    onChange={(event) =>
                        setRequestSearch(event.target.value)
                    }
                    placeholder="Search by request number or subject..."
                    className="h-10 pl-9 pr-9"
                    />

                    {requestSearch && (
                    <button
                        type="button"
                        onClick={() =>
                        setRequestSearch("")
                        }
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground transition-colors hover:text-foreground"
                    >
                        <X className="h-4 w-4" />
                    </button>
                    )}
                </div>

                <div className="flex gap-2 overflow-x-auto pb-1">
                    {[
                    {
                        value: "ALL" as const,
                        label: "All",
                    },
                    {
                        value: "OPEN" as const,
                        label: "Open",
                    },
                    {
                        value: "IN_PROGRESS" as const,
                        label: "In Progress",
                    },
                    {
                        value: "WAITING_FOR_USER" as const,
                        label: "Waiting",
                    },
                    {
                        value: "RESOLVED" as const,
                        label: "Resolved",
                    },
                    {
                        value: "CLOSED" as const,
                        label: "Closed",
                    },
                    ].map((filter) => (
                    <Button
                        key={filter.value}
                        type="button"
                        variant={
                        requestStatus === filter.value
                            ? "default"
                            : "outline"
                        }
                        size="sm"
                        className="shrink-0"
                        onClick={() =>
                        setRequestStatus(filter.value)
                        }
                    >
                        {filter.label}
                    </Button>
                    ))}
                </div>
                </div>

                {/* Request List */}
                {filteredRequests.length > 0 ? (
                <div className="grid gap-4">
                    {filteredRequests.map((request) => {
                    const StatusIcon =
                        getStatusIcon(request.status);

                    const statusStyles: Record<
                        SupportStatus,
                        string
                    > = {
                        OPEN:
                        "border-primary/20 bg-primary/5 text-primary",
                        IN_PROGRESS:
                        "border-blue-500/20 bg-blue-500/5 text-blue-600 dark:text-blue-400",
                        WAITING_FOR_USER:
                        "border-amber-500/20 bg-amber-500/5 text-amber-600 dark:text-amber-400",
                        RESOLVED:
                        "border-emerald-500/20 bg-emerald-500/5 text-emerald-600 dark:text-emerald-400",
                        CLOSED:
                        "border-muted bg-muted/50 text-muted-foreground",
                    };

                    const priorityStyles: Record<
                        SupportPriority,
                        string
                    > = {
                        LOW:
                        "bg-muted text-muted-foreground",
                        NORMAL:
                        "bg-primary/10 text-primary",
                        HIGH:
                        "bg-destructive/10 text-destructive",
                    };

                    return (
                        <Card
                        key={request.id}
                        className="group overflow-hidden border transition-all duration-200 hover:-translate-y-0.5 hover:border-primary/30 hover:shadow-md"
                        >
                        <CardContent className="p-0">

                            <div className="px-5">
                            {/* Header */}
                            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                                <div className="min-w-0">
                                    <div className="flex flex-wrap items-center gap-2">
                                        <span className="rounded-md bg-muted px-2 py-1 font-mono text-[11px] font-semibold tracking-wide">
                                        {request.requestNumber}
                                        </span>

                                        <span className="text-xs text-muted-foreground">
                                        {formatSupportDate(
                                            request.createdAt,
                                        )}
                                        </span>
                                    </div>

                                    <h3 className="mt-3 text-base font-semibold tracking-tight">
                                        {request.subject}
                                    </h3>

                                    <div className="mt-1 flex items-center gap-1.5 text-sm text-muted-foreground">
                                        <TextAlignCenter className="h-3.5 w-3.5" />

                                        {getCategoryLabel(
                                        request.category,
                                        )}
                                    </div>
                                </div>

                                {/* Status */}
                                <div
                                className={`flex w-fit shrink-0 items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-semibold ${statusStyles[request.status]}`}
                                >
                                <StatusIcon className="h-3.5 w-3.5" />

                                {getStatusLabel(
                                    request.status,
                                )}
                                </div>
                            </div>

                            {/* Message Preview */}
                            <div className="mt-4 rounded-lg bg-muted/30 p-1">
                                <div className="flex items-start gap-2 border p-3 rounded-lg">
                                    <MessageSquare className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />

                                    <p className="line-clamp-2 text-sm leading-5 text-muted-foreground">
                                        {request.message}
                                    </p>
                                </div>
                            </div>

                            {/* Information Grid */}
                            <div className="mt-5 grid grid-cols-1 gap-2 sm:grid-cols-3">
                                {/* Priority */}
                                <div className="rounded-lg border bg-muted/20 p-3">
                                <p className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
                                    Priority
                                </p>

                                <div className="mt-1.5 flex items-center gap-2">
                                    <span
                                    className={`rounded-full px-2 py-0.5 text-[11px] font-semibold ${priorityStyles[request.priority]}`}
                                    >
                                    {getPriorityLabel(
                                        request.priority,
                                    )}
                                    </span>
                                </div>
                                </div>

                                {/* Created */}
                                <div className="rounded-lg border bg-muted/20 p-3">
                                <p className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
                                    Created
                                </p>

                                <p className="mt-1.5 text-sm font-medium">
                                    {formatSupportDate(
                                    request.createdAt,
                                    )}
                                </p>
                                </div>

                                {/* Updated */}
                                <div className="rounded-lg border bg-muted/20 p-3">
                                <p className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
                                    Last Updated
                                </p>

                                <p className="mt-1.5 text-sm font-medium">
                                    {formatSupportDate(
                                    request.updatedAt,
                                    )}
                                </p>
                                </div>
                            </div>


                            {/* Footer */}
                            <div className="mt-4 flex flex-col gap-3 border-t pt-4 sm:flex-row sm:items-center sm:justify-between">
                                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                <ShieldCheck className="h-3.5 w-3.5" />

                                Support request linked to your account
                                </div>

                                <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                className="group/button w-full sm:w-auto"
                                onClick={() =>
                                    handleViewRequest(request)
                                }
                                >
                                    View Conversation
                                    <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover/button:translate-x-1" />
                                </Button>
                            </div>
                            </div>
                        </CardContent>
                        </Card>
                    );
                    })}
                </div>
                ) : (
                <div className="rounded-2xl border border-dashed bg-muted/10 p-10 text-center">
                    <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10">
                    <Search className="h-6 w-6 text-primary" />
                    </div>

                    <h3 className="mt-4 text-base font-semibold">
                    No matching requests
                    </h3>

                    <p className="mx-auto mt-1 max-w-sm text-sm leading-6 text-muted-foreground">
                    We couldn't find any support requests matching
                    your current search or filter.
                    </p>

                    <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="mt-5"
                    onClick={() => {
                        setRequestSearch("");
                        setRequestStatus("ALL");
                    }}
                    >
                    Clear Filters
                    </Button>
                </div>
                )}
            </div>
            ) : (
            /* Empty State */
            <div className="rounded-xl border border-dashed p-10 text-center">
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10">
                <MessageSquare className="h-6 w-6 text-primary" />
                </div>

                <h3 className="mt-4 text-base font-semibold">
                No support requests yet
                </h3>

                <p className="mx-auto mt-1 max-w-md text-sm leading-6 text-muted-foreground">
                When you need help, submit a support request
                above and it will appear here so you can track
                its progress.
                </p>

                <Button
                type="button"
                variant="outline"
                className="mt-5"
                onClick={() =>
                    document
                    .getElementById(
                        "support-request-form",
                    )
                    ?.scrollIntoView({
                        behavior: "smooth",
                        block: "start",
                    })
                }
                >
                Create Your First Request
                <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
            </div>
            )}
        </CardContent>
      </Card>

      {/* ─────────────────────────────────────
          Footer Help Card
      ───────────────────────────────────── */}

      <div className="flex flex-col gap-4 rounded-xl border bg-muted/20 p-5 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-start gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10">
            <Settings2 className="h-5 w-5 text-primary" />
          </div>

          <div>
            <p className="font-medium">
              Still can't find what you need?
            </p>

            <p className="mt-1 text-sm text-muted-foreground">
              Submit a support request and give us as much
              detail as possible.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 text-sm font-medium text-primary">
          <Headphones className="h-4 w-4" />
          We're ready to help
        </div>
      </div>
      {/* ─────────────────────────────────────
            Support Request Details
        ───────────────────────────────────── */}

        <Dialog
        open={selectedRequest !== null}
        onOpenChange={(open) => {
            if (!open) {
                setSelectedRequest(null);
                setReplyMessage("");
                setConversationMessages([]);
            }
        }}
        >
            <DialogContent className="max-h-[90vh] overflow-hidden p-0 sm:max-w-2xl">
                {selectedRequest && (
                <div className="flex max-h-[90vh] flex-col">
                    {/* Header */}
                    <DialogHeader className="border-b px-6 py-5">
                    <div className="flex items-start gap-3">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10">
                        <MessageCircle className="h-5 w-5 text-primary" />
                        </div>

                        <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                            <span className="rounded-md bg-muted px-2 py-1 font-mono text-[11px] font-semibold">
                            {selectedRequest.requestNumber}
                            </span>

                            <span className="rounded-full border bg-primary/5 px-2.5 py-1 text-[11px] font-semibold text-primary">
                            {getStatusLabel(
                                selectedRequest.status,
                            )}
                            </span>
                        </div>

                        <DialogTitle className="mt-2 text-lg">
                            {selectedRequest.subject}
                        </DialogTitle>

                        <DialogDescription className="mt-1">
                            Support request submitted on{" "}
                            {formatSupportDate(
                            selectedRequest.createdAt,
                            )}
                        </DialogDescription>
                        </div>
                    </div>
                    </DialogHeader>

                    {/* Content */}
                    <div className="flex-1 overflow-y-auto">
                    <div className="space-y-6 p-6">
                        {/* Request Information */}
                        <div className="grid gap-3 sm:grid-cols-3">
                            <div className="rounded-xl border bg-muted/20 p-3">
                                <p className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
                                Category
                                </p>

                                <p className="mt-1.5 text-sm font-medium">
                                {getCategoryLabel(
                                    selectedRequest.category,
                                )}
                                </p>
                            </div>

                            <div className="rounded-xl border bg-muted/20 p-3">
                                <p className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
                                Priority
                                </p>

                                <p className="mt-1.5 text-sm font-medium">
                                {getPriorityLabel(
                                    selectedRequest.priority,
                                )}
                                </p>
                            </div>

                            <div className="rounded-xl border bg-muted/20 p-3">
                                <p className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
                                Last Updated
                                </p>

                                <p className="mt-1.5 text-sm font-medium">
                                {formatSupportDate(
                                    selectedRequest.updatedAt,
                                )}
                                </p>
                            </div>
                        </div>

                        {/* Original Request */}
                        <div>
                            <div className="mb-3 flex items-center gap-2">
                                <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary/10">
                                <MessageSquare className="h-3.5 w-3.5 text-primary" />
                                </div>

                                <h3 className="text-sm font-semibold">
                                Your Request
                                </h3>
                            </div>

                            <div className="rounded-xl border bg-muted/20 p-4">
                                <p className="whitespace-pre-line text-sm leading-6 text-muted-foreground">
                                {selectedRequest.message}
                                </p>
                            </div>
                        </div>

                        {/* Conversation */}
                        <div>
                            <div className="mb-3 flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary/10">
                                    <MessageCircle className="h-3.5 w-3.5 text-primary" />
                                </div>

                                <h3 className="text-sm font-semibold">
                                    Conversation
                                </h3>
                                </div>

                                <span className="text-xs text-muted-foreground">
                                {conversationMessages.length}{" "}
                                {conversationMessages.length === 1
                                    ? "message"
                                    : "messages"}
                                </span>
                            </div>

                            {conversationMessages.length > 0 ? (
                                <div className="space-y-4">
                                {conversationMessages.map((message) => {
                                    const isUser =
                                    message.senderType === "USER";

                                    return (
                                    <div
                                        key={message.id}
                                        className={`flex ${
                                        isUser
                                            ? "justify-end"
                                            : "justify-start"
                                        }`}
                                    >
                                        <div
                                        className={`max-w-[85%] ${
                                            isUser
                                            ? "items-end"
                                            : "items-start"
                                        }`}
                                        >
                                        <div
                                            className={`mb-1 flex items-center gap-2 ${
                                            isUser
                                                ? "justify-end"
                                                : "justify-start"
                                            }`}
                                        >
                                            <span className="text-[11px] font-medium">
                                            {isUser
                                                ? "You"
                                                : "Support Team"}
                                            </span>

                                            <span className="text-[10px] text-muted-foreground">
                                            {new Date(
                                                message.createdAt,
                                            ).toLocaleString("en-IN", {
                                                day: "2-digit",
                                                month: "short",
                                                hour: "2-digit",
                                                minute: "2-digit",
                                            })}
                                            </span>
                                        </div>

                                        <div
                                            className={`rounded-2xl px-4 py-3 text-sm leading-5 ${
                                            isUser
                                                ? "rounded-br-md bg-blue-600 text-white"
                                                : "rounded-bl-md border bg-gray-600"
                                            }`}
                                        >
                                            {message.message}
                                        </div>
                                        </div>
                                    </div>
                                    );
                                })}
                                </div>
                            ) : (
                                <div className="rounded-xl border border-dashed bg-muted/10 p-6 text-center">
                                <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-xl bg-muted">
                                    <MessageCircle className="h-4 w-4 text-muted-foreground" />
                                </div>

                                <p className="mt-3 text-sm font-medium">
                                    No replies yet
                                </p>

                                <p className="mx-auto mt-1 max-w-sm text-xs leading-5 text-muted-foreground">
                                    Your request has been submitted. A support
                                    team member can reply here once your request
                                    is reviewed.
                                </p>
                                </div>
                            )}
                            </div>
                        </div>
                    </div>

                    {/* Reply */}
                    <div className="border-t bg-muted/10 p-4">
                        <div className="space-y-3">
                            <Label htmlFor="support-reply">
                            Reply to support
                            </Label>

                            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                                <Textarea
                                    id="support-reply"
                                    value={replyMessage}
                                    onChange={(event) =>
                                    setReplyMessage(
                                        event.target.value,
                                    )
                                    }
                                    placeholder="Type your message..."
                                    className="min-h-20 resize-none sm:flex-1 whitespace-pre-wrap break-words overflow-y-hidden"
                                    maxLength={2000}
                                />

                                <Button
                                    type="button"
                                    disabled={!replyMessage.trim()}
                                    onClick={handleSendReply}
                                >
                                    <Send className="mr-2 h-4 w-4" />
                                    Send
                                </Button>
                            </div>

                            <p className="text-[11px] text-muted-foreground">
                            {replyMessage.length}/2000
                            </p>
                        </div>
                    </div>
                </div>
                )}
            </DialogContent>
        </Dialog>

    </div>
  );
}
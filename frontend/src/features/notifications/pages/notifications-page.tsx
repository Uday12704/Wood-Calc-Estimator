import {
  Bell,
  BellRing,
  CheckCheck,
  ShieldAlert,
  Trash2,
  X,
} from "lucide-react";

import { useEffect, useState } from "react";
import { toast } from "react-toastify";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { useAuth } from "@/features/auth/auth-context";

import {
  clearNotifications,
  deleteNotification,
  getNotifications,
  markAllNotificationsAsRead,
  markNotificationAsRead,
} from "@/features/notifications/notification-storage";

import type { Notification } from "@/features/notifications/types";

export function NotificationsPage() {
  const { user } = useAuth();

  const accountId = user?.accountId ?? "";

  const [notifications, setNotifications] =
    useState<Notification[]>([]);

  function loadNotifications() {
    if (!accountId) {
      setNotifications([]);
      return;
    }

    setNotifications(
      getNotifications(accountId),
    );
  }

  useEffect(() => {
    loadNotifications();
  }, [accountId]);

  function handleNotificationClick(
    notification: Notification,
  ) {
    if (!accountId) {
      return;
    }

    if (!notification.isRead) {
      markNotificationAsRead(
        accountId,
        notification.id,
      );

      loadNotifications();
    }
  }

  function handleMarkAllAsRead() {
    if (!accountId) {
      return;
    }

    markAllNotificationsAsRead(accountId);

    loadNotifications();

    toast.success(
      "All notifications marked as read.",
    );
  }

  function handleDelete(
    notificationId: string,
  ) {
    if (!accountId) {
      return;
    }

    deleteNotification(
      accountId,
      notificationId,
    );

    loadNotifications();

    toast.success("Notification deleted.");
  }

  function handleClearAll() {
    if (!accountId) {
      return;
    }

    clearNotifications(accountId);

    loadNotifications();

    toast.success(
      "All notifications cleared.",
    );
  }

  const unreadCount =
    notifications.filter(
      (notification) =>
        !notification.isRead,
    ).length;

  if (!user) {
    return null;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight flex items-center gap-2 text-wood-primary">
            <Bell /> Notifications
          </h1>

          <p className="text-sm text-muted-foreground">
            View updates and important notifications.
          </p>
        </div>

        {notifications.length > 0 && (
          <div className="flex gap-2">
            {unreadCount > 0 && (
              <Button
                type="button"
                variant="outline"
                onClick={handleMarkAllAsRead}
              >
                <CheckCheck className="mr-2 size-4" />
                Mark all as read
              </Button>
            )}

            <Button
              type="button"
              variant="destructive"
              onClick={handleClearAll}
              className="cursor-pointer"
            >
              <Trash2 className="mr-2 size-4" />
              Clear all
            </Button>
          </div>
        )}
      </div>

      {/* Notification list */}
      {notifications.length === 0 ? (
        <Card>
          <CardContent className="flex min-h-60 flex-col items-center justify-center text-center">
            <div className="mb-4 flex size-12 items-center justify-center rounded-full bg-muted">
              <BellRing className="size-6 text-wood-secondary" />
            </div>

            <h2 className="font-semibold">
              No notifications
            </h2>

            <p className="mt-1 text-sm text-muted-foreground">
              You're all caught up.
            </p>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">
              {unreadCount > 0
                ? `${unreadCount} unread notification${
                    unreadCount === 1
                      ? ""
                      : "s"
                  }`
                : "All notifications read"}
            </CardTitle>
          </CardHeader>

          <CardContent className="space-y-3">
            {notifications.map(
              (notification) => (
                <div
                  key={notification.id}
                  className={`relative rounded-lg border p-4 transition-colors ${
                    notification.isRead
                      ? "bg-background"
                      : "bg-muted/50"
                  }`}
                  onClick={() =>
                    handleNotificationClick(
                      notification,
                    )
                  }
                >
                  <div className="flex gap-3">
                    {/* Icon */}
                    <div className="flex size-9 shrink-0 items-center justify-center rounded-full bg-primary/5">
                      {notification.priority === "HIGH" ? <ShieldAlert className="size-4 text-red-500" /> : <Bell className="size-4 text-yellow-500" />}
                    </div>

                    {/* Content */}
                    <div className="min-w-0 flex-1 pr-8">
                      <div className="flex items-center gap-2">
                        <h3
                          className={`text-sm ${
                            notification.isRead
                              ? "font-medium"
                              : "font-semibold"
                          }`}
                        >
                          {notification.title}
                        </h3>

                        {!notification.isRead && (
                          <span className="size-2 rounded-full bg-destructive" />
                        )}
                      </div>

                      <p className="mt-1 whitespace-pre-line text-sm text-muted-foreground">
                        {notification.message}
                      </p>

                      <p className="mt-2 text-xs text-muted-foreground">
                        {new Date(
                          notification.createdAt,
                        ).toLocaleString("en-IN")}
                      </p>
                    </div>

                    {/* Delete */}
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="absolute right-2 top-2"
                      onClick={(event) => {
                        event.stopPropagation();

                        handleDelete(
                          notification.id,
                        );
                      }}
                    >
                      <X className="size-4" />

                      <span className="sr-only">
                        Delete notification
                      </span>
                    </Button>
                  </div>
                </div>
              ),
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
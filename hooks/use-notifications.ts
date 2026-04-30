"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { notificationKeys } from "@/lib/query-keys/notifications";
import type { NotificationRecord } from "@/lib/services/notifications";

export function useMyNotifications() {
  return useQuery({
    queryKey: notificationKeys.list(),
    queryFn: async (): Promise<NotificationRecord[]> => {
      const response = await fetch("/api/v1/notifications", {
        credentials: "include",
      });
      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Failed to fetch notifications");
      }

      return result.data;
    },
  });
}

export function useUnreadNotificationCount() {
  return useQuery({
    queryKey: notificationKeys.unreadCount(),
    queryFn: async (): Promise<number> => {
      const response = await fetch("/api/v1/notifications/unread-count", {
        credentials: "include",
      });
      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Failed to fetch unread count");
      }

      return result.data.count;
    },
    refetchInterval: 30000, // Refetch every 30 seconds
  });
}

export function useMarkNotificationRead() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (notificationId: string) => {
      const response = await fetch(
        `/api/v1/notifications/${notificationId}/read`,
        {
          method: "PATCH",
          credentials: "include",
        },
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(
          result.message || "Failed to mark notification as read",
        );
      }

      return result.data;
    },
    onSettled: () => {
      void qc.invalidateQueries({ queryKey: notificationKeys.list() });
      void qc.invalidateQueries({ queryKey: notificationKeys.unreadCount() });
    },
  });
}

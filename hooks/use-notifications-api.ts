import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

export interface Notification {
  id: string;
  userId: string;
  type: string;
  title: string;
  body: string | null;
  href: string | null;
  readAt: Date | null;
  createdAt: Date;
}

export function useNotifications() {
  return useQuery({
    queryKey: ["notifications"],
    queryFn: async (): Promise<Notification[]> => {
      const response = await fetch("/api/v1/notifications");
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
    queryKey: ["unread-count"],
    queryFn: async (): Promise<number> => {
      const response = await fetch("/api/v1/notifications/unread-count");
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
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (notificationId: string) => {
      const response = await fetch(
        `/api/v1/notifications/${notificationId}/read`,
        {
          method: "PATCH",
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
    onSuccess: () => {
      // Invalidate notifications and unread count
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
      queryClient.invalidateQueries({ queryKey: ["unread-count"] });
    },
  });
}

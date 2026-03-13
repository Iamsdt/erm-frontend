import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"

import { toast } from "@/components/ui/use-toast"
import {
  deleteNotification,
  getNotifications,
  markAllNotificationsRead,
  markNotificationRead,
} from "@api/notifications.api"

const QUERY_KEY = "notifications"
const ERROR_DESCRIPTION = "Something went wrong. Please try again."

/**
 * React Query hook to fetch all notifications.
 * @returns {import("@tanstack/react-query").UseQueryResult} Query result with notifications
 */
export const useFetchNotifications = () => {
  return useQuery({
    queryKey: [QUERY_KEY],
    queryFn: async ({ signal }) => {
      const response = await getNotifications({ signal })
      return response.data
    },
    staleTime: 30 * 1000,
    retry: 2,
  })
}

/**
 * Mutation hook to mark a single notification as read.
 * @returns {import("@tanstack/react-query").UseMutationResult} Mutation result
 */
export const useMarkNotificationRead = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id) => markNotificationRead(id),
    onSuccess: () => {
      toast({
        title: "Marked as read",
        description: "Notification has been marked as read.",
      })
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY] })
    },
    onError: () => {
      toast({
        title: "Error",
        description: ERROR_DESCRIPTION,
        variant: "destructive",
      })
    },
  })
}

/**
 * Mutation hook to mark all notifications as read.
 * @returns {import("@tanstack/react-query").UseMutationResult} Mutation result
 */
export const useMarkAllNotificationsRead = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: () => markAllNotificationsRead(),
    onSuccess: () => {
      toast({
        title: "All read",
        description: "All notifications have been marked as read.",
      })
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY] })
    },
    onError: () => {
      toast({
        title: "Error",
        description: ERROR_DESCRIPTION,
        variant: "destructive",
      })
    },
  })
}

/**
 * Mutation hook to delete a notification.
 * @returns {import("@tanstack/react-query").UseMutationResult} Mutation result
 */
export const useDeleteNotification = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id) => deleteNotification(id),
    onSuccess: () => {
      toast({
        title: "Notification deleted",
        description: "Notification has been removed.",
      })
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY] })
    },
    onError: () => {
      toast({
        title: "Error",
        description: ERROR_DESCRIPTION,
        variant: "destructive",
      })
    },
  })
}

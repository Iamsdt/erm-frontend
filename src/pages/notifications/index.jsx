import { useEffect } from "react"
import { useDispatch } from "react-redux"

import { setNotificationCount } from "@/services/store/slices/app.slice"
import {
  useDeleteNotification,
  useFetchNotifications,
  useMarkAllNotificationsRead,
  useMarkNotificationRead,
} from "@query/notifications.query"

import NotificationsUI from "./notifications.ui"

/**
 * NotificationsPage — container for the notifications page.
 * Fetches notifications from the API and syncs unread count to Redux.
 */
const NotificationsPage = () => {
  const dispatch = useDispatch()
  const { data, isLoading, isError } = useFetchNotifications()
  const markRead = useMarkNotificationRead()
  const markAllRead = useMarkAllNotificationsRead()
  const remove = useDeleteNotification()

  const notifications = data?.notifications ?? []
  const unreadCount = data?.unreadCount ?? 0

  useEffect(() => {
    dispatch(setNotificationCount(unreadCount))
  }, [dispatch, unreadCount])

  return (
    <NotificationsUI
      notifications={notifications}
      isLoading={isLoading}
      isError={isError}
      onMarkAsRead={(id) => markRead.mutate(id)}
      onMarkAllAsRead={() => markAllRead.mutate()}
      onDelete={(id) => remove.mutate(id)}
    />
  )
}

export default NotificationsPage

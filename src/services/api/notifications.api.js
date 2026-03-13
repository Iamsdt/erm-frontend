import ct from "@constants/"

import api from "."

/**
 * Fetches all notifications for the current user.
 * @async
 * @param {object} options - Request options
 * @param {AbortSignal} [options.signal] - Abort signal for request cancellation
 * @returns {Promise} API response with notifications list
 */
export const getNotifications = async ({ signal } = {}) => {
  return api.get(ct.api.notifications.list, { signal })
}

/**
 * Marks a single notification as read.
 * @async
 * @param {string} id - Notification ID
 * @returns {Promise} API response
 */
export const markNotificationRead = async (id) => {
  return api.patch(`${ct.api.notifications.markRead}/${id}/read`)
}

/**
 * Marks all notifications as read.
 * @async
 * @returns {Promise} API response
 */
export const markAllNotificationsRead = async () => {
  return api.patch(ct.api.notifications.markAllRead)
}

/**
 * Deletes a notification.
 * @async
 * @param {string} id - Notification ID
 * @returns {Promise} API response
 */
export const deleteNotification = async (id) => {
  return api.delete(`${ct.api.notifications.delete}/${id}`)
}

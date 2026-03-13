import { http, HttpResponse } from "msw"

// ─── Seed data ────────────────────────────────────────────────────────────────

let notifications = [
  {
    id: "1",
    title: "Leave Request Pending Approval",
    message:
      "John Doe has requested 2 days of sick leave and is pending your approval.",
    time: "2026-03-13T09:50:00Z",
    read: false,
    type: "leave",
    action: "pending",
  },
  {
    id: "2",
    title: "Project Update",
    message:
      "The ERM Frontend project has been updated with new sprint tasks.",
    time: "2026-03-13T09:00:00Z",
    read: false,
    type: "project",
    action: "updated",
  },
  {
    id: "3",
    title: "Standup Reminder",
    message: "Don't forget to submit your daily standup.",
    time: "2026-03-13T08:00:00Z",
    read: true,
    type: "reminder",
    action: "reminder",
  },
  {
    id: "4",
    title: "System Maintenance",
    message:
      "Scheduled maintenance will occur this weekend from 2 AM to 6 AM.",
    time: "2026-03-12T10:00:00Z",
    read: true,
    type: "system",
    action: "info",
  },
  {
    id: "5",
    title: "Leave Approved",
    message: "Your leave request for March 20-21 has been approved.",
    time: "2026-03-11T14:30:00Z",
    read: true,
    type: "leave",
    action: "approved",
  },
  {
    id: "6",
    title: "New Team Member",
    message: "Eva Martinez has joined the Engineering department.",
    time: "2026-03-10T11:00:00Z",
    read: true,
    type: "system",
    action: "info",
  },
  {
    id: "7",
    title: "Leave Request Needs Review",
    message:
      "Sarah Chen has requested 5 days of vacation leave starting March 25.",
    time: "2026-03-13T07:30:00Z",
    read: false,
    type: "leave",
    action: "pending",
  },
  {
    id: "8",
    title: "Leave Rejected",
    message:
      "Your casual leave request for April 1 has been rejected by your manager.",
    time: "2026-03-12T16:00:00Z",
    read: false,
    type: "leave",
    action: "rejected",
  },
]

// ─── Handlers ─────────────────────────────────────────────────────────────────

const notificationHandlers = [
  // GET /api/v1/notifications
  http.get("*/v1/notifications", ({ request }) => {
    const url = new URL(request.url)
    if (url.pathname.includes("/read-all")) return undefined

    const unreadCount = notifications.filter((n) => !n.read).length
    return HttpResponse.json({ notifications, unreadCount })
  }),

  // PATCH /api/v1/notifications/:id/read
  http.patch("*/v1/notifications/:id/read", ({ params }) => {
    const notification = notifications.find((n) => n.id === params.id)
    if (!notification) {
      return new HttpResponse(null, { status: 404 })
    }
    notification.read = true
    return HttpResponse.json(notification)
  }),

  // PATCH /api/v1/notifications/read-all
  http.patch("*/v1/notifications/read-all", () => {
    for (const notification of notifications) {
      notification.read = true
    }
    return HttpResponse.json({ success: true })
  }),

  // DELETE /api/v1/notifications/:id
  http.delete("*/v1/notifications/:id", ({ params }) => {
    const index = notifications.findIndex((n) => n.id === params.id)
    if (index === -1) {
      return new HttpResponse(null, { status: 404 })
    }
    notifications = notifications.filter((n) => n.id !== params.id)
    return HttpResponse.json({ success: true })
  }),
]

export default notificationHandlers

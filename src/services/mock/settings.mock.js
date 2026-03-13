import { http, HttpResponse } from "msw"

// ─── Seed data ────────────────────────────────────────────────────────────────

let settings = {
  notifications: {
    emailAlerts: true,
    leaveUpdates: true,
    projectUpdates: true,
    attendanceReminders: false,
    weeklyDigest: true,
  },
}

// ─── Handlers ─────────────────────────────────────────────────────────────────

const settingsHandlers = [
  http.get("*/settings/", () => {
    return HttpResponse.json(settings)
  }),

  http.patch("*/settings/", async ({ request }) => {
    const body = await request.json()
    settings = { ...settings, ...body }
    if (body.notifications) {
      settings.notifications = { ...settings.notifications, ...body.notifications }
    }
    return HttpResponse.json(settings)
  }),
]

export default settingsHandlers

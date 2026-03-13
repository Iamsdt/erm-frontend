import { http, HttpResponse } from "msw"

// ─── Seed data ────────────────────────────────────────────────────────────────

const standups = [
  {
    id: "s1",
    name: "Alice Smith",
    role: "Frontend Developer",
    today: "Completed UI components library setup",
    blockers: "None",
    submittedAt: "2026-03-13T07:30:00Z",
  },
  {
    id: "s2",
    name: "Bob Jones",
    role: "Backend Developer",
    today: "Implemented API authentication",
    blockers: "Waiting for design specs",
    submittedAt: "2026-03-13T08:15:00Z",
  },
  {
    id: "s3",
    name: "Carol Davis",
    role: "Frontend Developer",
    today: "Fixed dashboard layout issues. Coordinating with backend on API integration.",
    blockers: "Backend API not ready",
    submittedAt: "2026-03-13T08:45:00Z",
  },
]

const teams = [
  {
    id: 1,
    name: "Frontend Team",
    members: [
      {
        id: 1,
        name: "Alice Smith",
        avatar: "A",
        role: "Lead Frontend Dev",
        update:
          "Completed responsive design for dashboard. Working on animations next.",
        status: "On Track",
        statusColor: "bg-green-100 text-green-800",
        submittedAt: "2026-03-13T09:30:00Z",
      },
      {
        id: 2,
        name: "Carol Davis",
        avatar: "C",
        role: "Frontend Dev",
        update:
          "Fixed dashboard layout issues. Coordinating with backend on API integration.",
        status: "Blocked",
        statusColor: "bg-yellow-100 text-yellow-800",
        submittedAt: "2026-03-13T09:00:00Z",
      },
    ],
  },
  {
    id: 2,
    name: "Backend Team",
    members: [
      {
        id: 3,
        name: "Bob Jones",
        avatar: "B",
        role: "Senior Backend Dev",
        update:
          "Implemented user authentication system. All tests passing. Ready for deployment.",
        status: "On Track",
        statusColor: "bg-green-100 text-green-800",
        submittedAt: "2026-03-13T09:15:00Z",
      },
      {
        id: 4,
        name: "David Wilson",
        avatar: "D",
        role: "Backend Dev",
        update:
          "Working on database optimization. Performance improved by 40%.",
        status: "On Track",
        statusColor: "bg-green-100 text-green-800",
        submittedAt: "2026-03-13T08:00:00Z",
      },
    ],
  },
]

const progressEntries = [
  {
    id: 1,
    date: "Today",
    entries: [
      {
        id: "pe1",
        task: "Completed sprint planning for Sprint 3",
        status: "completed",
        time: "10:30 AM",
        details: "All team members assigned and committed to sprint goals.",
      },
      {
        id: "pe2",
        task: "Fixed critical bug in payment module",
        status: "completed",
        time: "09:15 AM",
        details: "Caused by race condition. Added mutex locks.",
      },
    ],
  },
  {
    id: 2,
    date: "Yesterday",
    entries: [
      {
        id: "pe3",
        task: "Reviewed pull requests from team",
        status: "completed",
        time: "04:45 PM",
        details: "Approved 5 PRs, requested changes on 2.",
      },
      {
        id: "pe4",
        task: "Database migration testing",
        status: "in-progress",
        time: "02:00 PM",
        details: "85% complete. Testing edge cases.",
      },
    ],
  },
  {
    id: 3,
    date: "Past Week",
    entries: [
      {
        id: "pe5",
        task: "Implemented new user dashboard",
        status: "completed",
        time: "Mar 20",
        details: "Includes analytics, notifications, and quick actions.",
      },
      {
        id: "pe6",
        task: "Performance optimization",
        status: "completed",
        time: "Mar 19",
        details: "Reduced page load time by 45%.",
      },
      {
        id: "pe7",
        task: "API documentation update",
        status: "at-risk",
        time: "Mar 18",
        details: "Behind schedule. 60% complete.",
      },
    ],
  },
]

const projects = [
  { id: "p1", name: "ERM Frontend Redesign" },
  { id: "p2", name: "Backend API v2" },
  { id: "p3", name: "Mobile App MVP" },
]

const userStories = {
  p1: [
    { id: "us1", title: "ERM-101: Implement new dashboard layout" },
    { id: "us2", title: "ERM-105: Add dark mode support" },
    { id: "us3", title: "ERM-112: Refactor authentication flow" },
  ],
  p2: [
    { id: "us4", title: "API-201: Create user management endpoints" },
    { id: "us5", title: "API-205: Implement rate limiting" },
  ],
  p3: [
    { id: "us6", title: "MOB-301: Setup React Native project" },
    { id: "us7", title: "MOB-305: Implement push notifications" },
  ],
}

// ─── Handlers ─────────────────────────────────────────────────────────────────

const dailyUpdateHandlers = [
  // GET /api/v1/daily-update/standups
  http.get("*/v1/daily-update/standups", () => {
    return HttpResponse.json({
      standups,
      streak: 5,
      teamTotalMembers: 5,
      teamSubmittedCount: 3,
      teamCompletionPercent: 60,
    })
  }),

  // POST /api/v1/daily-update/standups
  http.post("*/v1/daily-update/standups", async ({ request }) => {
    const body = await request.json()
    const newStandup = {
      id: `s${Date.now()}`,
      ...body,
      submittedAt: new Date().toISOString(),
    }
    standups.push(newStandup)
    return HttpResponse.json(newStandup, { status: 201 })
  }),

  // GET /api/v1/daily-update/team-updates
  http.get("*/v1/daily-update/team-updates", () => {
    return HttpResponse.json({ teams })
  }),

  // GET /api/v1/daily-update/progress-log
  http.get("*/v1/daily-update/progress-log", () => {
    return HttpResponse.json({ sections: progressEntries })
  }),

  // GET /api/v1/daily-update/projects
  http.get("*/v1/daily-update/projects", () => {
    return HttpResponse.json({ projects })
  }),

  // GET /api/v1/daily-update/projects/:projectId/stories
  http.get("*/v1/daily-update/projects/:projectId/stories", ({ params }) => {
    const stories = userStories[params.projectId] ?? []
    return HttpResponse.json({ stories })
  }),

  // POST /api/v1/daily-update/standups/ai-review
  http.post("*/v1/daily-update/standups/ai-review", async ({ request }) => {
    const body = await request.json()
    const hasDetailedToday = body.updates?.some(
      (u) => u.today && u.today.length > 20
    )
    const approved = hasDetailedToday

    return HttpResponse.json({
      approved,
      feedback: approved
        ? "Your standup is well-structured with clear goals and blockers identified. Keep up the good work!"
        : "Please provide more details about your tasks. Consider breaking down your work into smaller milestones and identifying specific blockers.",
    })
  }),
]

export default dailyUpdateHandlers

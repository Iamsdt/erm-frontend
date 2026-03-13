import { http, HttpResponse } from "msw"

// ─── Seed data ────────────────────────────────────────────────────────────────

const auditEntries = [
  {
    id: "aud-001",
    timestamp: "2026-03-13T10:30:00Z",
    user: { name: "Sarah Chen", avatar: "SC" },
    module: "leave",
    action: "approved",
    target: "Leave request #LR-2041",
    details: "Approved 3-day vacation leave for John Doe (Mar 20-22)",
    ip: "192.168.1.45",
  },
  {
    id: "aud-002",
    timestamp: "2026-03-13T10:15:00Z",
    user: { name: "John Doe", avatar: "JD" },
    module: "attendance",
    action: "created",
    target: "Clock-in record",
    details: "Clocked in at 09:02 AM from office network",
    ip: "192.168.1.102",
  },
  {
    id: "aud-003",
    timestamp: "2026-03-13T09:45:00Z",
    user: { name: "Admin User", avatar: "AU" },
    module: "employee",
    action: "created",
    target: "Employee profile: Eva Martinez",
    details: "Added new employee to Engineering department",
    ip: "10.0.0.5",
  },
  {
    id: "aud-004",
    timestamp: "2026-03-13T09:30:00Z",
    user: { name: "Priya Sharma", avatar: "PS" },
    module: "project",
    action: "updated",
    target: "Project: ERM Frontend v2",
    details: "Updated sprint deadline from Mar 15 to Mar 18",
    ip: "192.168.1.88",
  },
  {
    id: "aud-005",
    timestamp: "2026-03-13T09:00:00Z",
    user: { name: "Admin User", avatar: "AU" },
    module: "settings",
    action: "updated",
    target: "Leave policy settings",
    details: "Changed annual leave quota from 20 to 22 days",
    ip: "10.0.0.5",
  },
  {
    id: "aud-006",
    timestamp: "2026-03-12T17:30:00Z",
    user: { name: "Sarah Chen", avatar: "SC" },
    module: "leave",
    action: "rejected",
    target: "Leave request #LR-2039",
    details: "Rejected sick leave request from Mike Ross — no medical certificate",
    ip: "192.168.1.45",
  },
  {
    id: "aud-007",
    timestamp: "2026-03-12T16:00:00Z",
    user: { name: "David Kim", avatar: "DK" },
    module: "project",
    action: "created",
    target: "Project: Mobile App Redesign",
    details: "Created new project with 3 initial sprints",
    ip: "192.168.1.67",
  },
  {
    id: "aud-008",
    timestamp: "2026-03-12T14:20:00Z",
    user: { name: "Admin User", avatar: "AU" },
    module: "employee",
    action: "updated",
    target: "Employee profile: John Doe",
    details: "Promoted to Senior Software Engineer, updated salary band",
    ip: "10.0.0.5",
  },
  {
    id: "aud-009",
    timestamp: "2026-03-12T11:45:00Z",
    user: { name: "Priya Sharma", avatar: "PS" },
    module: "attendance",
    action: "updated",
    target: "Attendance log #AT-5523",
    details: "Manual correction: adjusted clock-out time from 5:00 PM to 6:30 PM",
    ip: "192.168.1.88",
  },
  {
    id: "aud-010",
    timestamp: "2026-03-12T10:00:00Z",
    user: { name: "Admin User", avatar: "AU" },
    module: "employee",
    action: "deleted",
    target: "Employee profile: Alex Thompson",
    details: "Removed terminated employee record after 90-day retention",
    ip: "10.0.0.5",
  },
  {
    id: "aud-011",
    timestamp: "2026-03-11T16:30:00Z",
    user: { name: "Sarah Chen", avatar: "SC" },
    module: "leave",
    action: "approved",
    target: "Leave request #LR-2038",
    details: "Approved 1-day personal leave for Priya Sharma (Mar 14)",
    ip: "192.168.1.45",
  },
  {
    id: "aud-012",
    timestamp: "2026-03-11T15:00:00Z",
    user: { name: "David Kim", avatar: "DK" },
    module: "project",
    action: "deleted",
    target: "Sprint: Legacy Cleanup v1",
    details: "Deleted empty sprint with no tasks from Mobile App project",
    ip: "192.168.1.67",
  },
  {
    id: "aud-013",
    timestamp: "2026-03-11T13:15:00Z",
    user: { name: "Admin User", avatar: "AU" },
    module: "settings",
    action: "created",
    target: "Department: Data Science",
    details: "Created new department with default leave and attendance policies",
    ip: "10.0.0.5",
  },
  {
    id: "aud-014",
    timestamp: "2026-03-11T11:00:00Z",
    user: { name: "John Doe", avatar: "JD" },
    module: "leave",
    action: "created",
    target: "Leave request #LR-2040",
    details: "Submitted 2-day sick leave request for Mar 12-13",
    ip: "192.168.1.102",
  },
  {
    id: "aud-015",
    timestamp: "2026-03-11T09:30:00Z",
    user: { name: "Priya Sharma", avatar: "PS" },
    module: "project",
    action: "updated",
    target: "Task: API Integration Tests",
    details: "Moved task from In Progress to Done in Sprint #4",
    ip: "192.168.1.88",
  },
  {
    id: "aud-016",
    timestamp: "2026-03-10T17:00:00Z",
    user: { name: "Admin User", avatar: "AU" },
    module: "settings",
    action: "updated",
    target: "Attendance policy",
    details: "Enabled flexible hours for Engineering department",
    ip: "10.0.0.5",
  },
  {
    id: "aud-017",
    timestamp: "2026-03-10T14:30:00Z",
    user: { name: "Sarah Chen", avatar: "SC" },
    module: "attendance",
    action: "created",
    target: "Manual entry #ME-112",
    details: "Added manual attendance entry for remote worker Lisa Park",
    ip: "192.168.1.45",
  },
  {
    id: "aud-018",
    timestamp: "2026-03-10T12:00:00Z",
    user: { name: "David Kim", avatar: "DK" },
    module: "employee",
    action: "updated",
    target: "Employee profile: Lisa Park",
    details: "Updated work location from On-site to Remote",
    ip: "192.168.1.67",
  },
  {
    id: "aud-019",
    timestamp: "2026-03-10T10:15:00Z",
    user: { name: "John Doe", avatar: "JD" },
    module: "project",
    action: "created",
    target: "Task: Dark Mode Implementation",
    details: "Created new task in Sprint #5 with 8 story points",
    ip: "192.168.1.102",
  },
  {
    id: "aud-020",
    timestamp: "2026-03-10T09:00:00Z",
    user: { name: "Admin User", avatar: "AU" },
    module: "leave",
    action: "rejected",
    target: "Leave request #LR-2037",
    details: "Rejected vacation request from David Kim — team coverage insufficient",
    ip: "10.0.0.5",
  },
  {
    id: "aud-021",
    timestamp: "2026-03-09T16:45:00Z",
    user: { name: "Priya Sharma", avatar: "PS" },
    module: "employee",
    action: "created",
    target: "Employee profile: Ryan Cooper",
    details: "Onboarded new hire to QA department, start date Mar 10",
    ip: "192.168.1.88",
  },
  {
    id: "aud-022",
    timestamp: "2026-03-09T14:00:00Z",
    user: { name: "Sarah Chen", avatar: "SC" },
    module: "settings",
    action: "deleted",
    target: "Holiday: Company Retreat",
    details: "Removed cancelled company retreat from holiday calendar",
    ip: "192.168.1.45",
  },
  {
    id: "aud-023",
    timestamp: "2026-03-09T11:30:00Z",
    user: { name: "David Kim", avatar: "DK" },
    module: "attendance",
    action: "deleted",
    target: "Duplicate entry #AT-5510",
    details: "Removed duplicate clock-in record for Mar 9",
    ip: "192.168.1.67",
  },
  {
    id: "aud-024",
    timestamp: "2026-03-09T09:15:00Z",
    user: { name: "Admin User", avatar: "AU" },
    module: "project",
    action: "updated",
    target: "Project: ERM Frontend v2",
    details: "Added Priya Sharma and David Kim as project members",
    ip: "10.0.0.5",
  },
]

// ─── Filter helpers ──────────────────────────────────────────────────────────

const matchesModule = (entry, module) =>
  !module || module === "all" || entry.module === module

const matchesAction = (entry, action) =>
  !action || action === "all" || entry.action === action

const matchesDateRange = (entry, dateFrom, dateTo) => {
  const entryTime = new Date(entry.timestamp).getTime()
  if (dateFrom && entryTime < new Date(dateFrom).getTime()) return false
  if (dateTo && entryTime > new Date(dateTo).getTime()) return false
  return true
}

// ─── Handlers ─────────────────────────────────────────────────────────────────

const auditHandlers = [
  http.get("*/v1/audit/log", ({ request }) => {
    const url = new URL(request.url)
    const module = url.searchParams.get("module")
    const action = url.searchParams.get("action")
    const dateFrom = url.searchParams.get("dateFrom")
    const dateTo = url.searchParams.get("dateTo")

    const filtered = auditEntries.filter(
      (entry) =>
        matchesModule(entry, module) &&
        matchesAction(entry, action) &&
        matchesDateRange(entry, dateFrom, dateTo)
    )

    return HttpResponse.json({ entries: filtered, total: filtered.length })
  }),
]

export default auditHandlers

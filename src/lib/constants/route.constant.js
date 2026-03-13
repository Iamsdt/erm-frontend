const routes = {
  ROOT: "/",
  auth: {
    LOGIN: "login",
    SINGUP: "signup",
    FORGOT_PASSWORD: "forgot-password",
  },
  leave: {
    CALENDAR: "/leave/calendar",
    ADMIN_DASHBOARD: "/leave/admin",
    ADMIN_APPROVALS: "/leave/admin/approvals",
    ADMIN_MANUAL_RECORD: "/leave/admin/manual-record",
    ADMIN_SETTINGS: "/leave/admin/settings",
    EMPLOYEE_DASHBOARD: "/leave/employee",
    EMPLOYEE_REQUEST: "/leave/employee/request",
  },
  employeeManagement: {
    LIST: "/employee-management",
    CREATE: "/employee-management/create",
    EDIT: "/employee-management/edit/:id",
    INVITE: "/employee-management/invite",
    DEPARTMENTS: "/employee-management/departments",
    PROFILE_360: "/employee-management/profile/:id",
  },
  attendance: {
    EMPLOYEE_CLOCK: "/attendance",
    EMPLOYEE_HISTORY: "/attendance/history",
    ADMIN_LOGS: "/attendance/admin/logs",
    ADMIN_LIVE: "/attendance/admin/live",
    ADMIN_SUMMARY: "/attendance/admin/summary",
  },
  project: {
    LIST: "/projects",
    DETAIL: "/projects/:projectId",
    SPRINT: "/projects/:projectId/sprints/:sprintId",
    SETTINGS: "/projects/:projectId/settings",
    NOTE_CREATE: "/projects/:projectId/notes/new",
  },
  dailyUpdate: {
    HUB: "/daily-update",
    STANDUP: "/daily-update/standup",
    CREATE_STANDUP: "/daily-update/standup/new",
    TEAM: "/daily-update/team",
    PROGRESS: "/daily-update/progress",
  },
  ai: {
    HUB: "/ai",
    INSIGHTS: "/ai/insights",
    RECOMMENDATIONS: "/ai/recommendations",
    ANALYTICS: "/ai/analytics",
  },
  notifications: {
    INDEX: "/notifications",
  },
  profile: {
    MY_PROFILE: "/profile",
  },
  policy: {
    INDEX: "/policy",
  },
  rewards: {
    INDEX: "/rewards",
  },
  audit: {
    LOG: "/audit-log",
  },
}

export default routes

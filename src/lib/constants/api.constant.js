const EMPLOYEE_MANAGEMENT = "v1/employee-management"
const EMPLOYEE_MANAGEMENT_DEPARTMENTS = "v1/employee-management/departments"
const ATTENDANCE_ADMIN_LOGS = "v1/attendance/admin/logs"
const LEAVE_ADMIN_APPROVALS = "v1/leave/admin/approvals"
const PROFILE_ME = "profile/me/"
const NOTIFICATIONS = "v1/notifications"
const DAILY_UPDATE_STANDUPS = "v1/daily-update/standups"
const AI_RECOMMENDATIONS = "v1/ai/recommendations"
const TEAM_MANAGEMENT = "v1/teams"

const apiConstant = {
  auth: {
    me: "v1/auth/me",
  },
  comment: {
    comment: "comments/",
  },
  leave: {
    attendance: "v1/leave/attendance",
    adminSummary: "v1/leave/admin/summary",
    adminApprovals: LEAVE_ADMIN_APPROVALS,
    adminApprovalAction: LEAVE_ADMIN_APPROVALS,
    adminManualRecord: "v1/leave/admin/manual-record",
    adminEmployees: "v1/leave/admin/employees",
    employeeProfile: "v1/leave/employee/profile",
    employeeRequest: "v1/leave/employee/request",
    adminSettings: "v1/leave/admin/settings",
    attendanceDay: "v1/leave/attendance/day", // GET ?date=YYYY-MM-DD
  },
  employeeManagement: {
    list: EMPLOYEE_MANAGEMENT,
    create: EMPLOYEE_MANAGEMENT,
    detail: EMPLOYEE_MANAGEMENT, // /v1/employee-management/:id
    invite: `${EMPLOYEE_MANAGEMENT}/invite`,
    departments: EMPLOYEE_MANAGEMENT_DEPARTMENTS,
    departmentDetail: EMPLOYEE_MANAGEMENT_DEPARTMENTS, // /departments/:id
    performance: "v1/employee/performance",
    profile360: `${EMPLOYEE_MANAGEMENT}profile`, // /employee-management/profile/:id/
    bulkStatus: `${EMPLOYEE_MANAGEMENT}/bulk-status`,
    bulkDepartment: `${EMPLOYEE_MANAGEMENT}/bulk-department`,
  },
  attendance: {
    clockIn: "v1/attendance/clock-in",
    clockOut: "v1/attendance/clock-out",
    status: "v1/attendance/status",
    today: "v1/attendance/today",
    history: "v1/attendance/history",
    adminLogs: ATTENDANCE_ADMIN_LOGS,
    adminLogDetail: ATTENDANCE_ADMIN_LOGS, // append /{id}
    adminLogFlag: ATTENDANCE_ADMIN_LOGS, // append /{id}/flag
    adminManualEntry: "v1/attendance/admin/manual-entry",
    adminSummary: "v1/attendance/admin/summary",
    adminLive: "v1/attendance/admin/live",
  },
  project: {
    list: "projects/",
    detail: "projects/", // append {id}/
    sprints: (projectId) => `projects/${projectId}/sprints/`,
    sprintDetail: (projectId, sprintId) =>
      `projects/${projectId}/sprints/${sprintId}/`,
    tasks: (projectId, sprintId) =>
      `projects/${projectId}/sprints/${sprintId}/tasks/`,
  },
  profile: {
    me: PROFILE_ME,
    update: PROFILE_ME,
    changePassword: "profile/change-password/",
  },
  settings: {
    get: "settings/",
    update: "settings/",
  },
  policy: {
    list: "policies/",
    create: "policies/",
    detail: "policies", // append /{id}/
    update: "policies", // append /{id}/
    delete: "policies", // append /{id}/
  },
  rewards: {
    list: "rewards/",
    create: "rewards/",
    detail: "rewards", // append /{id}/
    myRewards: "rewards/my/",
  },
  notifications: {
    list: NOTIFICATIONS,
    markRead: NOTIFICATIONS, // append /{id}/read
    markAllRead: `${NOTIFICATIONS}/read-all`,
    delete: NOTIFICATIONS, // append /{id}
  },
  dailyUpdate: {
    standups: DAILY_UPDATE_STANDUPS,
    submitStandup: DAILY_UPDATE_STANDUPS,
    teamUpdates: "v1/daily-update/team-updates",
    progressLog: "v1/daily-update/progress-log",
    projects: "v1/daily-update/projects",
    userStories: (projectId) => `v1/daily-update/projects/${projectId}/stories`,
    aiReview: `${DAILY_UPDATE_STANDUPS}/ai-review`,
  },
  team: {
    list: TEAM_MANAGEMENT,
    create: TEAM_MANAGEMENT,
    detail: TEAM_MANAGEMENT, // append /{id}
    updateResponsibilities: TEAM_MANAGEMENT, // append /{id}/responsibilities
  },
  holidays: {
    list: "v1/holidays",
  },
  ai: {
    insights: "v1/ai/insights",
    recommendations: AI_RECOMMENDATIONS,
    analytics: "v1/ai/analytics",
    updateRecommendation: AI_RECOMMENDATIONS, // append /{id}
    chat: "v1/ai/chat",
  },
  audit: {
    log: "v1/audit/log",
  },
}
export default apiConstant

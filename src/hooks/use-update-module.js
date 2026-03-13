import { useEffect } from "react"
import { useDispatch } from "react-redux"
import { useLocation } from "react-router"

import { setCurrentModule } from "@/services/store/slices/app.slice"

// Status constants
const STATUS_DASHBOARD = "Dashboard"
const STATUS_ATTENDANCE = "Attendance"
const STATUS_ATTENDANCE_ADMIN = "Attendance Admin"
const STATUS_LEAVE_CALENDAR = "Leave Calendar"
const STATUS_LEAVE = "Leave"
const STATUS_LEAVE_ADMIN = "Leave Admin"
const STATUS_MY_LEAVE = "My Leave"
const STATUS_PROJECTS = "Projects"
const STATUS_PROJECT_DETAILS = "Project Details"
const STATUS_SPRINT_BOARD = "Sprint Board"
const STATUS_EMPLOYEE_MANAGEMENT = "Employee Management"
const STATUS_CREATE_EMPLOYEE = "Create Employee"
const STATUS_EDIT_EMPLOYEE = "Edit Employee"
const STATUS_INVITE_USERS = "Invite Users"
const STATUS_DEPARTMENTS = "Departments"
const STATUS_DAILY_UPDATES = "Daily Updates"
const STATUS_POST_STANDUP = "Post Standup"
const STATUS_DAILY_STANDUP = "Daily Standup"
const STATUS_TEAM_UPDATES = "Team Updates"
const STATUS_PROGRESS_LOG = "Progress Log"
const STATUS_AI = "AI & Analytics"
const STATUS_AI_INSIGHTS = "AI Insights"
const STATUS_AI_RECOMMENDATIONS = "AI Recommendations"
const STATUS_AI_ANALYTICS = "AI Analytics"
const STATUS_NOTIFICATIONS = "Notifications"
const STATUS_PROFILE = "Profile"
const STATUS_POLICY = "Policy"
const STATUS_REWARDS = "Rewards"

const EMP_MGMT_PREFIX = "/employee-management"

// Module mapping based on route paths (ordered from most to least specific)
const MODULE_MAP = {
  "/": STATUS_DASHBOARD,
  "/attendance/admin/logs": STATUS_ATTENDANCE_ADMIN,
  "/attendance/admin/live": STATUS_ATTENDANCE_ADMIN,
  "/attendance/admin/summary": STATUS_ATTENDANCE_ADMIN,
  "/attendance/history": STATUS_ATTENDANCE,
  "/attendance": STATUS_ATTENDANCE,
  "/leave/calendar": STATUS_LEAVE_CALENDAR,
  "/leave/employee": STATUS_MY_LEAVE,
  "/leave/admin/approvals": STATUS_LEAVE_ADMIN,
  "/leave/admin/settings": STATUS_LEAVE_ADMIN,
  "/leave/admin/manual-record": STATUS_LEAVE_ADMIN,
  "/leave/admin": STATUS_LEAVE_ADMIN,
  "/leave": STATUS_LEAVE,
  [`${EMP_MGMT_PREFIX}/create`]: STATUS_CREATE_EMPLOYEE,
  [`${EMP_MGMT_PREFIX}/invite`]: STATUS_INVITE_USERS,
  [`${EMP_MGMT_PREFIX}/departments`]: STATUS_DEPARTMENTS,
  [`${EMP_MGMT_PREFIX}/edit`]: STATUS_EDIT_EMPLOYEE,
  [`${EMP_MGMT_PREFIX}/profile`]: STATUS_EMPLOYEE_MANAGEMENT,
  [EMP_MGMT_PREFIX]: STATUS_EMPLOYEE_MANAGEMENT,
  "/projects": STATUS_PROJECTS,
  "/daily-update/standup/new": STATUS_POST_STANDUP,
  "/daily-update/standup": STATUS_DAILY_STANDUP,
  "/daily-update/team": STATUS_TEAM_UPDATES,
  "/daily-update/progress": STATUS_PROGRESS_LOG,
  "/daily-update": STATUS_DAILY_UPDATES,
  "/ai/insights": STATUS_AI_INSIGHTS,
  "/ai/recommendations": STATUS_AI_RECOMMENDATIONS,
  "/ai/analytics": STATUS_AI_ANALYTICS,
  "/ai": STATUS_AI,
  "/notifications": STATUS_NOTIFICATIONS,
  "/profile": STATUS_PROFILE,
  "/policy": STATUS_POLICY,
  "/rewards": STATUS_REWARDS,
}

/**
 * Determines the module name from the current pathname.
 * @param {string} pathname - Current route path.
 * @returns {string} Module display name for the header.
 */
const getModuleFromPath = (pathname) => {
  // Exact match first
  if (MODULE_MAP[pathname]) {
    return MODULE_MAP[pathname]
  }

  // Handle dynamic project routes
  const PROJECTS_PREFIX = "/projects/"
  if (pathname.startsWith(PROJECTS_PREFIX) && pathname.includes("/sprints/")) {
    return STATUS_SPRINT_BOARD
  }

  if (pathname.startsWith(PROJECTS_PREFIX)) {
    return STATUS_PROJECT_DETAILS
  }

  // Handle dynamic employee routes
  if (pathname.startsWith(`${EMP_MGMT_PREFIX}/edit`)) {
    return STATUS_EDIT_EMPLOYEE
  }

  if (pathname.startsWith(`${EMP_MGMT_PREFIX}/profile`)) {
    return STATUS_EMPLOYEE_MANAGEMENT
  }

  // Prefix match — find the longest matching prefix
  const sortedRoutes = Object.keys(MODULE_MAP).sort(
    (a, b) => b.length - a.length
  )
  for (const route of sortedRoutes) {
    if (pathname.startsWith(route) && !route.includes(":")) {
      return MODULE_MAP[route]
    }
  }

  return "ERM"
}

/**
 * Hook to update the current module based on route.
 */
export const useUpdateModule = () => {
  const location = useLocation()
  const dispatch = useDispatch()

  useEffect(() => {
    const module = getModuleFromPath(location.pathname)
    dispatch(setCurrentModule(module))
  }, [location.pathname, dispatch])
}

export default useUpdateModule

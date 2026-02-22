import { useEffect } from "react"
import { useDispatch } from "react-redux"
import { useLocation } from "react-router"

import { setCurrentModule } from "@/services/store/slices/app.slice"

// Status constants
const STATUS_ATTENDANCE = "Attendance"
const STATUS_ATTENDANCE_ADMIN = "Attendance Admin"
const STATUS_LEAVE = "Leave"
const STATUS_LEAVE_ADMIN = "Leave Admin"
const STATUS_PROJECTS = "Projects"
const STATUS_PROJECT_DETAILS = "Project Details"
const STATUS_SPRINT_BOARD = "Sprint Board"
const STATUS_EMPLOYEE_MANAGEMENT = "Employee Management"
const STATUS_CREATE_EMPLOYEE = "Create Employee"
const STATUS_EDIT_EMPLOYEE = "Edit Employee"
const STATUS_INVITE_USERS = "Invite Users"
const STATUS_DEPARTMENTS = "Departments"
const STATUS_POST_STANDUP = "Post Standup"
const STATUS_TEAM_UPDATES = "Team Updates"
const STATUS_PROGRESS_LOG = "Progress Log"
const STATUS_AI = "AI"
const STATUS_COMMENTS = "Comments"
const STATUS_USERS = "Users"
const STATUS_ACCOUNT = "Account"
const STATUS_AI_INSIGHTS = "AI Insights"
const STATUS_AI_RECOMMENDATIONS = "AI Recommendations"
const STATUS_AI_ANALYTICS = "AI Analytics"
const STATUS_DASHBOARD = "Dashboard"
const STATUS_LEAVE_CALENDAR = "Leave Calendar"
const STATUS_MY_LEAVE = "My Leave"

// Module mapping based on route paths
const MODULE_MAP = {
  "/": STATUS_DASHBOARD,
  "/projects": STATUS_PROJECTS,
  "/projects/:id": STATUS_PROJECT_DETAILS,
  "/projects/:id/sprint/:sprintId": STATUS_SPRINT_BOARD,
  "/attendance": STATUS_ATTENDANCE,
  "/attendance/history": STATUS_ATTENDANCE,
  "/attendance/admin": STATUS_ATTENDANCE_ADMIN,
  "/attendance/admin/logs": STATUS_ATTENDANCE_ADMIN,
  "/attendance/admin/live": STATUS_ATTENDANCE_ADMIN,
  "/attendance/admin/summary": STATUS_ATTENDANCE_ADMIN,
  "/leave": STATUS_LEAVE,
  "/leave/calendar": STATUS_LEAVE_CALENDAR,
  "/leave/employee": STATUS_MY_LEAVE,
  "/leave/admin": STATUS_LEAVE_ADMIN,
  "/leave/admin/approvals": STATUS_LEAVE_ADMIN,
  "/leave/admin/settings": STATUS_LEAVE_ADMIN,
  "/employee-management": STATUS_EMPLOYEE_MANAGEMENT,
  "/employee-management/create": STATUS_CREATE_EMPLOYEE,
  "/employee-management/edit": STATUS_EDIT_EMPLOYEE,
  "/employee-management/invite": STATUS_INVITE_USERS,
  "/employee-management/departments": STATUS_DEPARTMENTS,
  "/daily-update/standup/new": STATUS_POST_STANDUP,
  "/daily-update/team": STATUS_TEAM_UPDATES,
  "/daily-update/progress": STATUS_PROGRESS_LOG,
  "/ai/insights": STATUS_AI_INSIGHTS,
  "/ai/recommendations": STATUS_AI_RECOMMENDATIONS,
  "/ai/analytics": STATUS_AI_ANALYTICS,
  "/comments": STATUS_COMMENTS,
  "/users": STATUS_USERS,
  "/account": STATUS_ACCOUNT,
}

/**
 * Determines the module name from the current pathname
 */
const getModuleFromPath = (pathname) => {
  // Exact match first
  if (MODULE_MAP[pathname]) {
    return MODULE_MAP[pathname]
  }

  // Handle dynamic routes
  if (pathname.startsWith("/projects/") && pathname.includes("/sprint/")) {
    return STATUS_SPRINT_BOARD
  }

  if (pathname.startsWith("/projects/")) {
    return STATUS_PROJECT_DETAILS
  }

  if (pathname.startsWith("/employee-management/edit")) {
    return STATUS_EDIT_EMPLOYEE
  }

  // Partial match
  for (const [route, module] of Object.entries(MODULE_MAP)) {
    if (pathname.startsWith(route) && !route.includes(":")) {
      return module
    }
  }

  // Default
  return "ERM"
}

/**
 * Hook to update the current module based on route
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

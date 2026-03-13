import { lazy } from "react"

import AttendanceRoleGuard from "@/components/guards/attendance-role-guard"
import EmployeeManagementGuard from "@/components/guards/employee-management-guard"
import LeaveRoleGuard from "@/components/guards/leave-role-guard"
import ct from "@constants/"

// Lazy load route components for code splitting
const Dashboard = lazy(() => import("@pages/dashboard"))
const LeaveCalendar = lazy(() => import("@pages/leave-dashboard"))
const AdminDashboard = lazy(() => import("@pages/leave-admin"))
const ApprovalsPage = lazy(() => import("@pages/leave-admin/approvals"))
const ManualRecordPage = lazy(() => import("@pages/leave-admin/manual-record"))
const LeaveSettingsPage = lazy(() => import("@pages/leave-admin/settings"))
const EmployeeDashboard = lazy(() => import("@pages/leave-employee"))
const RequestLeavePage = lazy(() => import("@pages/leave-employee/request"))

// Attendance pages
const AttendanceClock = lazy(() => import("@pages/attendance/employee"))
const AttendanceHistory = lazy(
  () => import("@pages/attendance/employee/history")
)
const AdminAttendanceLogs = lazy(() => import("@pages/attendance/admin/logs"))
const AdminLiveStatus = lazy(() => import("@pages/attendance/admin/live"))
const AdminSummary = lazy(() => import("@pages/attendance/admin/summary"))

// Employee Management pages (admin-only module)
const EmployeeList = lazy(() => import("@pages/employee-management"))
const CreateEmployee = lazy(() => import("@pages/employee-management/create"))
const EditEmployee = lazy(() => import("@pages/employee-management/edit"))
const InviteUsers = lazy(() => import("@pages/employee-management/invite"))
const DepartmentList = lazy(
  () => import("@pages/employee-management/departments")
)
const Employee360 = lazy(() => import("@pages/employee-management/profile-360"))

// Project Management pages
const Projects = lazy(() => import("@pages/projects"))
const ProjectDetails = lazy(() => import("@pages/projects/project-details"))
const SprintBoard = lazy(() => import("@pages/sprint-board"))
const ProjectSettings = lazy(() => import("@pages/projects/project-settings"))
const CreateNotePage = lazy(
  () => import("@pages/projects/notes/create-note.page")
)

// Daily Update pages
const DailyUpdateHub = lazy(() => import("@pages/daily-update"))
const DailyStandupPage = lazy(() => import("@pages/daily-update/standup"))
const CreateStandupPage = lazy(
  () => import("@pages/daily-update/create-standup")
)
const TeamUpdatesPage = lazy(() => import("@pages/daily-update/team"))
const ProgressLogPage = lazy(() => import("@pages/daily-update/progress"))

// AI & Analytics pages
const AIHubPage = lazy(() => import("@pages/ai"))
const AIInsightsPage = lazy(() => import("@pages/ai/insights"))
const AIRecommendationsPage = lazy(() => import("@pages/ai/recommendations"))
const AIAnalyticsPage = lazy(() => import("@pages/ai/analytics"))

// Audit / Activity Log
const AuditPage = lazy(() => import("@pages/audit"))

// Notifications
const NotificationsPage = lazy(() => import("@pages/notifications"))

// Profile, Policy, Rewards
const ProfilePage = lazy(() => import("@pages/profile"))
const PolicyPage = lazy(() => import("@pages/policy"))
const RewardsPage = lazy(() => import("@pages/rewards"))

const leaveGuard = (element, allowedRoles) => (
  <LeaveRoleGuard allowedRoles={allowedRoles}>{element}</LeaveRoleGuard>
)

const empGuard = (element) => (
  <EmployeeManagementGuard>{element}</EmployeeManagementGuard>
)

const attendanceGuard = (element, allowedRoles) => (
  <AttendanceRoleGuard allowedRoles={allowedRoles}>
    {element}
  </AttendanceRoleGuard>
)

const mainRoutes = [
  { path: ct.route.ROOT, element: <Dashboard /> },
  { path: ct.route.leave.CALENDAR, element: <LeaveCalendar /> },

  // Leave — admin-only routes
  {
    path: ct.route.leave.ADMIN_DASHBOARD,
    element: leaveGuard(<AdminDashboard />, ["admin"]),
  },
  {
    path: ct.route.leave.ADMIN_APPROVALS,
    element: leaveGuard(<ApprovalsPage />, ["admin"]),
  },
  {
    path: ct.route.leave.ADMIN_MANUAL_RECORD,
    element: leaveGuard(<ManualRecordPage />, ["admin"]),
  },
  {
    path: ct.route.leave.ADMIN_SETTINGS,
    element: leaveGuard(<LeaveSettingsPage />, ["admin"]),
  },

  // Leave — employee-only routes
  {
    path: ct.route.leave.EMPLOYEE_DASHBOARD,
    element: leaveGuard(<EmployeeDashboard />, ["employee"]),
  },
  {
    path: ct.route.leave.EMPLOYEE_REQUEST,
    element: leaveGuard(<RequestLeavePage />, ["employee"]),
  },

  // Attendance — employee routes
  {
    path: ct.route.attendance.EMPLOYEE_CLOCK,
    element: attendanceGuard(<AttendanceClock />, ["admin", "employee"]),
  },
  {
    path: ct.route.attendance.EMPLOYEE_HISTORY,
    element: attendanceGuard(<AttendanceHistory />, ["admin", "employee"]),
  },

  // Attendance — admin-only routes
  {
    path: ct.route.attendance.ADMIN_LOGS,
    element: attendanceGuard(<AdminAttendanceLogs />, ["admin"]),
  },
  {
    path: ct.route.attendance.ADMIN_LIVE,
    element: attendanceGuard(<AdminLiveStatus />, ["admin"]),
  },
  {
    path: ct.route.attendance.ADMIN_SUMMARY,
    element: attendanceGuard(<AdminSummary />, ["admin"]),
  },

  // Employee Management — admin-only routes
  {
    path: ct.route.employeeManagement.LIST,
    element: empGuard(<EmployeeList />),
  },
  {
    path: ct.route.employeeManagement.CREATE,
    element: empGuard(<CreateEmployee />),
  },
  {
    path: ct.route.employeeManagement.EDIT,
    element: empGuard(<EditEmployee />),
  },
  {
    path: ct.route.employeeManagement.INVITE,
    element: empGuard(<InviteUsers />),
  },
  {
    path: ct.route.employeeManagement.DEPARTMENTS,
    element: empGuard(<DepartmentList />),
  },
  {
    path: ct.route.employeeManagement.PROFILE_360,
    element: empGuard(<Employee360 />),
  },

  // Project Management routes
  {
    path: ct.route.project.LIST,
    element: <Projects />,
  },
  {
    path: ct.route.project.DETAIL,
    element: <ProjectDetails />,
  },
  {
    path: ct.route.project.SPRINT,
    element: <SprintBoard />,
  },
  {
    path: ct.route.project.SETTINGS,
    element: <ProjectSettings />,
  },
  {
    path: ct.route.project.NOTE_CREATE,
    element: <CreateNotePage />,
  },

  // Daily Updates routes
  {
    path: ct.route.dailyUpdate.HUB,
    element: <DailyUpdateHub />,
  },
  {
    path: ct.route.dailyUpdate.STANDUP,
    element: <DailyStandupPage />,
  },
  {
    path: ct.route.dailyUpdate.CREATE_STANDUP,
    element: <CreateStandupPage />,
  },
  {
    path: ct.route.dailyUpdate.TEAM,
    element: <TeamUpdatesPage />,
  },
  {
    path: ct.route.dailyUpdate.PROGRESS,
    element: <ProgressLogPage />,
  },

  // AI & Analytics routes
  {
    path: ct.route.ai.HUB,
    element: <AIHubPage />,
  },
  {
    path: ct.route.ai.INSIGHTS,
    element: <AIInsightsPage />,
  },
  {
    path: ct.route.ai.RECOMMENDATIONS,
    element: <AIRecommendationsPage />,
  },
  {
    path: ct.route.ai.ANALYTICS,
    element: <AIAnalyticsPage />,
  },

  // Audit / Activity Log
  {
    path: ct.route.audit.LOG,
    element: <AuditPage />,
  },

  // Notifications
  {
    path: ct.route.notifications.INDEX,
    element: <NotificationsPage />,
  },

  // Profile
  {
    path: ct.route.profile.MY_PROFILE,
    element: <ProfilePage />,
  },

  // Policy Management (all authenticated users)
  {
    path: ct.route.policy.INDEX,
    element: <PolicyPage />,
  },

  // Rewards
  {
    path: ct.route.rewards.INDEX,
    element: <RewardsPage />,
  },
]

export default mainRoutes

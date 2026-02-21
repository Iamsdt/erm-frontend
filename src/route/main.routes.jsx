import { lazy } from "react"

import EmployeeManagementGuard from "@/components/guards/employee-management-guard"
import LeaveRoleGuard from "@/components/guards/leave-role-guard"
import AttendanceRoleGuard from "@/components/guards/attendance-role-guard"
import ct from "@constants/"

// Lazy load route components for code splitting
const Dashboard = lazy(() => import("@pages/dashboard"))
const Comments = lazy(() => import("@pages/comments"))
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

const leaveGuard = (element, allowedRoles) => (
  <LeaveRoleGuard allowedRoles={allowedRoles}>{element}</LeaveRoleGuard>
)

const empGuard = (element) => (
  <EmployeeManagementGuard>{element}</EmployeeManagementGuard>
)

const attendanceGuard = (element, allowedRoles) => (
  <AttendanceRoleGuard allowedRoles={allowedRoles}>{element}</AttendanceRoleGuard>
)

const mainRoutes = [
  { path: ct.route.ROOT, element: <Dashboard /> },
  { path: "/comments", element: <Comments /> },
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

  // Attendance — employee routes (accessible to authenticated users)
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
]

export default mainRoutes

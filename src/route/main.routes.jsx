import { lazy } from "react"

import LeaveRoleGuard from "@/components/guards/leave-role-guard"
import ct from "@constants/"

// Lazy load route components for code splitting
const Dashboard = lazy(() => import("@pages/dashboard"))
const Comments = lazy(() => import("@pages/comments"))
const LeaveCalendar = lazy(() => import("@pages/leave-dashboard"))
const AdminDashboard = lazy(() => import("@pages/leave-admin"))
const ApprovalsPage = lazy(() => import("@pages/leave-admin/approvals"))
const ManualRecordPage = lazy(() => import("@pages/leave-admin/manual-record"))
const EmployeeDashboard = lazy(() => import("@pages/leave-employee"))
const RequestLeavePage = lazy(() => import("@pages/leave-employee/request"))

const guard = (element, allowedRoles) => (
  <LeaveRoleGuard allowedRoles={allowedRoles}>{element}</LeaveRoleGuard>
)

const mainRoutes = [
  { path: ct.route.ROOT, element: <Dashboard /> },
  { path: "/comments", element: <Comments /> },
  { path: ct.route.leave.CALENDAR, element: <LeaveCalendar /> },

  // Admin-only routes
  {
    path: ct.route.leave.ADMIN_DASHBOARD,
    element: guard(<AdminDashboard />, ["admin"]),
  },
  {
    path: ct.route.leave.ADMIN_APPROVALS,
    element: guard(<ApprovalsPage />, ["admin"]),
  },
  {
    path: ct.route.leave.ADMIN_MANUAL_RECORD,
    element: guard(<ManualRecordPage />, ["admin"]),
  },

  // Employee-only routes
  {
    path: ct.route.leave.EMPLOYEE_DASHBOARD,
    element: guard(<EmployeeDashboard />, ["employee"]),
  },
  {
    path: ct.route.leave.EMPLOYEE_REQUEST,
    element: guard(<RequestLeavePage />, ["employee"]),
  },
]

export default mainRoutes

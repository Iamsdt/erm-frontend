const routes = {
  ROOT: "/",
  auth: {
    LOGIN: "login",
    SINGUP: "signup",
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
  },
}

export default routes

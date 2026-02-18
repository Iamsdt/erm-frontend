const apiConstant = {
  comment: {
    comment: "comments/",
  },
  leave: {
    attendance: "leave/attendance/",
    adminSummary: "leave/admin/summary/",
    adminApprovals: "leave/admin/approvals/",
    adminApprovalAction: "leave/admin/approvals",
    adminManualRecord: "leave/admin/manual-record/",
    adminEmployees: "leave/admin/employees/",
    employeeProfile: "leave/employee/profile/",
    employeeRequest: "leave/employee/request/",
    adminSettings: "leave/admin/settings/",
    attendanceDay: "leave/attendance/day/", // GET ?date=YYYY-MM-DD
  },
  employeeManagement: {
    list: "employee-management/",
    create: "employee-management/",
    detail: "employee-management", // /employee-management/:id/
    invite: "employee-management/invite/",
    departments: "employee-management/departments",
    departmentDetail: "employee-management/departments", // /departments/:id/
  },
}
export default apiConstant

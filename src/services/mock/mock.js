import attendanceHandler from "./attendance.mock"
import commentHandler from "./comments"
import departmentHandler from "./department"
import employeeManagementHandler from "./employee-management"
import leaveHandler from "./leave"
import leaveDashboardHandler from "./leave-dashboard"

const handlers = [
  ...attendanceHandler,
  ...commentHandler,
  ...leaveHandler,
  ...leaveDashboardHandler,
  ...employeeManagementHandler,
  ...departmentHandler,
]

export default handlers

import attendanceHandler from "./attendance.mock"
import commentHandler from "./comments"
import departmentHandler from "./department"
import employeeManagementHandler from "./employee-management"
import leaveHandler from "./leave"
import leaveDashboardHandler from "./leave-dashboard"
import { projectHandlers } from "./project.mock"

const handlers = [
  ...attendanceHandler,
  ...commentHandler,
  ...leaveHandler,
  ...leaveDashboardHandler,
  ...employeeManagementHandler,
  ...departmentHandler,
  ...projectHandlers,
]

export default handlers

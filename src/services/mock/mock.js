import attendanceHandler from "./attendance.mock"
import commentHandler from "./comments"
import departmentHandler from "./department"
import employeeManagementHandler from "./employee-management"
import leaveHandler from "./leave"
import leaveDashboardHandler from "./leave-dashboard"
import policyHandlers from "./policy.mock"
import profileHandlers from "./profile.mock"
import { projectHandlers } from "./project.mock"
import rewardHandlers from "./rewards.mock"

const handlers = [
  ...attendanceHandler,
  ...commentHandler,
  ...leaveHandler,
  ...leaveDashboardHandler,
  ...employeeManagementHandler,
  ...departmentHandler,
  ...projectHandlers,
  ...profileHandlers,
  ...policyHandlers,
  ...rewardHandlers,
]

export default handlers

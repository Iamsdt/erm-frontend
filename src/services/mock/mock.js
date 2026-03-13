import aiHandlers from "./ai.mock"
import auditHandlers from "./audit.mock"
import attendanceHandler from "./attendance.mock"
import commentHandler from "./comments"
import dailyUpdateHandlers from "./daily-update.mock"
import departmentHandler from "./department"
import employeeManagementHandler from "./employee-management"
import leaveHandler from "./leave"
import leaveDashboardHandler from "./leave-dashboard"
import notificationHandlers from "./notifications.mock"
import policyHandlers from "./policy.mock"
import profileHandlers from "./profile.mock"
import { projectHandlers } from "./project.mock"
import rewardHandlers from "./rewards.mock"
import holidayHandlers from "./holidays.mock"
import settingsHandlers from "./settings.mock"
import teamHandlers from "./team.mock"

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
  ...notificationHandlers,
  ...dailyUpdateHandlers,
  ...aiHandlers,
  ...teamHandlers,
  ...settingsHandlers,
  ...holidayHandlers,
  ...auditHandlers,
]

export default handlers

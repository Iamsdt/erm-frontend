import commentHandler from "./comments"
import leaveDashboardHandler from "./leave-dashboard"
import leaveHandler from "./leave"

const handlers = [...commentHandler, ...leaveHandler, ...leaveDashboardHandler]

export default handlers

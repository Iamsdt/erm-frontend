import commentHandler from "./comments"
import leaveHandler from "./leave"
import leaveDashboardHandler from "./leave-dashboard"

const handlers = [...commentHandler, ...leaveHandler, ...leaveDashboardHandler]

export default handlers

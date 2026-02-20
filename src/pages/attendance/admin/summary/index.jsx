import { useAdminAttendanceSummary } from "@query/attendance.query"

import AdminSummaryUI from "./summary.ui"

const AdminSummary = () => {
  const { data: summary, isLoading } = useAdminAttendanceSummary()

  return <AdminSummaryUI summary={summary} isLoading={isLoading} />
}

export default AdminSummary

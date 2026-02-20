import { useAdminLiveStatus } from "@query/attendance.query"

import AdminLiveUI from "./live.ui"

const AdminLive = () => {
  const { data: liveData, isLoading } = useAdminLiveStatus()

  return <AdminLiveUI liveData={liveData} isLoading={isLoading} />
}

export default AdminLive

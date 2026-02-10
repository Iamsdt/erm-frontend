import { useEffect } from "react"

import { toast } from "@/components/ui/use-toast"
import { useFetchAdminLeaveSummary } from "@query/leave.query"

import AdminDashboardUI from "./admin-dashboard.ui"

/**
 * AdminDashboard container — fetches leave summary data for the admin view.
 */
const AdminDashboard = () => {
  const { data, isLoading, isError, error } = useFetchAdminLeaveSummary()

  useEffect(() => {
    if (error) {
      toast({
        title: "Error",
        description: "Failed to load admin dashboard data.",
        variant: "destructive",
      })
    }
  }, [error])

  return (
    <AdminDashboardUI data={data} isLoading={isLoading} isError={isError} />
  )
}

export default AdminDashboard

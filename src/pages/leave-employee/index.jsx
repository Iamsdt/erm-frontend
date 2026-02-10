import { useEffect } from "react"

import { useNavigate } from "react-router-dom"

import { toast } from "@/components/ui/use-toast"
import ct from "@constants/"
import { useFetchEmployeeLeaveProfile } from "@query/leave.query"

import EmployeeDashboardUI from "./employee-dashboard.ui"

/**
 * EmployeeDashboard container — fetches the current employee's leave profile.
 */
const EmployeeDashboard = () => {
  const navigate = useNavigate()
  const { data, isLoading, isError, error } = useFetchEmployeeLeaveProfile()

  useEffect(() => {
    if (error) {
      toast({
        title: "Error",
        description: "Failed to load your leave profile.",
        variant: "destructive",
      })
    }
  }, [error])

  return (
    <EmployeeDashboardUI
      data={data}
      isLoading={isLoading}
      isError={isError}
      onRequestLeave={() => navigate(ct.route.leave.EMPLOYEE_REQUEST)}
    />
  )
}

export default EmployeeDashboard

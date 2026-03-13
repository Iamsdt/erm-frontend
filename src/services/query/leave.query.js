import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"

import { toast } from "@/components/ui/use-toast"
import {
  getAdminApprovals,
  getAdminEmployees,
  getAdminLeaveSummary,
  getAttendanceDayDetail,
  getEmployeeLeaveProfile,
  getLeaveSettings,
  getMonthlyAttendance,
  patchLeaveApproval,
  patchLeaveSettings,
  postLeaveRequest,
  postManualRecord,
} from "@api/leave.api"

const GENERIC_ERROR_DESCRIPTION = "Something went wrong. Please try again."

const QUERY_KEY_ADMIN_SUMMARY = "leave-admin-summary"
const QUERY_KEY_EMPLOYEE_PROFILE = "leave-employee-profile"
const QUERY_KEY_ADMIN_APPROVALS = "leave-admin-approvals"

/**
 * React Query hook for fetching monthly attendance data.
 * @param {number} year - The full year (e.g. 2025)
 * @param {number} month - 0-indexed (0=Jan)
 * @returns {import("@tanstack/react-query").UseQueryResult} The query result with monthly attendance data
 */
export const useFetchMonthlyAttendance = (year, month) => {
  return useQuery({
    queryKey: ["leave-attendance", year, month],
    queryFn: async ({ signal }) => {
      const response = await getMonthlyAttendance({ year, month, signal })
      return response.data
    },
    staleTime: 5 * 60 * 1000,
    retry: 2,
  })
}

/**
 * React Query hook for fetching the admin leave dashboard summary.
 * @returns {import("@tanstack/react-query").UseQueryResult} The query result with admin leave summary
 */
export const useFetchAdminLeaveSummary = () => {
  return useQuery({
    queryKey: [QUERY_KEY_ADMIN_SUMMARY],
    queryFn: async ({ signal }) => {
      const response = await getAdminLeaveSummary({ signal })
      return response.data
    },
    staleTime: 5 * 60 * 1000,
    retry: 2,
  })
}

/**
 * React Query hook for fetching the current employee's leave profile.
 * @returns {import("@tanstack/react-query").UseQueryResult} The query result with the employee leave profile
 */
export const useFetchEmployeeLeaveProfile = () => {
  return useQuery({
    queryKey: [QUERY_KEY_EMPLOYEE_PROFILE],
    queryFn: async ({ signal }) => {
      const response = await getEmployeeLeaveProfile({ signal })
      return response.data
    },
    staleTime: 5 * 60 * 1000,
    retry: 2,
  })
}

/**
 * React Query hook for fetching the full admin approvals list.
 * @returns {import("@tanstack/react-query").UseQueryResult} The query result with all leave approval requests
 */
export const useFetchAdminApprovals = () => {
  return useQuery({
    queryKey: [QUERY_KEY_ADMIN_APPROVALS],
    queryFn: async ({ signal }) => {
      const response = await getAdminApprovals({ signal })
      return response.data
    },
    staleTime: 0,
    retry: 2,
  })
}

/**
 * React Query hook for fetching the employee list (for manual record form).
 * @returns {import("@tanstack/react-query").UseQueryResult} The query result with the list of employees
 */
export const useFetchAdminEmployees = () => {
  return useQuery({
    queryKey: ["leave-admin-employees"],
    queryFn: async ({ signal }) => {
      const response = await getAdminEmployees({ signal })
      return response.data
    },
    staleTime: 10 * 60 * 1000,
    retry: 2,
  })
}

/**
 * Mutation hook to approve or reject a leave request.
 * Invalidates the approvals list on success.
 * @returns {import("@tanstack/react-query").UseMutationResult} The mutation result for approving/rejecting leave
 */
export const useApproveLeave = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, status, note }) => patchLeaveApproval(id, status, note),
    onSuccess: () => {
      toast({
        title: "Leave updated",
        description: "Leave request has been processed.",
      })
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY_ADMIN_APPROVALS] })
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY_ADMIN_SUMMARY] })
    },
    onError: () => {
      toast({
        title: "Error",
        description: GENERIC_ERROR_DESCRIPTION,
        variant: "destructive",
      })
    },
  })
}

/**
 * Mutation hook to post a manual attendance record.
 * @returns {import("@tanstack/react-query").UseMutationResult} The mutation result for posting a manual record
 */
export const usePostManualRecord = () => {
  return useMutation({
    mutationFn: (payload) => postManualRecord(payload),
    onSuccess: () => {
      toast({
        title: "Record saved",
        description: "Manual record has been saved.",
      })
    },
    onError: () => {
      toast({
        title: "Error",
        description: GENERIC_ERROR_DESCRIPTION,
        variant: "destructive",
      })
    },
  })
}

/**
 * Mutation hook to submit a leave request from the employee.
 * Invalidates the employee profile on success.
 * @returns {import("@tanstack/react-query").UseMutationResult} The mutation result for submitting a leave request
 */
export const usePostLeaveRequest = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (payload) => postLeaveRequest(payload),
    onSuccess: () => {
      toast({
        title: "Request submitted",
        description: "Your leave request has been submitted.",
      })
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY_EMPLOYEE_PROFILE] })
    },
    onError: () => {
      toast({
        title: "Error",
        description: GENERIC_ERROR_DESCRIPTION,
        variant: "destructive",
      })
    },
  })
}

const QUERY_KEY_LEAVE_SETTINGS = "leave-admin-settings"

/**
 * React Query hook for fetching leave management settings (admin only).
 * @returns {import("@tanstack/react-query").UseQueryResult} The query result with leave settings
 */
export const useFetchLeaveSettings = () => {
  return useQuery({
    queryKey: [QUERY_KEY_LEAVE_SETTINGS],
    queryFn: async ({ signal }) => {
      const response = await getLeaveSettings({ signal })
      return response.data
    },
    staleTime: 10 * 60 * 1000,
    retry: 2,
  })
}

/**
 * Mutation hook to update leave management settings.
 * Invalidates settings cache on success.
 * @returns {import("@tanstack/react-query").UseMutationResult} The mutation result
 */
export const useUpdateLeaveSettings = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (payload) => patchLeaveSettings(payload),
    onSuccess: () => {
      toast({
        title: "Settings saved",
        description: "Leave settings have been updated.",
      })
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY_LEAVE_SETTINGS] })
    },
    onError: () => {
      toast({
        title: "Error",
        description: GENERIC_ERROR_DESCRIPTION,
        variant: "destructive",
      })
    },
  })
}

/**
 * React Query hook for fetching per-employee attendance detail for a given date.
 * Only runs when a date string is provided (enabled by click on calendar day).
 * @param {string|null} date - ISO date string (YYYY-MM-DD) or null to skip
 * @returns {import("@tanstack/react-query").UseQueryResult} The query result with attendance detail for the specified date
 */
export const useFetchAttendanceDayDetail = (date) => {
  return useQuery({
    queryKey: ["leave-attendance-day", date],
    queryFn: async ({ signal }) => {
      const response = await getAttendanceDayDetail({ date, signal })
      return response.data
    },
    staleTime: 5 * 60 * 1000,
    retry: 2,
    enabled: Boolean(date),
  })
}

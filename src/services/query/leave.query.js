import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"

import {
  getAdminApprovals,
  getAdminEmployees,
  getAdminLeaveSummary,
  getEmployeeLeaveProfile,
  getMonthlyAttendance,
  patchLeaveApproval,
  postLeaveRequest,
  postManualRecord,
} from "@api/leave.api"

/**
 * React Query hook for fetching monthly attendance data.
 * @param {number} year
 * @param {number} month - 0-indexed (0=Jan)
 * @returns {import("@tanstack/react-query").UseQueryResult}
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
 * @returns {import("@tanstack/react-query").UseQueryResult}
 */
export const useFetchAdminLeaveSummary = () => {
  return useQuery({
    queryKey: ["leave-admin-summary"],
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
 * @returns {import("@tanstack/react-query").UseQueryResult}
 */
export const useFetchEmployeeLeaveProfile = () => {
  return useQuery({
    queryKey: ["leave-employee-profile"],
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
 * @returns {import("@tanstack/react-query").UseQueryResult}
 */
export const useFetchAdminApprovals = () => {
  return useQuery({
    queryKey: ["leave-admin-approvals"],
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
 * @returns {import("@tanstack/react-query").UseQueryResult}
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
 * @returns {import("@tanstack/react-query").UseMutationResult}
 */
export const useApproveLeave = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, status, note }) => patchLeaveApproval(id, status, note),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["leave-admin-approvals"] })
      queryClient.invalidateQueries({ queryKey: ["leave-admin-summary"] })
    },
  })
}

/**
 * Mutation hook to post a manual attendance record.
 * @returns {import("@tanstack/react-query").UseMutationResult}
 */
export const usePostManualRecord = () => {
  return useMutation({
    mutationFn: (payload) => postManualRecord(payload),
  })
}

/**
 * Mutation hook to submit a leave request from the employee.
 * Invalidates the employee profile on success.
 * @returns {import("@tanstack/react-query").UseMutationResult}
 */
export const usePostLeaveRequest = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (payload) => postLeaveRequest(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["leave-employee-profile"] })
    },
  })
}

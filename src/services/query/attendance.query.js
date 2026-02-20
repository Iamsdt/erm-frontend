import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"

import {
  getAdminAttendanceLogs,
  getAdminAttendanceSummary,
  getAdminLiveStatus,
  getAttendanceHistory,
  getAttendanceStatus,
  getTodayAttendance,
  patchAdminAttendanceEntry,
  patchAdminFlagEntry,
  postAdminManualEntry,
  postClockIn,
  postClockOut,
} from "@api/attendance.api"

// ─── Query Keys ───────────────────────────────────────────────────────────────

const QK_STATUS = "attendance-status"
const QK_TODAY = "attendance-today"
const QK_HISTORY = "attendance-history"
const QK_ADMIN_LOGS = "attendance-admin-logs"
const QK_ADMIN_LIVE = "attendance-admin-live"
const QK_ADMIN_SUMMARY = "attendance-admin-summary"

// ─── Employee Queries ─────────────────────────────────────────────────────────

/**
 * Hook to poll the current clock-in status for the authenticated employee.
 * Provides `willAutoExpire` and `expiresInSeconds` for the warning banner.
 * @returns {import("@tanstack/react-query").UseQueryResult}
 */
export const useAttendanceStatus = () => {
  return useQuery({
    queryKey: [QK_STATUS],
    queryFn: async ({ signal }) => {
      const response = await getAttendanceStatus({ signal })
      return response.data
    },
    staleTime: 30 * 1000,
    refetchInterval: 60 * 1000,
    retry: 2,
  })
}

/**
 * Hook to fetch today's full attendance detail.
 * @returns {import("@tanstack/react-query").UseQueryResult}
 */
export const useTodayAttendance = () => {
  return useQuery({
    queryKey: [QK_TODAY],
    queryFn: async ({ signal }) => {
      const response = await getTodayAttendance({ signal })
      return response.data
    },
    staleTime: 60 * 1000,
    retry: 2,
  })
}

/**
 * Hook to fetch paginated personal attendance history.
 * @param {number} year
 * @param {number} month - 1-indexed
 * @returns {import("@tanstack/react-query").UseQueryResult}
 */
export const useAttendanceHistory = (year, month) => {
  return useQuery({
    queryKey: [QK_HISTORY, year, month],
    queryFn: async ({ signal }) => {
      const response = await getAttendanceHistory({ year, month, signal })
      return response.data
    },
    staleTime: 5 * 60 * 1000,
    retry: 2,
  })
}

// ─── Employee Mutations ───────────────────────────────────────────────────────

/**
 * Mutation to clock in the current employee.
 * @returns {import("@tanstack/react-query").UseMutationResult}
 */
export const useClockIn = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: postClockIn,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: [QK_STATUS] })
      qc.invalidateQueries({ queryKey: [QK_TODAY] })
    },
  })
}

/**
 * Mutation to clock out the current employee. Requires { workSummary }.
 * @returns {import("@tanstack/react-query").UseMutationResult}
 */
export const useClockOut = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: postClockOut,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: [QK_STATUS] })
      qc.invalidateQueries({ queryKey: [QK_TODAY] })
    },
  })
}

// ─── Admin Queries ────────────────────────────────────────────────────────────

/**
 * Hook to fetch the admin activity log with filters.
 * @param {object} filters
 * @returns {import("@tanstack/react-query").UseQueryResult}
 */
export const useAdminAttendanceLogs = (filters = {}) => {
  return useQuery({
    queryKey: [QK_ADMIN_LOGS, filters],
    queryFn: async ({ signal }) => {
      const response = await getAdminAttendanceLogs({ ...filters, signal })
      return response.data
    },
    staleTime: 2 * 60 * 1000,
    retry: 2,
  })
}

/**
 * Hook to poll who is currently clocked in (admin live view).
 * @returns {import("@tanstack/react-query").UseQueryResult}
 */
export const useAdminLiveStatus = () => {
  return useQuery({
    queryKey: [QK_ADMIN_LIVE],
    queryFn: async ({ signal }) => {
      const response = await getAdminLiveStatus({ signal })
      return response.data
    },
    staleTime: 15 * 1000,
    refetchInterval: 30 * 1000,
    retry: 2,
  })
}

// ─── Admin Mutations ──────────────────────────────────────────────────────────

/**
 * Mutation to edit an attendance entry's times (admin).
 * @returns {import("@tanstack/react-query").UseMutationResult}
 */
export const useEditAttendanceEntry = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, data }) => patchAdminAttendanceEntry(id, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: [QK_ADMIN_LOGS] })
    },
  })
}

/**
 * Mutation to flag / unflag an attendance entry as suspicious (admin).
 * @returns {import("@tanstack/react-query").UseMutationResult}
 */
export const useFlagAttendanceEntry = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, data }) => patchAdminFlagEntry(id, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: [QK_ADMIN_LOGS] })
    },
  })
}

/**
 * Mutation to add a manual attendance entry on behalf of an employee (admin).
 * @returns {import("@tanstack/react-query").UseMutationResult}
 */
export const useAddManualAttendanceEntry = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: postAdminManualEntry,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: [QK_ADMIN_LOGS] })
      qc.invalidateQueries({ queryKey: [QK_ADMIN_LIVE] })
    },
  })
}

/**
 * Fetch daily/weekly/monthly attendance summary stats (admin only).
 * Cached for 5 minutes.
 * @returns {import("@tanstack/react-query").UseQueryResult}
 */
export const useAdminAttendanceSummary = () => {
  return useQuery({
    queryKey: [QK_ADMIN_SUMMARY],
    queryFn: ({ signal }) => getAdminAttendanceSummary({ signal }),
    staleTime: 5 * 60 * 1000,
  })
}

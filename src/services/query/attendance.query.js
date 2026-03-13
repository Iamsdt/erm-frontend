import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"

import { toast } from "@/components/ui/use-toast"
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

const GENERIC_ERROR_DESCRIPTION = "Something went wrong. Please try again."

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
 * @param {number} year - 4-digit year
 * @param {number} month - 1-indexed
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
 */
export const useClockIn = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: postClockIn,
    onSuccess: () => {
      toast({
        title: "Clocked in",
        description: "You have been clocked in successfully.",
      })
      qc.invalidateQueries({ queryKey: [QK_STATUS] })
      qc.invalidateQueries({ queryKey: [QK_TODAY] })
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
 * Mutation to clock out the current employee. Requires { workSummary }.
 */
export const useClockOut = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: postClockOut,
    onSuccess: () => {
      toast({
        title: "Clocked out",
        description: "You have been clocked out successfully.",
      })
      qc.invalidateQueries({ queryKey: [QK_STATUS] })
      qc.invalidateQueries({ queryKey: [QK_TODAY] })
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

// ─── Admin Queries ────────────────────────────────────────────────────────────

/**
 * Hook to fetch the admin activity log with filters.
 * @param {object} filters - Filter object with optional keys: employeeId, dateFrom, dateTo, showSuspiciousOnly
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
 */
export const useEditAttendanceEntry = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, data }) => patchAdminAttendanceEntry(id, data),
    onSuccess: () => {
      toast({
        title: "Entry updated",
        description: "Attendance entry has been updated.",
      })
      qc.invalidateQueries({ queryKey: [QK_ADMIN_LOGS] })
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
 * Mutation to flag / unflag an attendance entry as suspicious (admin).
 */
export const useFlagAttendanceEntry = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, data }) => patchAdminFlagEntry(id, data),
    onSuccess: () => {
      toast({
        title: "Entry flagged",
        description: "Attendance entry flag has been updated.",
      })
      qc.invalidateQueries({ queryKey: [QK_ADMIN_LOGS] })
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
 * Mutation to add a manual attendance entry on behalf of an employee (admin).
 */
export const useAddManualAttendanceEntry = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: postAdminManualEntry,
    onSuccess: () => {
      toast({
        title: "Entry added",
        description: "Manual attendance entry has been added.",
      })
      qc.invalidateQueries({ queryKey: [QK_ADMIN_LOGS] })
      qc.invalidateQueries({ queryKey: [QK_ADMIN_LIVE] })
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
 * Fetch daily/weekly/monthly attendance summary stats (admin only).
 * Cached for 5 minutes.
 */
export const useAdminAttendanceSummary = () => {
  return useQuery({
    queryKey: [QK_ADMIN_SUMMARY],
    queryFn: ({ signal }) => getAdminAttendanceSummary({ signal }),
    staleTime: 5 * 60 * 1000,
  })
}

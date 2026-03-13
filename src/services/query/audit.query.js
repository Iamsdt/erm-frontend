import { useQuery } from "@tanstack/react-query"

import { getAuditLog } from "@api/audit.api"

const QUERY_KEY = "audit-log"

/**
 * React Query hook to fetch audit log entries with optional filters.
 * @param {object} filters - Filter parameters
 * @param {string} [filters.module] - Module filter (leave, attendance, etc.)
 * @param {string} [filters.action] - Action filter (created, updated, etc.)
 * @param {string} [filters.dateFrom] - Start date filter (ISO string)
 * @param {string} [filters.dateTo] - End date filter (ISO string)
 * @returns {import("@tanstack/react-query").UseQueryResult} Query result with audit entries
 */
export const useFetchAuditLog = (filters = {}) => {
  return useQuery({
    queryKey: [QUERY_KEY, filters],
    queryFn: async ({ signal }) => {
      const response = await getAuditLog({ signal, params: filters })
      return response.data
    },
    staleTime: 30 * 1000,
    retry: 2,
  })
}

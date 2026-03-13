import ct from "@constants/"

import api from "."

/**
 * Fetches audit log entries with optional filters.
 * @async
 * @param {object} options - Request options
 * @param {AbortSignal} [options.signal] - Abort signal for request cancellation
 * @param {object} [options.params] - Query parameters (module, action, userId, dateFrom, dateTo)
 * @returns {Promise} API response with audit log entries
 */
export const getAuditLog = async ({ signal, params } = {}) => {
  return api.get(ct.api.audit.log, { signal, params })
}

import ct from "@constants/"

import api from "."

/**
 * Fetches attendance records for a specific month/year.
 * @param {object} options
 * @param {number} options.year
 * @param {number} options.month - 0-indexed (0=Jan)
 * @param {AbortSignal} [options.signal]
 * @returns {Promise}
 */
export const getMonthlyAttendance = async ({ year, month, signal } = {}) => {
  const config = {
    headers: { "Content-Type": "application/json" },
    params: { year, month },
    signal,
  }
  return api.get(ct.api.leave.attendance, config)
}

/**
 * Fetches admin leave dashboard summary.
 * @param {object} options
 * @param {AbortSignal} [options.signal]
 * @returns {Promise}
 */
export const getAdminLeaveSummary = async ({ signal } = {}) => {
  const config = { headers: { "Content-Type": "application/json" }, signal }
  return api.get(ct.api.leave.adminSummary, config)
}

/**
 * Fetches the current employee's leave profile.
 * @param {object} options
 * @param {AbortSignal} [options.signal]
 * @returns {Promise}
 */
export const getEmployeeLeaveProfile = async ({ signal } = {}) => {
  const config = { headers: { "Content-Type": "application/json" }, signal }
  return api.get(ct.api.leave.employeeProfile, config)
}

/**
 * Fetches the full list of leave approval requests.
 * @param {object} options
 * @param {AbortSignal} [options.signal]
 * @returns {Promise}
 */
export const getAdminApprovals = async ({ signal } = {}) => {
  const config = { headers: { "Content-Type": "application/json" }, signal }
  return api.get(ct.api.leave.adminApprovals, config)
}

/**
 * Approves or rejects a leave request.
 * @param {number} id
 * @param {"approved"|"rejected"} status
 * @param {string} [note]
 * @returns {Promise}
 */
export const patchLeaveApproval = async (id, status, note = "") => {
  return api.patch(`${ct.api.leave.adminApprovalAction}/${id}/`, {
    status,
    note,
  })
}

/**
 * Fetches the employee list for manual record selection.
 * @param {object} options
 * @param {AbortSignal} [options.signal]
 * @returns {Promise}
 */
export const getAdminEmployees = async ({ signal } = {}) => {
  const config = { headers: { "Content-Type": "application/json" }, signal }
  return api.get(ct.api.leave.adminEmployees, config)
}

/**
 * Posts a manual attendance record for an employee.
 * @param {object} payload
 * @returns {Promise}
 */
export const postManualRecord = async (payload) => {
  return api.post(ct.api.leave.adminManualRecord, payload)
}

/**
 * Posts a leave request from the employee.
 * @param {object} payload
 * @returns {Promise}
 */
export const postLeaveRequest = async (payload) => {
  return api.post(ct.api.leave.employeeRequest, payload)
}

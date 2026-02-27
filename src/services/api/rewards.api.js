import ct from "@constants/"

import api from "."

/**
 * Fetches all rewards (admin view).
 * @async
 * @param {object} options - Request options
 * @param {AbortSignal} [options.signal] - Abort signal for request cancellation
 * @returns {Promise} API response with all rewards
 */
export const getRewards = async ({ signal } = {}) => {
  return api.get(ct.api.rewards.list, { signal })
}

/**
 * Fetches rewards for the current authenticated user.
 * @async
 * @param {object} options - Request options
 * @param {AbortSignal} [options.signal] - Abort signal for request cancellation
 * @returns {Promise} API response with user's rewards
 */
export const getMyRewards = async ({ signal } = {}) => {
  return api.get(ct.api.rewards.myRewards, { signal })
}

/**
 * Grants a reward to an employee (admin only).
 * @async
 * @param {object} payload - Reward payload
 * @param {string|number} payload.employeeId - Recipient employee ID
 * @param {string} payload.type - Reward type (star | trophy | certificate | bonus)
 * @param {string} payload.title - Reward title
 * @param {string} payload.description - Reward description / reason
 * @param {number} [payload.points] - Optional points value
 * @returns {Promise} API response with created reward
 */
export const postReward = async (payload) => {
  return api.post(ct.api.rewards.create, payload)
}

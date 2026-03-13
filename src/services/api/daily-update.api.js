import ct from "@constants/"

import api from "."

/**
 * Fetches today's team standup updates.
 * @async
 * @param {object} options - Request options
 * @param {AbortSignal} [options.signal] - Abort signal for request cancellation
 * @returns {Promise} API response with standup entries
 */
export const getStandups = async ({ signal } = {}) => {
  return api.get(ct.api.dailyUpdate.standups, { signal })
}

/**
 * Submits a new daily standup.
 * @async
 * @param {object} payload - Standup form data (array of project updates)
 * @returns {Promise} API response with submission ID
 */
export const submitStandup = async (payload) => {
  return api.post(ct.api.dailyUpdate.submitStandup, payload)
}

/**
 * Fetches team updates across all departments.
 * @async
 * @param {object} options - Request options
 * @param {AbortSignal} [options.signal] - Abort signal for request cancellation
 * @returns {Promise} API response with teams and their member updates
 */
export const getTeamUpdates = async ({ signal } = {}) => {
  return api.get(ct.api.dailyUpdate.teamUpdates, { signal })
}

/**
 * Fetches progress log entries grouped by date.
 * @async
 * @param {object} options - Request options
 * @param {AbortSignal} [options.signal] - Abort signal for request cancellation
 * @returns {Promise} API response with progress entries
 */
export const getProgressLog = async ({ signal } = {}) => {
  return api.get(ct.api.dailyUpdate.progressLog, { signal })
}

/**
 * Fetches available projects for standup form.
 * @async
 * @param {object} options - Request options
 * @param {AbortSignal} [options.signal] - Abort signal for request cancellation
 * @returns {Promise} API response with project list
 */
export const getStandupProjects = async ({ signal } = {}) => {
  return api.get(ct.api.dailyUpdate.projects, { signal })
}

/**
 * Fetches user stories for a specific project.
 * @async
 * @param {string} projectId - Project ID
 * @param {object} options - Request options
 * @param {AbortSignal} [options.signal] - Abort signal for request cancellation
 * @returns {Promise} API response with user stories
 */
export const getUserStories = async (projectId, { signal } = {}) => {
  return api.get(ct.api.dailyUpdate.userStories(projectId), { signal })
}

/**
 * Submits standup for AI review and receives feedback.
 * @async
 * @param {object} payload - Standup data for review
 * @returns {Promise} API response with AI review result (approved/rejected + feedback)
 */
export const submitAiReview = async (payload) => {
  return api.post(ct.api.dailyUpdate.aiReview, payload)
}

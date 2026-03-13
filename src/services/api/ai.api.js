import ct from "@constants/"

import api from "."

/**
 * Fetches AI-powered insights about team performance.
 * @async
 * @param {object} options - Request options
 * @param {AbortSignal} [options.signal] - Abort signal for request cancellation
 * @returns {Promise} API response with insights and stats
 */
export const getInsights = async ({ signal } = {}) => {
  return api.get(ct.api.ai.insights, { signal })
}

/**
 * Fetches AI-generated process improvement recommendations.
 * @async
 * @param {object} options - Request options
 * @param {AbortSignal} [options.signal] - Abort signal for request cancellation
 * @returns {Promise} API response with recommendations and stats
 */
export const getRecommendations = async ({ signal } = {}) => {
  return api.get(ct.api.ai.recommendations, { signal })
}

/**
 * Fetches AI analytics data (metrics, predictions, ML models, pipeline).
 * @async
 * @param {object} options - Request options
 * @param {AbortSignal} [options.signal] - Abort signal for request cancellation
 * @returns {Promise} API response with analytics data
 */
export const getAnalytics = async ({ signal } = {}) => {
  return api.get(ct.api.ai.analytics, { signal })
}

/**
 * Updates the status of an AI recommendation (adopt, dismiss, etc.).
 * @async
 * @param {string|number} id - Recommendation ID
 * @param {object} payload - Update payload (e.g. { status: "in-progress" })
 * @returns {Promise} API response with updated recommendation
 */
export const updateRecommendation = async (id, payload) => {
  return api.patch(`${ct.api.ai.updateRecommendation}/${id}`, payload)
}

/**
 * Sends a message to the AI assistant and receives a response.
 * @async
 * @param {object} payload - Chat message payload
 * @param {string} payload.message - User's message
 * @param {string} [payload.sprintId] - Sprint context for the AI
 * @returns {Promise} API response with AI reply
 */
export const sendAiChat = async (payload) => {
  return api.post(ct.api.ai.chat, payload)
}

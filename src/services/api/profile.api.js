import ct from "@constants/"

import api from "."

/**
 * Fetches the current authenticated user's profile.
 * @async
 * @param {object} options - Request options
 * @param {AbortSignal} [options.signal] - Abort signal for request cancellation
 * @returns {Promise} API response with profile data
 */
export const getMyProfile = async ({ signal } = {}) => {
  return api.get(ct.api.profile.me, { signal })
}

/**
 * Updates the current authenticated user's profile.
 * @async
 * @param {object} payload - Profile update payload
 * @param {string} [payload.name] - Full name
 * @param {string} [payload.phone] - Phone number
 * @param {string} [payload.bio] - Short bio
 * @param {string} [payload.jobTitle] - Job title
 * @param {string} [payload.avatarUrl] - Avatar image URL
 * @returns {Promise} API response with updated profile
 */
export const patchMyProfile = async (payload) => {
  return api.patch(ct.api.profile.update, payload)
}

/**
 * Changes the current user's password.
 * @async
 * @param {object} payload - Password change payload
 * @param {string} payload.currentPassword - Current password
 * @param {string} payload.newPassword - New password
 * @returns {Promise} API response
 */
export const postChangePassword = async (payload) => {
  return api.post(ct.api.profile.changePassword, payload)
}

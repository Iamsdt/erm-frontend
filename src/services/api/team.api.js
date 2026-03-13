import ct from "@constants/"

import api from "."

/**
 * Fetches all teams.
 * @async
 * @param {object} options - Request options
 * @param {AbortSignal} [options.signal] - Abort signal for request cancellation
 * @returns {Promise} API response with teams list
 */
export const getTeams = async ({ signal } = {}) => {
  return api.get(ct.api.team.list, { signal })
}

/**
 * Creates a new team.
 * @async
 * @param {object} payload - Team creation data
 * @param {string} payload.name - Team name
 * @param {string} [payload.leadId] - Team lead employee ID
 * @param {string[]} [payload.memberIds] - Team member employee IDs
 * @returns {Promise} API response with created team
 */
export const createTeam = async (payload) => {
  return api.post(ct.api.team.create, payload)
}

/**
 * Updates a team's responsibilities.
 * @async
 * @param {string} id - Team ID
 * @param {object} payload - Responsibilities data
 * @returns {Promise} API response with updated team
 */
export const updateTeamResponsibilities = async (id, payload) => {
  return api.patch(
    `${ct.api.team.updateResponsibilities}/${id}/responsibilities`,
    payload
  )
}

/**
 * Deletes a team by ID.
 * @async
 * @param {string} id - Team ID
 * @returns {Promise} API response
 */
export const deleteTeam = async (id) => {
  return api.delete(`${ct.api.team.detail}/${id}`)
}

/**
 * Removes a member from a team.
 * @async
 * @param {string} teamId - Team ID
 * @param {string} memberId - Member ID to remove
 * @returns {Promise} API response with updated team
 */
export const removeTeamMember = async (teamId, memberId) => {
  return api.delete(`${ct.api.team.detail}/${teamId}/members/${memberId}`)
}

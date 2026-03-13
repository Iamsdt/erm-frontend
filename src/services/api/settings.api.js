import api from "."

/**
 * Fetches the current user's app settings.
 * @returns {Promise} API response with settings data
 */
export const getSettings = async () => {
  const response = await api.get("settings/")
  return response.data
}

/**
 * Updates the current user's app settings.
 * @param {object} data - Settings data to update
 * @returns {Promise} API response with updated settings
 */
export const updateSettings = async (data) => {
  const response = await api.patch("settings/", data)
  return response.data
}
